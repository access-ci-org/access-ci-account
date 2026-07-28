import { describe, it, expect, vi } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderField } from "@/test/utils";
import type { Option } from "@/helpers/types";

const COLORS: Option<string>[] = [
  { label: "Red", value: "r" },
  { label: "Blue", value: "b" },
];

function renderCheckboxes(values: string[] | string | undefined) {
  const onChange = vi.fn();
  const utils = renderField({
    name: "colors",
    defaultValues: { colors: [] as string[] },
    render: (field) => (
      <field.FieldCheckboxes
        label="Colors"
        name="colors"
        values={values}
        onChange={onChange}
        options={COLORS}
      />
    ),
  });
  return { onChange, ...utils };
}

describe("FieldCheckboxes", () => {
  it("reflects the selected values as checked boxes", () => {
    renderCheckboxes(["r"]);
    expect(screen.getByRole("checkbox", { name: "Red" })).toBeChecked();
    expect(screen.getByRole("checkbox", { name: "Blue" })).not.toBeChecked();
  });

  it("adds an option to the selection when checked", async () => {
    const user = userEvent.setup();
    const { onChange } = renderCheckboxes(["r"]);
    await user.click(screen.getByRole("checkbox", { name: "Blue" }));
    expect(onChange).toHaveBeenCalledWith(["r", "b"]);
  });

  it("removes an option from the selection when unchecked", async () => {
    const user = userEvent.setup();
    const { onChange } = renderCheckboxes(["r"]);
    await user.click(screen.getByRole("checkbox", { name: "Red" }));
    expect(onChange).toHaveBeenCalledWith([]);
  });

  it("normalizes a single string value to a one-item selection", () => {
    renderCheckboxes("r");
    expect(screen.getByRole("checkbox", { name: "Red" })).toBeChecked();
  });

  it("treats an undefined value as an empty selection", async () => {
    const user = userEvent.setup();
    const { onChange } = renderCheckboxes(undefined);
    expect(screen.getByRole("checkbox", { name: "Red" })).not.toBeChecked();
    await user.click(screen.getByRole("checkbox", { name: "Red" }));
    expect(onChange).toHaveBeenCalledWith(["r"]);
  });
});
