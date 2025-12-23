export const siteTitle = "ACCESS Account";
export const apiBaseUrl =
  import.meta.env.VITE_API_BASE_URL || "https://account.access-ci.org/api/v1";
export const ssoCookieName = "SESSaccesscisso";
export const ssoCookiePath = "/";
export const ssoCookieValue = "1";
export const ssoCookieDomain = window.location.host
  .split(".")
  .slice(-2)
  .join(".")
  .split(":")[0];
