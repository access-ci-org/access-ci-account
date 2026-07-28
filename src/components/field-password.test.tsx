import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderField } from "@/test/utils";

function renderPassword() {
  return renderField({
    name: "password",
    defaultValues: { password: "" },
    render: (field) => (
      <>
        <field.FieldPassword label="Password" placeholder="Enter" />
        <output data-testid="value">{field.state.value}</output>
      </>
    ),
  });
}

describe("FieldPassword", () => {
  it("masks the input by default and writes typing into the form value", async () => {
    const user = userEvent.setup();
    renderPassword();
    const input = screen.getByLabelText("Password");
    expect(input).toHaveAttribute("type", "password");
    await user.type(input, "s3cret");
    expect(screen.getByTestId("value")).toHaveTextContent("s3cret");
  });

  it("toggles visibility when the show/hide button is clicked", async () => {
    const user = userEvent.setup();
    renderPassword();
    const input = screen.getByLabelText("Password");
    await user.click(screen.getByRole("button"));
    expect(input).toHaveAttribute("type", "text");
    await user.click(screen.getByRole("button"));
    expect(input).toHaveAttribute("type", "password");
  });
});
