// Adapted from: https://stackoverflow.com/a/38552302
// Returns the decoded JWT payload, or null for missing/malformed input so
// callers (auth callback, OTP verification) can degrade gracefully instead of
// throwing out of a route guard.
export function parseJwt(token: string | null | undefined) {
  if (!token) return null;

  const base64Url = token.split(".")[1];
  if (!base64Url) return null;

  try {
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      window
        .atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join(""),
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}
