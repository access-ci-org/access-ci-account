// Basic browser smoke test: loads each route in a headless browser and
// fails if anything is logged to the console as an error (including
// uncaught exceptions and unhandled promise rejections), or if the route
// silently redirects somewhere else instead of rendering.
//
// This intentionally does not exercise page behavior beyond initial
// render — it's a cheap guard against "the page doesn't even load"
// regressions, not a substitute for the component/unit tests.
import { fileURLToPath } from "node:url";
import http from "node:http";
import { createServer } from "vite";
import puppeteer from "puppeteer";

const BASE = "/access-ci-account/";

const SMOKE_USERNAME = "smoketestuser";
const SMOKE_EMAIL = "smoketest@example.edu";

// Routes that render without an authenticated session. A stub API server
// (below) stands in for the backend so pages that redirect to /login
// (which itself calls the backend on mount) don't fail with a raw
// connection error.
const PUBLIC_ROUTES = ["/", "/register", "/password", "/add-ssh-key", "/login"];

// Routes that only render their real content behind a logged-in session;
// otherwise their loaders redirect to /login before ever mounting. These
// get a seeded fake session (localStorage) plus stub API responses shaped
// like the real backend, so the page itself — not just the /login
// fallback — gets exercised.
const AUTH_ROUTES = ["/profile", "/ssh-keys", "/linked-accounts"];

// Not tested:
//   - /logout: unconditionally navigates to an external CILogon URL.
//   - /auth-token/$client, /$flow/verify: only reachable mid-flow with
//     state (OTP tokens, in-memory form data) that a direct page load
//     can't reconstruct.
//   - /register/aup, /register/complete, /register/success: gated on
//     registrationFormAtom / accountCreateStatusAtom, which are plain
//     in-memory Jotai atoms (not persisted to localStorage) and reset on
//     every full page load — there's no way to seed them from outside a
//     live, uninterrupted registration flow.

function base64url(obj) {
  return Buffer.from(JSON.stringify(obj)).toString("base64url");
}

// A JWT is only ever *decoded* client-side (see src/helpers/jwt.ts), never
// signature-verified, so any well-formed 3-segment token satisfies the app.
function makeFakeJwt(claims) {
  const header = base64url({ alg: "none", typ: "JWT" });
  const payload = base64url(claims);
  return `${header}.${payload}.smoke-test-signature`;
}

// Minimal stand-in for the backend API. Answers the handful of endpoints
// the authenticated pages call on load with realistically shaped JSON, and
// everything else with a benign 404 (with CORS headers) so `fetch()`
// resolves instead of throwing a connection error. The app already treats
// non-2xx API responses as recoverable ({ error }), so routes that hit the
// 404 fallback stay on their normal "not logged in" / "request failed"
// path without needing a real backend running.
function startStubApi() {
  const server = http.createServer((req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "*");
    if (req.method === "OPTIONS") {
      res.writeHead(204);
      res.end();
      return;
    }

    const path = new URL(req.url, "http://stub").pathname;
    const send = (body) => {
      res.writeHead(200, { "content-type": "application/json" });
      res.end(JSON.stringify(body));
    };

    if (req.method === "GET" && path === `/api/v1/account/${SMOKE_USERNAME}`) {
      return send({
        username: SMOKE_USERNAME,
        firstName: "Smoke",
        lastName: "Test",
        email: SMOKE_EMAIL,
        organizationId: 1,
        academicStatusId: 1,
        residenceCountryId: 1,
        citizenshipCountryIds: [1],
        department: "Testing",
        degrees: [],
        timeZone: "",
        role: [],
      });
    }

    if (req.method === "GET" && path === `/api/v1/account/${SMOKE_USERNAME}/ssh-key`) {
      return send({ sshKeys: [] });
    }

    if (req.method === "GET" && path === `/api/v1/account/${SMOKE_USERNAME}/identity`) {
      return send({ identities: [] });
    }

    if (req.method === "GET" && path.startsWith("/api/v1/domain/")) {
      return send({ domain: path.split("/").pop(), organizations: [], idps: [] });
    }

    res.writeHead(404, { "content-type": "application/json" });
    res.end(JSON.stringify({ detail: "not found (smoke-test stub)" }));
  });
  return new Promise((resolve) => {
    server.listen(0, () => resolve(server));
  });
}

async function checkRoute(browser, origin, route, { auth = false } = {}) {
  const context = await browser.createBrowserContext();
  const page = await context.newPage();
  const errors = [];

  if (auth) {
    const jwt = makeFakeJwt({
      sub: SMOKE_EMAIL,
      uid: SMOKE_USERNAME,
      exp: Math.floor(Date.now() / 1000) + 3600,
    });
    await page.evaluateOnNewDocument(
      (loginTokens, username) => {
        localStorage.setItem("loginTokens", JSON.stringify(loginTokens));
        localStorage.setItem("username", JSON.stringify(username));
      },
      { accessToken: jwt, refreshToken: "smoke-test-refresh" },
      SMOKE_USERNAME,
    );
  }

  page.on("console", (msg) => {
    if (msg.type() !== "error") return;
    // Chrome logs any non-2xx network response as a console "error", even
    // when app code handles the failure gracefully (the norm here against
    // the stub API's 404 fallback). Only real JS-level errors matter.
    if (msg.text().startsWith("Failed to load resource:")) return;
    errors.push(msg.text());
  });
  page.on("pageerror", (err) => errors.push(String(err)));

  const url = new URL(route.replace(/^\//, ""), origin + BASE).toString();

  try {
    await page.goto(url, { waitUntil: "load", timeout: 15000 });
    // Let effects/loaders that run after initial paint finish.
    await new Promise((resolve) => setTimeout(resolve, 500));

    const finalUrl = page.url();
    if (finalUrl !== url) {
      errors.push(`redirected to ${finalUrl} instead of rendering`);
    }
  } catch (err) {
    errors.push(`navigation failed: ${err}`);
  }

  await context.close();
  return errors;
}

async function main() {
  const stubApi = await startStubApi();
  process.env.VITE_API_BASE_URL = `http://localhost:${stubApi.address().port}/api/v1`;

  const server = await createServer({
    configFile: fileURLToPath(new URL("../vite.config.ts", import.meta.url)),
    base: BASE,
    server: { port: 0 },
    logLevel: "warn",
  });
  await server.listen();
  const { port } = server.httpServer.address();
  const origin = `http://localhost:${port}`;

  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const routes = [
    ...PUBLIC_ROUTES.map((route) => ({ route, auth: false })),
    ...AUTH_ROUTES.map((route) => ({ route, auth: true })),
  ];

  let failures = 0;

  try {
    for (const { route, auth } of routes) {
      const errors = await checkRoute(browser, origin, route, { auth });

      if (errors.length > 0) {
        failures += 1;
        console.error(`✗ ${route}`);
        for (const err of errors) console.error(`    ${err}`);
      } else {
        console.log(`✓ ${route}`);
      }
    }
  } finally {
    await browser.close();
    await server.close();
    await new Promise((resolve) => stubApi.close(resolve));
  }

  if (failures > 0) {
    console.error(`\n${failures}/${routes.length} route(s) failed.`);
    process.exit(1);
  }

  console.log(`\nAll ${routes.length} routes loaded cleanly.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
