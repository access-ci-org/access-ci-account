import { useStore } from "@tanstack/react-form";
import { recoveryEmailsEqual } from "@/helpers/email";
import { valuesEqual } from "@/helpers/compare";
import type { AccountResponse } from "@/helpers/types";

// Compares the live profile form against the last-persisted `account` (not
// the form's own defaultValues) since the OTP-verify flow stages a new
// recovery email straight into defaultValues on return — TanStack Form's own
// dirty tracking would never see that as a change. `recoveryEmails` is
// compared order-insensitively because makePrimary/deletePrimary reorder it
// without representing a change the user would recognize as "unsaved".
export function useUnsavedProfileChanges(form: any, account: AccountResponse) {
  const emailsDirty: boolean = useStore(
    form.store,
    (s: any) =>
      s.values.email !== account.email ||
      !recoveryEmailsEqual(s.values.recoveryEmails, account.recoveryEmails),
  );

  const otherFieldsDirty: boolean = useStore(form.store, (s: any) => {
    const { recoveryEmails: _recoveryEmails, email: _email, ...restValues } =
      s.values;
    const { recoveryEmails: _accountRecoveryEmails, email: _accountEmail, ...restAccount } =
      account;
    return !valuesEqual(restValues, restAccount);
  });

  return { emailsDirty, pageIsDirty: emailsDirty || otherFieldsDirty };
}
