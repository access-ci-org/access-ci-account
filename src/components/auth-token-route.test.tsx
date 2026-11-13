import { describe, it, expect, afterEach, vi } from "vitest";
import { render, waitFor } from "@testing-library/react";
import { fakeResponse } from "@/test/utils";

// Drives the real /auth-token/$client route, the way CILogon's redirect back
// lands on it. Modules are re-imported per test because state.ts keeps a
// singleton store that reads localStorage at load.
async function renderCallback(search: string, tokenResponse: Response) {
  vi.resetModules();
  localStorage.setItem("oidcState", JSON.stringify("the-state"));
  const fetchMock = vi.fn(async (url: string) => {
    if (String(url).endsWith("/auth/info"))
      return fakeResponse({
        json: {
          authorizationUrl: "https://cilogon.example.org/authorize",
          clientIds: { link: "link-id", login: "login-id" },
        },
      });
    if (String(url).endsWith("/auth/oauth2/token")) return tokenResponse;
    return fakeResponse({ status: 404, json: { detail: "Not found" } });
  });
  vi.stubGlobal("fetch", fetchMock);

  const state = await import("@/helpers/state");
  const { createMemoryHistory, createRouter, RouterProvider } = await import(
    "@tanstack/react-router"
  );
  const { routeTree } = await import("@/routeTree.gen");
  const router = createRouter({
    routeTree,
    history: createMemoryHistory({
      initialEntries: [`/auth-token/login?${search}`],
    }),
    context: { queryClient: undefined as any },
  });
  render(<RouterProvider router={router} />);

  const tokenBody = async () => {
    await waitFor(() =>
      expect(
        fetchMock.mock.calls.some(([url]) =>
          String(url).endsWith("/auth/oauth2/token"),
        ),
      ).toBe(true),
    );
    const [, init] = fetchMock.mock.calls.find(([url]) =>
      String(url).endsWith("/auth/oauth2/token"),
    ) as unknown as [string, RequestInit];
    return JSON.parse(String(init.body));
  };
  return { router, state, tokenBody };
}

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
  localStorage.clear();
});

describe("/auth-token/$client when CILogon redirects back with an error", () => {
  it("passes the error to the backend and shows its message", async () => {
    const detail = "Authentication failed: The user cancelled.";
    const { router, state, tokenBody } = await renderCallback(
      "error=access_denied&error_description=The%20user%20cancelled.&state=the-state",
      fakeResponse({ status: 400, json: { detail } }),
    );

    const body = await tokenBody();
    expect(body).toMatchObject({
      clientId: "login-id",
      error: "access_denied",
      errorDescription: "The user cancelled.",
      grantType: "authorization_code",
    });
    expect(body.code).toBeNull();

    await waitFor(() => expect(router.state.location.pathname).toBe("/"));
    expect(state.store.get(state.notificationsAtom)).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: "auth-error", message: detail }),
      ]),
    );
  });

  it("still checks the state before calling the backend", async () => {
    const { router, state } = await renderCallback(
      "error=access_denied&state=wrong-state",
      fakeResponse({ status: 400, json: { detail: "unused" } }),
    );

    await waitFor(() => expect(router.state.location.pathname).toBe("/"));
    expect(state.store.get(state.notificationsAtom)).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          message: "Authentication failed due to invalid state.",
        }),
      ]),
    );
    expect(
      vi
        .mocked(fetch)
        .mock.calls.some(([url]) => String(url).endsWith("/auth/oauth2/token")),
    ).toBe(false);
  });
});

describe("/auth-token/$client with a code", () => {
  it("sends the code and no error fields", async () => {
    const { tokenBody } = await renderCallback(
      "code=the-code&state=the-state",
      fakeResponse({ status: 500, json: { detail: "stop here" } }),
    );

    const body = await tokenBody();
    expect(body).toMatchObject({ code: "the-code" });
    expect(body).not.toHaveProperty("error");
    expect(body).not.toHaveProperty("errorDescription");
  });
});
