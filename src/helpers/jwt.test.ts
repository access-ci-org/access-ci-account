import { describe, it, expect } from "vitest";
import { parseJwt } from "@/helpers/jwt";
import { makeJwt } from "@/test/utils";

describe("parseJwt", () => {
  it("decodes the payload of a well-formed token", () => {
    const token = makeJwt({
      sub: "ada@access-ci.org",
      isAdmin: true,
      exp: 1893456000,
    });
    const payload = parseJwt(token);
    expect(payload.sub).toBe("ada@access-ci.org");
    expect(payload.isAdmin).toBe(true);
    expect(payload.exp).toBe(1893456000);
  });

  it("round-trips non-ASCII (UTF-8) payload values", () => {
    const token = makeJwt({ name: "José Ólafur" });
    expect(parseJwt(token).name).toBe("José Ólafur");
  });

  // parseJwt guards malformed input by returning null so callers degrade
  // gracefully rather than throwing out of a route guard.
  it("returns null for a token with no payload segment", () => {
    expect(parseJwt("not-a-jwt")).toBeNull();
  });

  it("returns null for empty or nullish input", () => {
    expect(parseJwt("")).toBeNull();
    expect(parseJwt(null)).toBeNull();
    expect(parseJwt(undefined)).toBeNull();
  });

  it("returns null when the payload segment cannot be decoded", () => {
    expect(parseJwt("a.!!!.c")).toBeNull();
  });
});
