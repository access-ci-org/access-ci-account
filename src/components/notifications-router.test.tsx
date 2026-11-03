import { describe, it, expect } from "vitest";
import { act, render, screen, waitFor } from "@testing-library/react";
import { Provider } from "jotai";
import {
  Outlet,
  RouterProvider,
  createMemoryHistory,
  createRootRoute,
  createRoute,
  createRouter,
  redirect,
} from "@tanstack/react-router";
import {
  NotificationsBar,
  subscribeNotificationsToRouter,
} from "@/components/notifications";
import { pushNotificationAtom } from "@/helpers/state";
import { createTestStore } from "@/test/utils";

// Drives a real TanStack Router so the clearing follows the router's actual
// event order, including redirects thrown from beforeLoad.
async function renderApp(initialPath = "/") {
  const store = createTestStore();
  const push = (message: string, persist?: boolean) =>
    store.set(pushNotificationAtom, { message, persist });

  const rootRoute = createRootRoute({
    component: () => (
      <>
        <NotificationsBar />
        <Outlet />
      </>
    ),
  });
  const page = (path: string) =>
    createRoute({
      getParentRoute: () => rootRoute,
      path,
      component: () => <h1>{path}</h1>,
    });
  const routeTree = rootRoute.addChildren([
    page("/"),
    page("/a"),
    page("/b"),
    createRoute({
      getParentRoute: () => rootRoute,
      path: "/error-redirect",
      beforeLoad: () => {
        push("Error from beforeLoad");
        throw redirect({ href: "/a" });
      },
    }),
    createRoute({
      getParentRoute: () => rootRoute,
      path: "/slow-error-redirect",
      // Like /auth-token waiting on CILogon: outlasts pendingMs, so the
      // router shows the pending spinner before redirecting.
      beforeLoad: async () => {
        await new Promise((resolve) => setTimeout(resolve, 100));
        push("Error from slow beforeLoad");
        throw redirect({ href: "/a" });
      },
    }),
    createRoute({
      getParentRoute: () => rootRoute,
      path: "/redirect-to-b",
      beforeLoad: () => {
        throw redirect({ href: "/b" });
      },
    }),
    createRoute({
      getParentRoute: () => rootRoute,
      path: "/redirect-home",
      beforeLoad: () => {
        throw redirect({ to: "/" });
      },
    }),
  ]);

  const router = createRouter({
    routeTree,
    history: createMemoryHistory({ initialEntries: [initialPath] }),
    defaultPendingMs: 10,
    defaultPendingMinMs: 0,
    defaultPendingComponent: () => <p>Loading</p>,
  });
  subscribeNotificationsToRouter(router, store);
  render(
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>,
  );
  if (initialPath === "/") await screen.findByRole("heading", { name: "/" });

  const go = async (to: string, search?: Record<string, string>) => {
    await act(() => router.navigate({ to, search } as any));
  };
  return { router, store, push, go };
}

function expectShown(message: string) {
  expect(screen.getByText(message)).toBeInTheDocument();
}

function expectGone(message: string) {
  expect(screen.queryByText(message)).not.toBeInTheDocument();
}

async function expectPage(path: string) {
  await screen.findByRole("heading", { name: path });
}

describe("notification clearing on navigation", () => {
  it("clears a page's notification when the user moves to another page", async () => {
    const { push, go } = await renderApp();
    act(() => push("Something failed"));
    expectShown("Something failed");

    await go("/a");
    await expectPage("/a");
    expectGone("Something failed");
  });

  it("shows a persisted notification on the next page, then clears it", async () => {
    const { push, go } = await renderApp();
    await act(async () => {
      push("Incorrect Code", true);
      await go("/a");
    });
    await expectPage("/a");
    expectShown("Incorrect Code");

    await go("/b");
    await expectPage("/b");
    expectGone("Incorrect Code");
  });

  it("drops an earlier page's notification but keeps a persisted one", async () => {
    const { push, go } = await renderApp();
    act(() => push("Old error"));
    await act(async () => {
      push("New message", true);
      await go("/a");
    });
    await expectPage("/a");
    expectGone("Old error");
    expectShown("New message");
  });

  it("shows a notification pushed in beforeLoad on the redirect target", async () => {
    const { go } = await renderApp();
    await go("/error-redirect");
    await expectPage("/a");
    expectShown("Error from beforeLoad");

    await go("/b");
    await expectPage("/b");
    expectGone("Error from beforeLoad");
  });

  // Returning from CILogon is a full page load, so /auth-token is the first
  // route the router loads.
  it("shows a notification pushed in a slow beforeLoad on the redirect target", async () => {
    const { go } = await renderApp("/slow-error-redirect");
    await expectPage("/a");
    expectShown("Error from slow beforeLoad");

    await go("/b");
    await expectPage("/b");
    expectGone("Error from slow beforeLoad");
  });

  it("keeps a persisted notification through a redirect", async () => {
    const { push, go } = await renderApp();
    await act(async () => {
      push("Persisted", true);
      await go("/redirect-to-b");
    });
    await expectPage("/b");
    expectShown("Persisted");

    await go("/a");
    await expectPage("/a");
    expectGone("Persisted");
  });

  it("clears a persisted notification once shown, even if the redirect lands on the same page", async () => {
    const { push, go } = await renderApp();
    await act(async () => {
      push("Code could not be sent", true);
      await go("/redirect-home");
    });
    await expectPage("/");
    expectShown("Code could not be sent");

    await go("/a");
    await expectPage("/a");
    expectGone("Code could not be sent");
  });

  it("keeps notifications when only the search params change", async () => {
    const { push, go, router } = await renderApp();
    act(() => push("Still relevant"));
    await go("/", { tab: "2" });
    await waitFor(() =>
      expect(router.state.location.search).toEqual({ tab: "2" }),
    );
    expectShown("Still relevant");
  });

  it("keeps a notification pushed while the page reloads its data", async () => {
    const { push, router } = await renderApp();
    // e.g. ssh-keys.tsx: invalidate the route, then report the deletion.
    await act(async () => {
      const reload = router.invalidate();
      push("SSH key deleted successfully.");
      await reload;
    });
    expectShown("SSH key deleted successfully.");
  });
});
