import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { fakeResponse } from "@/test/utils";

// Drives the real route tree, so the loaders' error handling is exercised the
// same way it is in the app. Modules are re-imported per test because state.ts
// keeps a singleton store that reads tokens from localStorage at load.
async function renderAt(path: string) {
  vi.resetModules();
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

beforeEach(() => {
  localStorage.setItem(
    "loginTokens",
    JSON.stringify({ accessToken: "token", refreshToken: "" }),
  );
  localStorage.setItem("username", JSON.stringify("jdoe"));
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe.each(["/profile", "/linked-accounts", "/ssh-keys"])(
  "%s when a backend service is down",
  (path) => {
    it("shows a maintenance message instead of redirecting to login", async () => {
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
