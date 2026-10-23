import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { fakeResponse } from "@/test/utils";

// Drives the real route tree, so the loaders' error handling is exercised the
// same way it is in the app. Modules are re-imported per test because state.ts
// keeps a singleton store that reads tokens from localStorage at load.
async function renderAt(
  path: string,
  setup?: (state: typeof import("@/helpers/state")) => Promise<unknown>,
) {
  vi.resetModules();
  await setup?.(await import("@/helpers/state"));
  const { createMemoryHistory, createRouter, RouterProvider } = await import(
    "@tanstack/react-router"
  );
  const { routeTree } = await import("@/routeTree.gen");
  const { RouteErrorComponent } = await import(
    "@/components/service-unavailable"
  );
  const router = createRouter({
    routeTree,
    history: createMemoryHistory({ initialEntries: [path] }),
    context: { queryClient: undefined as any },
    defaultErrorComponent: RouteErrorComponent,
  });
  render(<RouterProvider router={router} />);
  return router;
}

function stubApi(status: number, detail: string) {
  vi.stubGlobal(
    "fetch",
    vi.fn(async (url: string) =>
      String(url).includes("/auth/")
        ? fakeResponse({ status: 500, json: { detail: "no oidc in tests" } })
        : fakeResponse({ status, json: { detail } }),
    ),
  );
}

// A loader throwing ServiceUnavailableError is the expected outage path, but
// React (console.error) and TanStack Router (console.warn) both log errors
// caught by a route's error boundary. Drop just those logs; anything else
// still prints. Matched by name since resetModules gives each test its own
// copy of the error class.
function silenceExpectedOutageLogs() {
  const isOutageError = (arg: unknown) =>
    arg instanceof Error && arg.name === "ServiceUnavailableError";
  const error = console.error.bind(console);
  const warn = console.warn.bind(console);
  vi.spyOn(console, "error").mockImplementation((...args) => {
    if (!args.some(isOutageError)) error(...args);
  });
  vi.spyOn(console, "warn").mockImplementation((...args) => {
    if (!String(args[0]).startsWith("Warning: Error in route match:"))
      warn(...args);
  });
}

beforeEach(() => {
  localStorage.setItem(
    "loginTokens",
    JSON.stringify({ accessToken: "token", refreshToken: "" }),
  );
  localStorage.setItem("username", JSON.stringify("jdoe"));
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe.each(["/profile", "/linked-accounts", "/ssh-keys"])(
  "%s when a backend service is down",
  (path) => {
    it("shows a maintenance message instead of redirecting to login", async () => {
      silenceExpectedOutageLogs();
      stubApi(503, "CoManageRegistryClient API is unavailable");
      const router = await renderAt(path);

      expect(
        await screen.findByText("Down for Maintenance"),
      ).toBeInTheDocument();
      expect(router.state.location.pathname).toBe(path);
    });

    it("still redirects to login on an auth error", async () => {
      stubApi(401, "Unauthorized");
      const router = await renderAt(path);

      await waitFor(() =>
        expect(router.state.location.pathname).toBe("/login"),
      );
      expect(screen.queryByText("Down for Maintenance")).toBeNull();
    });
  },
);

describe("/register/verify when a backend service is down", () => {
  it("shows a maintenance message instead of 'Incorrect Code'", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async (url: string) =>
        String(url).endsWith("/auth/send-otp")
          ? fakeResponse({ status: 200, json: { success: true } })
          : fakeResponse({
              status: 503,
              json: { detail: "CoManageRegistryClient API is unavailable" },
            }),
      ),
    );
    const router = await renderAt("/register/verify", async (state) => {
      state.store.set(state.emailAtom, "ada@example.edu");
      await state.store.set(state.sendOtpAtom);
    });

    fireEvent.change(
      await waitFor(() => {
        const input = document.querySelector<HTMLInputElement>(
          "input[data-input-otp]",
        );
        expect(input).not.toBeNull();
        return input!;
      }),
      { target: { value: "123456" } },
    );
    // Submit the form rather than clicking: the @access-ci/ui header adds a
    // document.body click listener it never removes, and listeners leaked
    // from earlier tests' unmounted headers throw on any click.
    fireEvent.submit(
      screen.getByRole("button", { name: "Continue" }).closest("form")!,
    );

    expect(await screen.findByText("Down for Maintenance")).toBeInTheDocument();
    expect(screen.queryByText("Incorrect Code")).toBeNull();
    await waitFor(() =>
      expect(router.state.location.pathname).toBe("/register"),
    );
  });
});

describe("/register while registration is disabled", () => {
  it("shows a maintenance notice instead of the email prompt", async () => {
    stubApi(500, "no API calls expected");
    await renderAt("/register");

    expect(
      await screen.findByText(
        /ACCESS registration is temporarily unavailable due to system maintenance/,
      ),
    ).toBeInTheDocument();
    expect(screen.queryByRole("textbox")).toBeNull();
  });
});
