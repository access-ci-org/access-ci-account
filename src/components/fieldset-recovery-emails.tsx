import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useSetAtom } from "jotai";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { RecoveryEmail } from "@/helpers/types";
import {
  emailAtom,
  profileFormAtom,
  pushNotificationAtom,
  sendOtpAtom,
  store,
  verifyIntentAtom,
} from "@/helpers/state";
import { getDomainFromEmail } from "@/helpers/email";
import { recoveryEmailSchema } from "@/helpers/validation";

// FieldsetRecoveryEmails renders the profile-only recovery email manager. It lives
// OUTSIDE the shared FieldGroupRegistration so recovery emails never appear on the
// registration form. Adds route through the existing OTP verification flow;
// removes and "make primary" are staged in the form and committed on Save.
export default function FieldsetRecoveryEmails({ form }: { form: any }) {
  const [newEmail, setNewEmail] = useState("");
  const navigate = useNavigate();
  const sendOtp = useSetAtom(sendOtpAtom);
  const pushNotification = useSetAtom(pushNotificationAtom);

  const addRecoveryEmail = async () => {
    const email = newEmail.trim();
    const parsed = recoveryEmailSchema.safeParse(email);
    if (!parsed.success) {
      pushNotification({
        id: "recovery-email-invalid",
        title: "Invalid Email Address",
        message: "Please enter a valid email address.",
        variant: "error",
      });
      return;
    }

    const values = form.state.values;
    const existing = [
      values.email,
      ...((values.recoveryEmails ?? []) as RecoveryEmail[]).map((b) => b.email),
    ].map((e: string) => e.trim().toLowerCase());
    if (existing.includes(email.toLowerCase())) {
      pushNotification({
        id: "recovery-email-invalid",
        title: "Email Already Added",
        message: "That email address is already on your account.",
        variant: "error",
      });
      return;
    }

    // Stash the in-flight form (with the pending recovery email) so it survives the
    // verification round-trip, then send the OTP and go verify ownership. On
    // return, the profile loader restores this value and the recovery email is listed.
    const nextValues = {
      ...values,
      recoveryEmails: [
        ...((values.recoveryEmails ?? []) as RecoveryEmail[]),
        { email, verified: false },
      ],
    };
    store.set(profileFormAtom, nextValues);
    store.set(verifyIntentAtom, "collect");
    store.set(emailAtom, email);
    setNewEmail("");
    await sendOtp();
    navigate({ to: "/$flow/verify", params: { flow: "profile" } });
  };

  return (
    <form.AppField name="recoveryEmails" mode="array">
      {(recoveryField: any) => {
        const rows = (recoveryField.state.value ?? []) as RecoveryEmail[];

        const removeRow = (idx: number) => recoveryField.removeValue(idx);

        const makePrimary = (idx: number) => {
          const values = form.state.values;
          const recoveries = (values.recoveryEmails ?? []) as RecoveryEmail[];
          const promoted = recoveries[idx];
          if (!promoted) return;

          const domainChanged =
            getDomainFromEmail(values.email) !==
            getDomainFromEmail(promoted.email);

          // The old primary drops into the recovery list; the promoted address
          // becomes the primary. No OTP is needed for an already-verified email.
          const nextRecoveries = recoveries.filter((_, i) => i !== idx);
          nextRecoveries.push({ email: values.email, verified: true });

          form.setFieldValue("recoveryEmails", nextRecoveries);
          form.setFieldValue("email", promoted.email);
          store.set(emailAtom, promoted.email);

          // Force an explicit organization choice when the domain changes (R1),
          // mirroring the primary-email field's reset behavior.
          if (domainChanged) form.setFieldValue("organizationId", 0);
        };

        return (
          <fieldset className="space-y-4 border border-slate-300 p-4">
            <legend
              data-slot="field-label"
              className="mb-3 flex w-fit items-center gap-2 text-sm leading-snug font-semibold select-none"
            >
              Recovery Email Addresses
            </legend>

            <p className="text-sm text-slate-600">
              Recovery email addresses are used for account recovery and
              notifications. You can make an eligible recovery address your primary
              address; you will be asked to choose a matching organization.
            </p>

            {rows.length > 0 && (
              <div className="space-y-2">
                {rows.map((row, idx) => (
                  <div
                    key={idx}
                    className="grid grid-cols-1 gap-3 md:grid-cols-[1fr_auto_auto] md:items-center"
                  >
                    <span className="break-all">{row.email}</span>
                    <Button
                      type="button"
                      size="lg"
                      onClick={() => makePrimary(idx)}
                      className="bg-[var(--teal-700)] border-[var(--teal-700)] text-white hover:bg-white hover:text-[var(--teal-700)]"
                    >
                      Make Primary
                    </Button>
                    <Button
                      type="button"
                      variant="destructive"
                      size="lg"
                      className="border-red-600 hover:bg-white hover:border-red-600"
                      onClick={() => removeRow(idx)}
                      aria-label={`Remove recovery email ${row.email}`}
                    >
                      Remove
                    </Button>
                  </div>
                ))}
              </div>
            )}

            <div className="grid grid-cols-1 gap-3 md:grid-cols-[1fr_auto] md:items-center">
              <Input
                type="email"
                placeholder="Add a recovery email address"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
              />
              <Button
                type="button"
                size="lg"
                onClick={addRecoveryEmail}
                className="bg-[var(--teal-700)] border-[var(--teal-700)] text-white hover:bg-white hover:text-[var(--teal-700)]"
              >
                Add Recovery Email
              </Button>
            </div>
          </fieldset>
        );
      }}
    </form.AppField>
  );
}
