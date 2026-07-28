import { describe, it, expect, beforeEach } from "vitest";
import {
  getCookieValue,
  deleteCookie,
  hasSsoCookie,
  setSsoCookie,
  deleteSsoCookie,
} from "@/helpers/cookie";
import { ssoCookieName, ssoCookieValue } from "@/config";

// jsdom shares document.cookie within a file; clear the cookies we touch.
function clearCookie(name: string) {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
}

beforeEach(() => {
  clearCookie(ssoCookieName);
  clearCookie("temp");
});

describe("getCookieValue", () => {
  it("returns the value of a present cookie", () => {
    document.cookie = "temp=bar";
    expect(getCookieValue("temp")).toBe("bar");
  });

  it("returns an empty string for an absent cookie", () => {
    expect(getCookieValue("does-not-exist")).toBe("");
  });
});

describe("deleteCookie", () => {
  it("removes a cookie", () => {
    document.cookie = "temp=1";
    expect(getCookieValue("temp")).toBe("1");
    deleteCookie("temp");
    expect(getCookieValue("temp")).toBe("");
  });
});

describe("SSO cookie helpers", () => {
  it("setSsoCookie writes a cookie hasSsoCookie recognizes", () => {
    expect(hasSsoCookie()).toBe(false);
    setSsoCookie();
    expect(getCookieValue(ssoCookieName)).toBe(ssoCookieValue);
    expect(hasSsoCookie()).toBe(true);
  });

  it("deleteSsoCookie clears it", () => {
    setSsoCookie();
    expect(hasSsoCookie()).toBe(true);
    deleteSsoCookie();
    expect(hasSsoCookie()).toBe(false);
  });

  it("hasSsoCookie is false when the cookie holds a different value", () => {
    document.cookie = `${ssoCookieName}=999`;
    expect(hasSsoCookie()).toBe(false);
  });
});
