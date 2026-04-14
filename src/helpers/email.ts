export const getDomainFromEmail = (email: string) => {
  if (!email) return null;
  const email_parts = email.trim().toLowerCase().split("@");
  if (email_parts.length !== 2 || !email_parts[1]) return null;
  return email_parts[1];
};
