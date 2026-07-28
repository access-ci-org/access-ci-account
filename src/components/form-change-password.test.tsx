import { describe, it, expect, vi } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useAppForm } from "@/hooks/form";
import { passwordSchema } from "@/helpers/validation";
import { renderWithProviders } from "@/test/utils";
import FormChangePassword from "@/components/form-change-password";

const STRONG = "Abcdef1!ghij";

// Mirrors how routes/password.tsx wires the change-password form.
function Harness({ onSubmit }: { onSubmit: (arg: { value: unknown }) => void }) {
  const form = useAppForm({
    defaultValues: { password: "", confirmPassword: "" },
    validators: { onSubmit: passwordSchema },
    onSubmit,
  });
  return <FormChangePassword form={form} />;
}

describe("FormChangePassword (integration)", () => {
  it("submits when both passwords are strong and match", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    renderWithProviders(<Harness onSubmit={onSubmit} />);

    await user.type(screen.getByLabelText(/^Password/), STRONG);
    await user.type(screen.getByLabelText(/Confirm Password/), STRONG);
    await user.click(screen.getByRole("button", { name: /Update Password/ }));

    await waitFor(() => expect(onSubmit).toHaveBeenCalledTimes(1));
    expect(onSubmit.mock.calls[0][0].value).toEqual({
      password: STRONG,
      confirmPassword: STRONG,
    });
  });

  it("blocks submission and surfaces an error when the passwords do not match", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    renderWithProviders(<Harness onSubmit={onSubmit} />);

    await user.type(screen.getByLabelText(/^Password/), STRONG);
    await user.type(screen.getByLabelText(/Confirm Password/), STRONG + "x");
    await user.click(screen.getByRole("button", { name: /Update Password/ }));

    expect(await screen.findByText("Passwords don't match")).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("blocks submission when the password is too weak", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    renderWithProviders(<Harness onSubmit={onSubmit} />);

    await user.type(screen.getByLabelText(/^Password/), "weak");
    await user.type(screen.getByLabelText(/Confirm Password/), "weak");
    await user.click(screen.getByRole("button", { name: /Update Password/ }));

    await waitFor(() => expect(screen.getByRole("alert")).toBeInTheDocument());
    expect(onSubmit).not.toHaveBeenCalled();
  });
});
