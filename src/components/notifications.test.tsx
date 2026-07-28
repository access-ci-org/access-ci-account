import { describe, it, expect, vi, afterEach } from "vitest";
import { act, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { NotificationsBar } from "@/components/notifications";
import { notificationsAtom } from "@/helpers/state";
import { renderWithProviders, createTestStore } from "@/test/utils";
import type { AppNotification } from "@/helpers/types";

function renderBar(notifications: AppNotification[]) {
  const store = createTestStore();
  store.set(notificationsAtom, notifications);
  return renderWithProviders(<NotificationsBar />, { store });
}

afterEach(() => {
  vi.useRealTimers();
});

describe("NotificationsBar", () => {
  it("renders nothing when there are no notifications", () => {
    const { container } = renderBar([]);
    expect(container).toBeEmptyDOMElement();
  });

  it("renders each notification's title and message", () => {
    renderBar([
      { id: "a", title: "Saved", message: "Profile saved", variant: "success" },
    ]);
    expect(screen.getByText("Saved")).toBeInTheDocument();
    expect(screen.getByText("Profile saved")).toBeInTheDocument();
    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("removes a notification when its dismiss button is clicked", async () => {
    const user = userEvent.setup();
    renderBar([{ id: "a", message: "Dismiss me", dismissible: true }]);
    await user.click(screen.getByRole("button", { name: "Dismiss notification" }));
    expect(screen.queryByText("Dismiss me")).not.toBeInTheDocument();
  });

  it("omits the dismiss button when dismissible is false", () => {
    renderBar([{ id: "a", message: "Sticky", dismissible: false }]);
    expect(
      screen.queryByRole("button", { name: "Dismiss notification" }),
    ).not.toBeInTheDocument();
  });

  it("auto-closes a notification after autoCloseMs", () => {
    vi.useFakeTimers();
    renderBar([{ id: "a", message: "Temporary", autoCloseMs: 1000 }]);
    expect(screen.getByText("Temporary")).toBeInTheDocument();
    act(() => {
      vi.advanceTimersByTime(1000);
    });
    expect(screen.queryByText("Temporary")).not.toBeInTheDocument();
  });
});
