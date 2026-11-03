import { describe, it, expect, afterEach, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { fakeResponse } from "@/test/utils";

// Drives the real route tree through the registration email -> verification
// code round trip, so a stale "Incorrect Code" message from an earlier attempt
// can be checked against the next attempt. Modules are re-imported because
// state.ts keeps a singleton store.
async function renderRegistration() {
  vi.resetModules();
  vi.stubGlobal(
    "fetch",
    vi.fn(async (url: string) =>
      String(url).endsWith("/auth/send-otp")
        ? fakeResponse({ status: 200, json: { success: true } })
        : fakeResponse({ status: 400, json: { detail: "Invalid code" } }),
    ),
  );
  const { createMemoryHistory, createRouter, RouterProvider } = await import(
    "@tanstack/react-router"
  );
  const { routeTree } = await import("@/routeTree.gen");
  const { subscribeNotificationsToRouter } = await import(
    "@/components/notifications"
  );
  const router = createRouter({
    routeTree,
    history: createMemoryHistory({ initialEntries: ["/register"] }),
    context: { queryClient: undefined as any },
  });
  subscribeNotificationsToRouter(router);
  render(<RouterProvider router={router} />);
  return router;
}

// Submit forms rather than clicking: the @access-ci/ui header adds a
// document.body click listener it never removes, and listeners leaked from
// earlier tests' unmounted headers throw on any click.
async function submitEmail(router: { state: { location: { pathname: string } } }) {
  const input = await screen.findByLabelText("Email Address");
  fireEvent.change(input, { target: { value: "ada@example.edu" } });
  fireEvent.submit(input.closest("form")!);
  await waitFor(() =>
    expect(router.state.location.pathname).toBe("/register/verify"),
  );
}

async function submitWrongCode(router: {
  state: { location: { pathname: string } };
}) {
  const input = await waitFor(() => {
    const otp = document.querySelector<HTMLInputElement>(
      "input[data-input-otp]",
    );
    expect(otp).not.toBeNull();
    return otp!;
  });
  fireEvent.change(input, { target: { value: "123456" } });
  fireEvent.submit(
    screen.getByRole("button", { name: "Continue" }).closest("form")!,
  );
  await waitFor(() =>
    expect(router.state.location.pathname).toBe("/register"),
  );
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("verification code notifications", () => {
  it("clears 'Incorrect Code' once the user moves on to the next attempt", async () => {
    const router = await renderRegistration();

    await submitEmail(router);
    await submitWrongCode(router);
    expect(await screen.findByText("Incorrect Code")).toBeInTheDocument();

    await submitEmail(router);
    await screen.findByRole("heading", { name: "Verify Email Address" });
    expect(screen.queryByText("Incorrect Code")).toBeNull();
  });
});
