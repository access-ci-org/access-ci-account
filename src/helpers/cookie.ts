export const getCookieValue = (name: string) =>
  document.cookie.match("(^|;)\\s*" + name + "\\s*=\\s*([^;]+)")?.pop() || "";

export const deleteCookie = (
  name: string,
  path: string = "/",
  domain?: string,
) => {
  // Set an expiration date in the past
  const expires = "Expires=Thu, 01 Jan 1970 00:00:01 GMT;";
  let cookieString = name + "=;" + expires + "Path=" + path + ";";

  if (domain) {
    cookieString += "Domain=" + domain + ";";
  }

  document.cookie = cookieString;
};

export const popCookie = (name: string) => {
  const value = getCookieValue(name);
  deleteCookie(name);
  return value;
};
