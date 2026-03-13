import {
  ssoCookieDomain,
  ssoCookieMaxAgeHours,
  ssoCookieName,
  ssoCookiePath,
  ssoCookieValue,
} from "@/config";

export function getCookie(name: string): string | null {
  const cookies = document.cookie.split(";").map((cookie) => cookie.trim());

  for (const cookie of cookies) {
    if (cookie.startsWith(`${name}=`)) {
      return decodeURIComponent(cookie.slice(name.length + 1));
    }
  }

  return null;
}

export function hasSsoCookie(): boolean {
  return getCookie(ssoCookieName) === ssoCookieValue;
}

export function setSsoCookie(): void {
  const expires = new Date();
  expires.setTime(expires.getTime() + ssoCookieMaxAgeHours * 60 * 60 * 1000);

  const parts = [
    `${ssoCookieName}=${encodeURIComponent(ssoCookieValue)}`,
    `expires=${expires.toUTCString()}`,
    `path=${ssoCookiePath}`,
  ];

  if (ssoCookieDomain && ssoCookieDomain !== "localhost") {
    parts.push(`domain=${ssoCookieDomain}`);
  }

  if (window.location.protocol === "https:") {
    parts.push("secure");
  }

  document.cookie = parts.join("; ");
}

export function deleteSsoCookie(): void {
  const parts = [
    `${ssoCookieName}=`,
    "expires=Thu, 01 Jan 1970 00:00:00 GMT",
    `path=${ssoCookiePath}`,
  ];

  if (ssoCookieDomain && ssoCookieDomain !== "localhost") {
    parts.push(`domain=${ssoCookieDomain}`);
  }

  document.cookie = parts.join("; ");
}