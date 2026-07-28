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

  // The implementation has no guard for malformed input; these tests pin the
  // current throwing behavior so any future hardening is a conscious change.
  it("throws on a token with no payload segment", () => {
    expect(() => parseJwt("not-a-jwt")).toThrow();
  });

  it("throws on an empty string", () => {
    expect(() => parseJwt("")).toThrow();
  });
});
