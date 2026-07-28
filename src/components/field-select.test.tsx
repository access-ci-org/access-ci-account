import { describe, it, expect, vi } from "vitest";
import { screen } from "@testing-library/react";
import { atom } from "jotai";
import { renderField, type TestStore } from "@/test/utils";
import type { Option } from "@/helpers/types";

const OPTIONS: Option<number>[] = [
  { label: "Alpha", value: 1 },
  { label: "Beta", value: 2 },
];

function renderSelect(props: Record<string, unknown>, store?: TestStore) {
  const onChange = props.onChange ?? vi.fn();
  const utils = renderField({
    name: "choice",
    defaultValues: { choice: 0 },
    store,
    render: (field) => <field.FieldSelect name="choice" onChange={onChange} {...props} />,
  });
  return { onChange: onChange as ReturnType<typeof vi.fn>, ...utils };
}

describe("FieldSelect", () => {
  it("shows the option whose value matches the current value (single)", () => {
    const { onChange } = renderSelect({ label: "Pick", options: OPTIONS, value: 1 });
    expect(screen.getByText("Alpha")).toBeInTheDocument();
    expect(onChange).not.toHaveBeenCalled();
  });

  it("resets to null during render when the value is missing from options", () => {
    // Pins the render-time handleChange(null) behavior at field-select.tsx:87 —
    // historically the source of silent select-field zeroing.
    const { onChange } = renderSelect({ label: "Pick", options: OPTIONS, value: 999 });
    expect(onChange).toHaveBeenCalledWith(null);
  });

  it("does not reset when the value is falsy (0 / unselected)", () => {
    const { onChange } = renderSelect({
      label: "Pick",
      options: OPTIONS,
      value: 0,
      placeholder: "Choose one",
    });
    expect(onChange).not.toHaveBeenCalled();
    expect(screen.getByText("Choose one")).toBeInTheDocument();
  });

  it("renders as multi-select when the value is an array", () => {
    renderSelect({ label: "Pick", options: OPTIONS, value: [1, 2] });
    expect(screen.getByText("Alpha")).toBeInTheDocument();
    expect(screen.getByText("Beta")).toBeInTheDocument();
  });

  it("does not reset a multi-select with unknown values (single/multi asymmetry)", () => {
    const { onChange } = renderSelect({ label: "Pick", options: OPTIONS, value: [999] });
    expect(onChange).not.toHaveBeenCalled();
  });

  it("routes optionsAtom through AwaitAtom's Suspense boundary", () => {
    // Passing optionsAtom (instead of static options) must suspend behind a
    // spinner while the async atom loads, rather than render an empty select.
    const optionsAtom = atom(async () => OPTIONS);
    const { container } = renderSelect({ label: "Pick", optionsAtom, placeholder: "Ready" });
    expect(container.querySelector(".animate-spin")).toBeInTheDocument();
  });
});
