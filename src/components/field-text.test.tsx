import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useAppForm } from "@/hooks/form";
import { renderField, renderWithProviders } from "@/test/utils";

describe("FieldText", () => {
  it("renders a labeled input and writes typing into the form value", async () => {
    const user = userEvent.setup();
    renderField({
      name: "firstName",
      defaultValues: { firstName: "" },
      render: (field) => (
        <>
          <field.FieldText label="First Name" placeholder="Enter" />
          <output data-testid="value">{field.state.value}</output>
        </>
      ),
    });
    await user.type(screen.getByLabelText("First Name"), "Ada");
    expect(screen.getByTestId("value")).toHaveTextContent("Ada");
  });

  it("renders a textarea when fieldType is 'textarea'", () => {
    renderField({
      name: "bio",
      defaultValues: { bio: "" },
      render: (field) => (
        <field.FieldText label="Bio" placeholder="" fieldType="textarea" />
      ),
    });
    expect(screen.getByLabelText("Bio").tagName).toBe("TEXTAREA");
  });

  it("disables the input when disabled", () => {
    renderField({
      name: "locked",
      defaultValues: { locked: "" },
      render: (field) => (
        <field.FieldText label="Locked" placeholder="" disabled />
      ),
    });
    expect(screen.getByLabelText("Locked")).toBeDisabled();
  });

  it("shows an onMount validation error before the field is touched", async () => {
    // FieldText treats an onMount error as invalid even without a blur/touch.
    function Harness() {
      const form = useAppForm({ defaultValues: { email: "" } });
      return (
        <form.AppField
          name="email"
          validators={{ onMount: () => ({ message: "Email required at mount" }) }}
        >
          {(field: any) => <field.FieldText label="Email" placeholder="" />}
        </form.AppField>
      );
    }
    renderWithProviders(<Harness />);
    expect(await screen.findByText("Email required at mount")).toBeInTheDocument();
  });
});
