export const siteTitle = "ACCESS Account";
export const apiBaseUrl =
  import.meta.env.VITE_API_BASE_URL || "/api/v1" //"https://account.access-ci.org/api/v1";

export const MIN_LENGTH: number = 12;
export const MAX_LENGTH: number = 64;
export const MIN_CLASSES: number = 3;
export const MIN_CHARACTERS_PER_CLASS: number = 1;


export const ssoCookieName = "SESSaccesscisso";
export const ssoCookiePath = "/";
export const ssoCookieValue = "1";
export const ssoCookieDomain = window.location.host
  .split(".")
  .slice(-2)
  .join(".")
  .split(":")[0];
