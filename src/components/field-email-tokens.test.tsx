import { describe, it, expect, vi } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  createMemoryHistory,
  createRootRoute,
  createRouter,
  RouterProvider,
} from "@tanstack/react-router";
import { useAppForm } from "@/hooks/form";
import { renderWithProviders, makeAccount } from "@/test/utils";
import type { AccountResponse } from "@/helpers/types";
import FieldEmailTokens from "@/components/field-email-tokens";

// FieldEmailTokens calls useNavigate() unconditionally, so it needs a real
// router context even for tests that never trigger navigation.
function renderHarness({
  account,
  onSubmit,
}: {
  account: AccountResponse;
  onSubmit: (value: unknown) => void;
}) {
  function Harness() {
    const form = useAppForm({
      defaultValues: account,
      onSubmit: async ({ value }) => onSubmit(value),
    });
    return (
      <form
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
      >
        <FieldEmailTokens form={form} account={account} />
        <button type="submit">Save Profile</button>
        <button
          type="button"
          onClick={() =>
            form.setFieldValue("recoveryEmails", [
              ...form.state.values.recoveryEmails,
              { email: "new@example.edu", verified: true },
            ])
          }
        >
          simulate verified add
        </button>
      </form>
    );
  }

  const rootRoute = createRootRoute({ component: Harness });
  const router = createRouter({
    routeTree: rootRoute,
    history: createMemoryHistory({ initialEntries: ["/"] }),
  });
  return renderWithProviders(<RouterProvider router={router} />);
}

describe("FieldEmailTokens (integration)", () => {
  // Regression test: the "click Verify and Add" error, once shown by a
  // failed Save Profile attempt, used to never clear — form.handleSubmit()
  // bails out on canSubmit=false before it re-validates, so simply clearing
  // the input and clicking Save Profile again left the user stuck.
  it("clears the pending-email error once the input is cleared, and lets the form submit", async () => {
    const user = userEvent.setup();
    const account = makeAccount();
    const onSubmit = vi.fn();
    renderHarness({ account, onSubmit });

    await user.type(
      await screen.findByPlaceholderText("Add an email address"),
      "someone@example.edu",
    );
    await user.click(screen.getByRole("button", { name: "Save Profile" }));

    expect(
      await screen.findByText(
        'Click "Verify and Add" to add this address, or clear the field before saving.',
      ),
    ).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();

    await user.clear(screen.getByPlaceholderText("Add an email address"));

    await waitFor(() =>
      expect(
        screen.queryByText(
          'Click "Verify and Add" to add this address, or clear the field before saving.',
        ),
      ).not.toBeInTheDocument(),
    );

    await user.click(screen.getByRole("button", { name: "Save Profile" }));
    await waitFor(() => expect(onSubmit).toHaveBeenCalledTimes(1));
  });

  it("does not show a pending-email error when Save Profile is clicked with an empty input", async () => {
    const user = userEvent.setup();
    const account = makeAccount();
    const onSubmit = vi.fn();
    renderHarness({ account, onSubmit });

    await user.click(
      await screen.findByRole("button", { name: "Save Profile" }),
    );

    expect(
      screen.queryByText(
        'Click "Verify and Add" to add this address, or clear the field before saving.',
      ),
    ).not.toBeInTheDocument();
    await waitFor(() => expect(onSubmit).toHaveBeenCalledTimes(1));
  });

  it("shows the unsaved-changes badge once a recovery email is added but not yet saved", async () => {
    const user = userEvent.setup();
    const account = makeAccount({ recoveryEmails: [] });
    renderHarness({ account, onSubmit: vi.fn() });

    expect(
      screen.queryByText("Email addresses have unsaved changes."),
    ).not.toBeInTheDocument();

    await user.click(
      await screen.findByRole("button", { name: "simulate verified add" }),
    );

    expect(
      await screen.findByText("Email addresses have unsaved changes."),
    ).toBeInTheDocument();
  });
});
