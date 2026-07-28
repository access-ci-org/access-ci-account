import { describe, it, expect } from "vitest";
import { validatePassword } from "@/helpers/password";

// Default policy (from src/config.tsx): length 12-64, >= 3 of 4 character
// classes (lowercase, uppercase, digit, symbol), >= 1 char per class.

describe("validatePassword — length rule", () => {
  it("accepts a strong password within bounds", () => {
    expect(validatePassword("Abcdef1!ghij")).toEqual([]);
  });

  it("rejects a password shorter than the minimum (11)", () => {
    const errors = validatePassword("Aa1bcdefghi"); // 11 chars, 3 classes
    expect(errors).toHaveLength(1);
    expect(errors[0]).toMatch(/between 12 and 64 characters/);
  });

  it("accepts exactly the minimum length (12)", () => {
    expect(validatePassword("Aa1bcdefghij")).toEqual([]);
  });

  it("accepts exactly the maximum length (64)", () => {
    const pw = "Aa1" + "b".repeat(61); // 64 chars, 3 classes
    expect(pw).toHaveLength(64);
    expect(validatePassword(pw)).toEqual([]);
  });

  it("rejects a password longer than the maximum (65)", () => {
    const pw = "Aa1" + "b".repeat(62); // 65 chars, 3 classes
    expect(pw).toHaveLength(65);
    const errors = validatePassword(pw);
    expect(errors).toHaveLength(1);
    expect(errors[0]).toMatch(/between 12 and 64 characters/);
  });
});

describe("validatePassword — character-class rule", () => {
  it("rejects a password using only one class", () => {
    const errors = validatePassword("abcdefghijkl"); // 12 lowercase
    expect(errors).toHaveLength(1);
    expect(errors[0]).toMatch(/three of the following/);
  });

  it("rejects a password using only two classes", () => {
    const errors = validatePassword("abcdefghijk1"); // lowercase + digit
    expect(errors).toHaveLength(1);
    expect(errors[0]).toMatch(/three of the following/);
  });

  it("accepts a password meeting exactly three classes", () => {
    expect(validatePassword("abcdefghij1A")).toEqual([]);
  });

  it("counts a space as a symbol-class character", () => {
    // "abcdefgh" (lower) + "ABC" (upper) + " " (symbol) = 3 classes, len 12
    expect(validatePassword("abcdefghABC ")).toEqual([]);
  });

  it("ignores duplicate characters when counting classes (Set dedup)", () => {
    // Unique chars {a, A, 1} → three classes despite repetition.
    expect(validatePassword("aaaaAAAA1111")).toEqual([]);
  });
});

describe("validatePassword — combined failures & edge cases", () => {
  it("reports both length and class errors for an empty string", () => {
    const errors = validatePassword("");
    expect(errors).toHaveLength(2);
    expect(errors.some((e) => /between 12 and 64/.test(e))).toBe(true);
    expect(errors.some((e) => /three of the following/.test(e))).toBe(true);
  });

  it("honors a custom policy's bounds and class count", () => {
    const policy = {
      minLength: 4,
      maxLength: 8,
      characterClasses: ["abcdefghijklmnopqrstuvwxyz", "0123456789"],
      minClasses: 1,
      minCharactersPerClass: 1,
    };
    expect(validatePassword("abcd", policy)).toEqual([]);
    expect(validatePassword("abc", policy)).toHaveLength(1); // too short
  });

  it("skips the class rule entirely when minClasses is 0", () => {
    const policy = {
      minLength: 1,
      maxLength: 64,
      characterClasses: [
        "abcdefghijklmnopqrstuvwxyz",
        "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
      ],
      minClasses: 0,
      minCharactersPerClass: 1,
    };
    expect(validatePassword("abc", policy)).toEqual([]);
  });
});
