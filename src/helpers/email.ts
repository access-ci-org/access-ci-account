export const getDomainFromEmail = (email: string) => {
  if (!email) return null;
  const email_parts = email.trim().toLowerCase().split("@");
  if (email_parts.length !== 2 || !email_parts[1]) return null;
  return email_parts[1];
};

// Order-insensitive: makePrimary/deletePrimary reorder the recoveryEmails
// array, which shouldn't by itself count as an unsaved change.
export const recoveryEmailsEqual = (
  a: { email: string }[],
  b: { email: string }[],
) => {
  const norm = (list: { email: string }[]) =>
    list.map((r) => r.email.trim().toLowerCase()).sort();
  const [na, nb] = [norm(a), norm(b)];
  return na.length === nb.length && na.every((e, i) => e === nb[i]);
};
