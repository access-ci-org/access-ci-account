import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import {
  makeJwt,
  makeAccount,
  makeAccountApiResponse,
  makeOrganization,
  fakeResponse,
} from "@/test/utils";

// state.ts keeps a module-level singleton `store` and permanently caches
// no-dependency async atoms (e.g. oidcInfoAtom). Re-importing a fresh module
// per test gives each test an isolated store and cache.
type StateModule = typeof import("@/helpers/state");
let state: StateModule;

beforeEach(async () => {
  vi.resetModules();
  state = await import("@/helpers/state");
});

afterEach(() => {
  vi.unstubAllGlobals();
});

/** Install a global fetch stub whose behavior is driven by URL/init. */
function stubFetch(impl: (url: string, init: any) => Response | Promise<Response>) {
  const fn = vi.fn((url: string, init: any) => Promise.resolve(impl(url, init)));
  vi.stubGlobal("fetch", fn);
  return fn;
}

/** A valid OTP/login token whose JWT expires in the future. */
const unexpiredJwt = () => makeJwt({ exp: Math.floor(Date.now() / 1000) + 3600 });
const expiredJwt = () => makeJwt({ exp: Math.floor(Date.now() / 1000) - 3600 });

describe("fetchJson — auth contract & response handling", () => {
  it("treats accessToken=null as a public request and returns parsed JSON", async () => {
    const fetchFn = stubFetch(() => fakeResponse({ status: 200, json: { ok: true } }));
    const result = await state.fetchJson<{ ok: boolean }>("https://x/api", {
      accessToken: null,
    });
    expect(result).toEqual({ ok: true });
    expect(fetchFn.mock.calls[0][1].headers.get("Authorization")).toBeNull();
  });

  it("adds a Bearer header when a token is provided", async () => {
    const fetchFn = stubFetch(() => fakeResponse({ status: 200, json: {} }));
    await state.fetchJson("https://x/api", { accessToken: "abc" });
    expect(fetchFn.mock.calls[0][1].headers.get("Authorization")).toBe(
      "Bearer abc",
    );
  });

  it("returns a 'Not authenticated' error without calling fetch when token is undefined", async () => {
    const fetchFn = stubFetch(() => fakeResponse({ status: 200, json: {} }));
    const result = await state.fetchJson("https://x/api");
    expect(result).toEqual({ error: { message: "Not authenticated" } });
    expect(fetchFn).not.toHaveBeenCalled();
  });

  it("maps a non-2xx response to an error using the `detail` field", async () => {
    stubFetch(() => fakeResponse({ status: 500, json: { detail: "boom" } }));
    const result = await state.fetchJson("https://x/api", { accessToken: "t" });
    expect(result).toEqual({ error: { status: 500, message: "boom" } });
  });

  it("falls back to response text when the error body is not JSON", async () => {
    stubFetch(() => fakeResponse({ status: 502, text: "bad gateway" }));
    const result = await state.fetchJson("https://x/api", { accessToken: "t" });
    expect(result).toEqual({ error: { status: 502, message: "bad gateway" } });
  });

  it("returns an error when a 2xx body fails to parse", async () => {
    stubFetch(() => fakeResponse({ status: 200 })); // json() rejects
    const result = await state.fetchJson("https://x/api", { accessToken: "t" });
    expect("error" in result).toBe(true);
  });
});

describe("token & expiry atoms", () => {
  it("isLoggedInAtom reflects the presence of a login access token", () => {
    const { store, isLoggedInAtom, loginTokensAtom } = state;
    expect(store.get(isLoggedInAtom)).toBe(false);
    store.set(loginTokensAtom, { accessToken: "a", refreshToken: "r" });
    expect(store.get(isLoggedInAtom)).toBe(true);
  });

  it("hasOtpTokenAtom is true only for an unexpired OTP JWT", () => {
    const { store, hasOtpTokenAtom, otpTokensAtom } = state;
    expect(store.get(hasOtpTokenAtom)).toBe(false); // empty token

    store.set(otpTokensAtom, { accessToken: expiredJwt(), refreshToken: "" });
    expect(store.get(hasOtpTokenAtom)).toBe(false);

    store.set(otpTokensAtom, { accessToken: unexpiredJwt(), refreshToken: "" });
    expect(store.get(hasOtpTokenAtom)).toBe(true);
  });

  it("hasOtpTokenAtom is false for a JWT without an exp claim", () => {
    const { store, hasOtpTokenAtom, otpTokensAtom } = state;
    store.set(otpTokensAtom, {
      accessToken: makeJwt({ uid: "x" }),
      refreshToken: "",
    });
    expect(store.get(hasOtpTokenAtom)).toBe(false);
  });
});

describe("impersonation", () => {
  it("isAdminAtom / isImpersonatingAtom derive from the admin username", () => {
    const { store, isAdminAtom, isImpersonatingAtom, adminUsernameAtom, usernameAtom } =
      state;
    expect(store.get(isAdminAtom)).toBe(false);

    store.set(adminUsernameAtom, "admin");
    store.set(usernameAtom, "admin");
    expect(store.get(isAdminAtom)).toBe(true);
    expect(store.get(isImpersonatingAtom)).toBe(false);

    store.set(usernameAtom, "victim");
    expect(store.get(isImpersonatingAtom)).toBe(true);
  });

  it("impersonateAtom switches the username and loads that account (admins only)", async () => {
    const { store, impersonateAtom, adminUsernameAtom, usernameAtom, loginTokensAtom } =
      state;
    const account = makeAccount({ username: "victim" });
    stubFetch(() =>
      fakeResponse({
        status: 200,
        json: makeAccountApiResponse({ username: "victim" }),
      }),
    );

    // Not an admin: no-op.
    await store.set(impersonateAtom, "victim");
    expect(store.get(usernameAtom)).toBe("");

    store.set(adminUsernameAtom, "admin");
    store.set(loginTokensAtom, { accessToken: "t", refreshToken: "" });
    const result = await store.set(impersonateAtom, "victim");
    expect(store.get(usernameAtom)).toBe("victim");
    expect(result).toEqual(account);
  });

  it("stopImpersonatingAtom returns to the admin's own username", async () => {
    const { store, impersonateAtom, stopImpersonatingAtom, adminUsernameAtom, usernameAtom, loginTokensAtom } =
      state;
    stubFetch(() =>
      fakeResponse({ status: 200, json: makeAccountApiResponse() }),
    );
    store.set(adminUsernameAtom, "admin");
    store.set(loginTokensAtom, { accessToken: "t", refreshToken: "" });
    await store.set(impersonateAtom, "victim");
    expect(store.get(usernameAtom)).toBe("victim");

    await store.set(stopImpersonatingAtom);
    expect(store.get(usernameAtom)).toBe("admin");
  });
});

describe("fetchApiJson — 401 refresh & retry (via accountAtom)", () => {
  function oidcHandler(accountResponses: Response[]) {
    let accountCalls = 0;
    return (url: string) => {
      if (url.includes("/auth/info"))
        return fakeResponse({
          status: 200,
          json: {
            authorizationUrl: "https://cilogon.org/authorize",
            clientIds: { login: "L", link: "K" },
          },
        });
      if (url.includes("/oauth2/token"))
        return fakeResponse({
          status: 200,
          json: { accessToken: "new", refreshToken: "r2" },
        });
      if (url.includes("/account/"))
        return accountResponses[accountCalls++] ?? accountResponses.at(-1)!;
      throw new Error("unexpected url " + url);
    };
  }

  it("refreshes on 401 and retries the request once", async () => {
    const { store, accountAtom, usernameAtom, loginTokensAtom } = state;
    const account = makeAccount({ username: "ada" });
    store.set(usernameAtom, "ada");
    store.set(loginTokensAtom, { accessToken: "old", refreshToken: "r" });

    const fetchFn = stubFetch(
      oidcHandler([
        fakeResponse({ status: 401, json: { detail: "expired" } }),
        fakeResponse({
          status: 200,
          json: makeAccountApiResponse({ username: "ada" }),
        }),
      ]),
    );

    store.set(accountAtom);
    const result = await store.get(accountAtom);

    expect(result).toEqual(account);
    expect(store.get(loginTokensAtom)).toEqual({
      accessToken: "new",
      refreshToken: "r2",
    });
    const accountCalls = fetchFn.mock.calls.filter((c) =>
      String(c[0]).includes("/account/"),
    );
    expect(accountCalls).toHaveLength(2);
  });

  it("returns the original 401 error when the refresh fails", async () => {
    const { store, accountAtom, usernameAtom, loginTokensAtom } = state;
    store.set(usernameAtom, "ada");
    store.set(loginTokensAtom, { accessToken: "old", refreshToken: "r" });

    const fetchFn = stubFetch((url: string) => {
      if (url.includes("/auth/info"))
        return fakeResponse({ status: 500, json: { detail: "down" } });
      if (url.includes("/account/"))
        return fakeResponse({ status: 401, json: { detail: "expired" } });
      throw new Error("unexpected url " + url);
    });

    store.set(accountAtom);
    const result = await store.get(accountAtom);

    expect("error" in result && result.error.status).toBe(401);
    const accountCalls = fetchFn.mock.calls.filter((c) =>
      String(c[0]).includes("/account/"),
    );
    expect(accountCalls).toHaveLength(1); // no retry
  });
});

describe("verifyOtpAtom", () => {
  it("errors when email or OTP is missing", async () => {
    const { store, verifyOtpAtom } = state;
    const status = await store.set(verifyOtpAtom);
    expect(status.verified).toBe(false);
    expect(status.error).toMatch(/not set/);
  });

  it("verifies, extracts the username from the JWT, and stores the OTP token", async () => {
    const { store, verifyOtpAtom, emailAtom, otpAtom, otpTokensAtom } = state;
    const jwt = makeJwt({ uid: "alovelace" });
    stubFetch(() => fakeResponse({ status: 200, json: { jwt } }));

    store.set(emailAtom, "ada@example.edu");
    store.set(otpAtom, "123456");
    const status = await store.set(verifyOtpAtom);

    expect(status.verified).toBe(true);
    expect(status.username).toBe("alovelace");
    expect(store.get(otpTokensAtom)).toEqual({ accessToken: jwt, refreshToken: "" });
  });

  it("surfaces a verification error", async () => {
    const { store, verifyOtpAtom, emailAtom, otpAtom } = state;
    stubFetch(() =>
      fakeResponse({ status: 400, json: { detail: "Invalid code" } }),
    );
    store.set(emailAtom, "ada@example.edu");
    store.set(otpAtom, "000000");
    const status = await store.set(verifyOtpAtom);
    expect(status.verified).toBe(false);
    expect(status.error).toBe("Invalid code");
  });
});

describe("sendOtpAtom", () => {
  it("errors and notifies when no email is set", async () => {
    const { store, sendOtpAtom, notificationsAtom } = state;
    const status = await store.set(sendOtpAtom);
    expect(status.sent).toBe(false);
    expect(status.error).toMatch(/not set/);
    expect(store.get(notificationsAtom)).toHaveLength(1);
  });

  it("reports success when the code is sent", async () => {
    const { store, sendOtpAtom, emailAtom } = state;
    stubFetch(() => fakeResponse({ status: 200, json: { success: true } }));
    store.set(emailAtom, "ada@example.edu");
    const status = await store.set(sendOtpAtom);
    expect(status).toEqual({ error: "", sent: true });
  });

  it("gives a rate-limit message on HTTP 429", async () => {
    const { store, sendOtpAtom, emailAtom } = state;
    stubFetch(() => fakeResponse({ status: 429, json: { detail: "slow down" } }));
    store.set(emailAtom, "ada@example.edu");
    const status = await store.set(sendOtpAtom);
    expect(status.sent).toBe(false);
    expect(status.error).toMatch(/exceeded the limit/);
  });
});

describe("updatePasswordAtom", () => {
  it("refuses and notifies when neither logged in nor OTP-verified", async () => {
    const { store, updatePasswordAtom, notificationsAtom } = state;
    const ok = await store.set(updatePasswordAtom, "NewPassw0rd!x");
    expect(ok).toBe(false);
    const note = store.get(notificationsAtom)[0];
    expect(note.message).toMatch(/logged in or verify your email/);
  });

  it("updates via the logged-in endpoint and notifies success", async () => {
    const { store, updatePasswordAtom, loginTokensAtom, usernameAtom, notificationsAtom } =
      state;
    const fetchFn = stubFetch(() =>
      fakeResponse({ status: 200, json: { success: true } }),
    );
    store.set(usernameAtom, "ada");
    store.set(loginTokensAtom, { accessToken: "t", refreshToken: "" });

    const ok = await store.set(updatePasswordAtom, "NewPassw0rd!x");
    expect(ok).toBe(true);
    expect(String(fetchFn.mock.calls[0][0])).toContain("/account/ada/password");
    expect(store.get(notificationsAtom).some((n) => n.title === "Password Updated")).toBe(
      true,
    );
  });

  it("uses the password-reset endpoint on the OTP path", async () => {
    const { store, updatePasswordAtom, otpTokensAtom } = state;
    const fetchFn = stubFetch(() =>
      fakeResponse({ status: 200, json: { success: true } }),
    );
    store.set(otpTokensAtom, { accessToken: unexpiredJwt(), refreshToken: "" });

    const ok = await store.set(updatePasswordAtom, "NewPassw0rd!x");
    expect(ok).toBe(true);
    expect(String(fetchFn.mock.calls[0][0])).toContain("/auth/password-reset");
  });

  it("rewrites the 'previous password' error message", async () => {
    const { store, updatePasswordAtom, loginTokensAtom, usernameAtom, notificationsAtom } =
      state;
    stubFetch(() =>
      fakeResponse({
        status: 400,
        json: { detail: "This matches a previous password." },
      }),
    );
    store.set(usernameAtom, "ada");
    store.set(loginTokensAtom, { accessToken: "t", refreshToken: "" });

    const ok = await store.set(updatePasswordAtom, "NewPassw0rd!x");
    expect(ok).toBe(false);
    const note = store.get(notificationsAtom)[0];
    expect(note.message).toMatch(/matches a previous password/);
  });

  it("suppresses the success notification when notifySuccess is false", async () => {
    const { store, updatePasswordAtom, loginTokensAtom, usernameAtom, notificationsAtom } =
      state;
    stubFetch(() => fakeResponse({ status: 200, json: { success: true } }));
    store.set(usernameAtom, "ada");
    store.set(loginTokensAtom, { accessToken: "t", refreshToken: "" });

    const ok = await store.set(updatePasswordAtom, "NewPassw0rd!x", false);
    expect(ok).toBe(true);
    expect(store.get(notificationsAtom)).toHaveLength(0);
  });
});

describe("createAccountAtom", () => {
  it("creates the account, sets the welcome flag, and resets state", async () => {
    const { store, createAccountAtom, linkTokensAtom, otpTokensAtom, showWelcomeMessageAtom } =
      state;
    stubFetch((url: string) => {
      if (url.includes("/account"))
        return fakeResponse({
          status: 200,
          json: { success: true, access_id: "ACC123" },
        });
      throw new Error("unexpected url " + url);
    });
    // A link access token but no refresh token → skip the link refresh.
    store.set(linkTokensAtom, { accessToken: "cilogon", refreshToken: "" });
    // The registrant is authenticated by the OTP token from email verification.
    store.set(otpTokensAtom, { accessToken: unexpiredJwt(), refreshToken: "" });

    const status = await store.set(createAccountAtom);

    expect(status.created).toBe(true);
    expect(status.username).toBe("ACC123");
    expect(status.idp).toBe("ACCESS CI (XSEDE)"); // no domain → fallback
    expect(store.get(showWelcomeMessageAtom)).toBe(true);
    // exitWithStatus clears tokens via logoutAtom.
    expect(store.get(linkTokensAtom)).toEqual({ accessToken: "", refreshToken: "" });
  });

  it("aborts with an error when the link-token refresh fails", async () => {
    const { store, createAccountAtom, linkTokensAtom } = state;
    const fetchFn = stubFetch((url: string) => {
      if (url.includes("/auth/info"))
        return fakeResponse({ status: 500, json: { detail: "down" } });
      throw new Error("unexpected url " + url);
    });
    // A refresh token forces doRefresh("link"), which fails because /auth/info errors.
    store.set(linkTokensAtom, { accessToken: "cilogon", refreshToken: "r" });

    const status = await store.set(createAccountAtom);

    expect(status.created).toBe(false);
    expect(status.error).toMatch(/invalid or has expired/);
    // The account endpoint must never be reached.
    expect(fetchFn.mock.calls.some((c) => String(c[0]).endsWith("/account"))).toBe(
      false,
    );
  });
});

describe("shouldShowPasswordFields / bypassIdpAtom", () => {
  const idp = { displayName: "Example University", entityId: "https://idp.example.edu" };

  it("is false with no domain", () => {
    expect(state.shouldShowPasswordFields(null, false)).toBe(false);
  });

  it("is true when the domain has no IdPs", () => {
    const domain = { domain: "example.edu", organizations: [], idps: [] };
    expect(state.shouldShowPasswordFields(domain, false)).toBe(true);
  });

  it("is false when the domain has IdPs and the bypass is not set", () => {
    const domain = { domain: "example.edu", organizations: [], idps: [idp] };
    expect(state.shouldShowPasswordFields(domain, false)).toBe(false);
  });

  it("is true when the domain has IdPs but the bypass is set", () => {
    const domain = { domain: "example.edu", organizations: [], idps: [idp] };
    expect(state.shouldShowPasswordFields(domain, true)).toBe(true);
  });

  it("logoutAtom resets bypassIdpAtom to false", () => {
    const { store, bypassIdpAtom, logoutAtom } = state;
    store.set(bypassIdpAtom, true);
    expect(store.get(bypassIdpAtom)).toBe(true);
    store.set(logoutAtom);
    expect(store.get(bypassIdpAtom)).toBe(false);
  });
});

describe("domainAtom — eligibility computation", () => {
  const seedAuthed = () =>
    state.store.set(state.loginTokensAtom, { accessToken: "t", refreshToken: "" });

  it("returns null when no email is set", async () => {
    const { store, domainAtom } = state;
    expect(await store.get(domainAtom)).toBeNull();
  });

  it("marks the domain ineligible on a 400 'Ineligible domain' error", async () => {
    const { store, domainAtom, emailAtom } = state;
    seedAuthed();
    stubFetch(() =>
      fakeResponse({
        status: 400,
        json: { detail: "Ineligible domain: example.com" },
      }),
    );
    store.set(emailAtom, "user@example.com");
    const domain = await store.get(domainAtom);
    expect(domain).toMatchObject({
      isEligible: false,
      organizations: [],
      domain: "example.com",
    });
  });

  it("returns null for non-400 errors", async () => {
    const { store, domainAtom, emailAtom } = state;
    seedAuthed();
    stubFetch(() => fakeResponse({ status: 500, json: { detail: "boom" } }));
    store.set(emailAtom, "user@example.com");
    expect(await store.get(domainAtom)).toBeNull();
  });

  it("is eligible with no organizations (empty org list)", async () => {
    const { store, domainAtom, emailAtom } = state;
    seedAuthed();
    stubFetch(() =>
      fakeResponse({
        status: 200,
        json: { domain: "example.edu", organizations: [], idps: [] },
      }),
    );
    store.set(emailAtom, "user@example.edu");
    const domain = await store.get(domainAtom);
    expect(domain?.isEligible).toBe(true);
    expect(domain?.organizations).toHaveLength(0);
  });

  it("is eligible and keeps only active+eligible organizations", async () => {
    const { store, domainAtom, emailAtom } = state;
    seedAuthed();
    stubFetch(() =>
      fakeResponse({
        status: 200,
        json: {
          domain: "example.edu",
          organizations: [
            makeOrganization({ organizationId: 1, isActive: true, isEligible: true }),
            makeOrganization({ organizationId: 2, isActive: false, isEligible: true }),
          ],
          idps: [],
        },
      }),
    );
    store.set(emailAtom, "user@example.edu");
    const domain = await store.get(domainAtom);
    expect(domain?.isEligible).toBe(true);
    expect(domain?.organizations.map((o) => o.organizationId)).toEqual([1]);
  });

  it("is ineligible when orgs exist but none are active+eligible", async () => {
    const { store, domainAtom, emailAtom } = state;
    seedAuthed();
    stubFetch(() =>
      fakeResponse({
        status: 200,
        json: {
          domain: "example.edu",
          organizations: [makeOrganization({ isEligible: false })],
          idps: [],
        },
      }),
    );
    store.set(emailAtom, "user@example.edu");
    const domain = await store.get(domainAtom);
    expect(domain?.isEligible).toBe(false);
    expect(domain?.organizations).toHaveLength(0);
  });
});

describe("notifications", () => {
  it("push replaces same-id, dismiss removes, clear empties", () => {
    const {
      store,
      pushNotificationAtom,
      dismissNotificationAtom,
      clearNotificationsAtom,
      notificationsAtom,
    } = state;

    store.set(pushNotificationAtom, { id: "a", message: "first" });
    store.set(pushNotificationAtom, { id: "a", message: "updated" });
    expect(store.get(notificationsAtom)).toHaveLength(1);
    expect(store.get(notificationsAtom)[0].message).toBe("updated");

    store.set(pushNotificationAtom, { id: "b", message: "second" });
    store.set(dismissNotificationAtom, "a");
    expect(store.get(notificationsAtom).map((n) => n.id)).toEqual(["b"]);

    store.set(clearNotificationsAtom);
    expect(store.get(notificationsAtom)).toHaveLength(0);
  });

  it("defaults variant to info and dismissible to true", () => {
    const { store, pushNotificationAtom, notificationsAtom } = state;
    store.set(pushNotificationAtom, { message: "hi" });
    const note = store.get(notificationsAtom)[0];
    expect(note.variant).toBe("info");
    expect(note.dismissible).toBe(true);
    expect(note.id).toBeTruthy();
  });
});
