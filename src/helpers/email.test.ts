import { describe, it, expect } from "vitest";
import { getDomainFromEmail } from "@/helpers/email";

describe("getDomainFromEmail", () => {
  it("extracts the domain from a simple address", () => {
    expect(getDomainFromEmail("user@example.com")).toBe("example.com");
  });

  it("trims whitespace and lowercases", () => {
    expect(getDomainFromEmail("  User@Example.COM ")).toBe("example.com");
  });

  it("returns null for an empty string", () => {
    expect(getDomainFromEmail("")).toBeNull();
  });

  it("returns null when there is no @", () => {
    expect(getDomainFromEmail("noatsign")).toBeNull();
  });

  it("returns null when the domain part is empty", () => {
    expect(getDomainFromEmail("user@")).toBeNull();
  });

  it("returns null when there are multiple @ signs", () => {
    expect(getDomainFromEmail("a@b@c")).toBeNull();
  });

  it("returns the domain when the local part is empty (documents current behavior)", () => {
    // Only the domain half is required to be non-empty, so "@b" yields "b".
    expect(getDomainFromEmail("@example.com")).toBe("example.com");
  });
});
