import { describe, it, expect } from "vitest";
import { valuesEqual } from "@/helpers/compare";

describe("valuesEqual", () => {
  it("treats identical primitives as equal", () => {
    expect(valuesEqual("a", "a")).toBe(true);
    expect(valuesEqual(1, 1)).toBe(true);
    expect(valuesEqual(true, true)).toBe(true);
  });

  it("treats different primitives as unequal", () => {
    expect(valuesEqual("a", "b")).toBe(false);
    expect(valuesEqual(1, 2)).toBe(false);
  });

  it("deep-compares nested objects", () => {
    expect(
      valuesEqual({ a: { b: 1, c: [1, 2] } }, { a: { b: 1, c: [1, 2] } }),
    ).toBe(true);
    expect(
      valuesEqual({ a: { b: 1, c: [1, 2] } }, { a: { b: 1, c: [1, 3] } }),
    ).toBe(false);
  });

  it("is order-sensitive for arrays", () => {
    expect(valuesEqual([1, 2], [2, 1])).toBe(false);
  });

  it("treats missing keys as different from undefined-valued keys consistently", () => {
    expect(valuesEqual({ a: 1 }, { a: 1, b: undefined })).toBe(true);
  });
});
