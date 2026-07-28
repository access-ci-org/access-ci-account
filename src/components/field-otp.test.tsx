import { describe, it, expect } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useAppForm } from "@/hooks/form";
import { renderWithProviders } from "@/test/utils";

// Note: FieldOtp renders per-slot <input data-otp-index> children, but the
// shadcn InputOTPSlot overrides them with {char}, so the real input is the
// single hidden input-otp field and value changes flow through InputOTP's
// onChange={handleChange}. We drive that input and count the visible slots.
function OtpHarness({ length }: { length?: number }) {
  const form = useAppForm({ defaultValues: { otp: "" } });
  return (
    <form>
      <form.AppField name="otp">
        {(field: any) => (
          <>
            <field.FieldOtp name="otp" length={length} label="Code" />
            <output data-testid="value">{field.state.value}</output>
          </>
        )}
      </form.AppField>
    </form>
  );
}

const slotCount = (c: HTMLElement) =>
  c.querySelectorAll('[data-slot="input-otp-slot"]').length;
const otpInput = (c: HTMLElement) => c.querySelector("input") as HTMLInputElement;

describe("FieldOtp", () => {
  it("renders `length` slots (default 6)", () => {
    const { container } = renderWithProviders(<OtpHarness />);
    expect(slotCount(container)).toBe(6);
  });

  it("honors a custom length", () => {
    const { container } = renderWithProviders(<OtpHarness length={4} />);
    expect(slotCount(container)).toBe(4);
  });

  it("writes entered digits back into the form value", async () => {
    const user = userEvent.setup();
    const { container } = renderWithProviders(<OtpHarness />);
    await user.type(otpInput(container), "123456");
    await waitFor(() =>
      expect(screen.getByTestId("value")).toHaveTextContent("123456"),
    );
  });

  it("strips non-alphanumeric characters", async () => {
    const user = userEvent.setup();
    const { container } = renderWithProviders(<OtpHarness />);
    await user.type(otpInput(container), "12-34");
    await waitFor(() =>
      expect(screen.getByTestId("value")).toHaveTextContent("1234"),
    );
  });

  it("truncates input beyond the configured length", async () => {
    const user = userEvent.setup();
    const { container } = renderWithProviders(<OtpHarness length={4} />);
    await user.type(otpInput(container), "123456");
    await waitFor(() =>
      expect(screen.getByTestId("value")).toHaveTextContent("1234"),
    );
  });
});
