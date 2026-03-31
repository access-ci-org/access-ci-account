import {
  ssoCookieDomain,
  ssoCookieMaxAgeHours,
  ssoCookieName,
  ssoCookiePath,
  ssoCookieValue,
} from "@/config";

export const getCookieValue = (name: string) =>
  document.cookie.match("(^|;)\\s*" + name + "\\s*=\\s*([^;]+)")?.pop() || "";

export const deleteCookie = (
  name: string,
  path: string = "/",
  domain?: string,
) => {
  const expires = "Expires=Thu, 01 Jan 1970 00:00:01 GMT;";
  let cookieString = `${name}=;${expires}Path=${path};`;

  if (domain) {
    cookieString += `Domain=${domain};`;
  }

  document.cookie = cookieString;
};

export const popCookie = (name: string) => {
  const value = getCookieValue(name);
  deleteCookie(name);
  return value;
};

export const hasSsoCookie = (): boolean =>
  getCookieValue(ssoCookieName) === ssoCookieValue;

export const setSsoCookie = (): void => {
  const expires = new Date();
  expires.setTime(expires.getTime() + ssoCookieMaxAgeHours * 60 * 60 * 1000);

  let cookieString =
    `${ssoCookieName}=${encodeURIComponent(ssoCookieValue)};` +
    `Expires=${expires.toUTCString()};` +
    `Path=${ssoCookiePath};`;

  if (ssoCookieDomain && ssoCookieDomain !== "localhost") {
    cookieString += `Domain=${ssoCookieDomain};`;
  }

  if (window.location.protocol === "https:") {
    cookieString += "Secure;";
  }

  document.cookie = cookieString;
};

export const deleteSsoCookie = (): void => {
  const domain =
    ssoCookieDomain && ssoCookieDomain !== "localhost"
      ? ssoCookieDomain
      : undefined;

  deleteCookie(ssoCookieName, ssoCookiePath, domain);
};
