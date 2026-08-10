import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useAppForm } from "@/hooks/form";
import { useUnsavedProfileChanges } from "@/hooks/use-unsaved-profile-changes";
import { renderWithProviders, makeAccount } from "@/test/utils";
import type { AccountResponse } from "@/helpers/types";

// Mirrors how routes/profile.tsx wires the form: defaultValues start out
// equal to the persisted account, then get mutated like the real form does
// (form.setFieldValue), while `account` stays fixed as the saved baseline.
function Harness({ account }: { account: AccountResponse }) {
  const form = useAppForm({ defaultValues: account });
  const { emailsDirty, pageIsDirty } = useUnsavedProfileChanges(form, account);

  return (
    <div>
      <div data-testid="page-dirty">{String(pageIsDirty)}</div>
      <div data-testid="emails-dirty">{String(emailsDirty)}</div>
      <button onClick={() => form.setFieldValue("department", "New Dept")}>
        change department
      </button>
      <button
        onClick={() => form.setFieldValue("department", account.department)}
      >
        undo department
      </button>
      <button
        onClick={() =>
          form.setFieldValue("recoveryEmails", [
            ...form.state.values.recoveryEmails,
            { email: "new@example.edu", verified: true },
          ])
        }
      >
        add recovery
      </button>
      <button
        onClick={() => {
          const [first, ...rest] = form.state.values.recoveryEmails;
          form.setFieldValue("recoveryEmails", [...rest, first]);
        }}
      >
        reorder recovery
      </button>
    </div>
  );
}

describe("useUnsavedProfileChanges", () => {
  it("starts clean when form values match the account", () => {
    const account = makeAccount({
      recoveryEmails: [{ email: "r@example.edu", verified: true }],
    });
    renderWithProviders(<Harness account={account} />);

    expect(screen.getByTestId("page-dirty").textContent).toBe("false");
    expect(screen.getByTestId("emails-dirty").textContent).toBe("false");
  });

  // Regression test: TanStack Form's own field.state.meta.isDirty is "was
  // ever touched", not "currently differs from the baseline" — it never
  // resets when a change is undone, which previously caused the unsaved-
  // changes warning to stick around forever after any edit+undo.
  it("clears once a change is undone back to the saved value", async () => {
    const user = userEvent.setup();
    const account = makeAccount();
    renderWithProviders(<Harness account={account} />);

    await user.click(screen.getByText("change department"));
    expect(screen.getByTestId("page-dirty").textContent).toBe("true");
    expect(screen.getByTestId("emails-dirty").textContent).toBe("false");

    await user.click(screen.getByText("undo department"));
    expect(screen.getByTestId("page-dirty").textContent).toBe("false");
  });

  it("flags a newly added recovery email as dirty", async () => {
    const user = userEvent.setup();
    const account = makeAccount();
    renderWithProviders(<Harness account={account} />);

    await user.click(screen.getByText("add recovery"));

    expect(screen.getByTestId("emails-dirty").textContent).toBe("true");
    expect(screen.getByTestId("page-dirty").textContent).toBe("true");
  });

  it("does not flag reordering recovery emails (make-primary reorders) as dirty", async () => {
    const user = userEvent.setup();
    const account = makeAccount({
      recoveryEmails: [
        { email: "a@example.edu", verified: true },
        { email: "b@example.edu", verified: true },
      ],
    });
    renderWithProviders(<Harness account={account} />);

    await user.click(screen.getByText("reorder recovery"));

    expect(screen.getByTestId("emails-dirty").textContent).toBe("false");
    expect(screen.getByTestId("page-dirty").textContent).toBe("false");
  });
});
