import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useSetAtom } from "jotai";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { BackupEmail } from "@/helpers/types";
import {
  emailAtom,
  profileFormAtom,
  pushNotificationAtom,
  sendOtpAtom,
  store,
  verifyIntentAtom,
} from "@/helpers/state";
import { getDomainFromEmail } from "@/helpers/email";
import { backupEmailSchema } from "@/helpers/validation";

// FieldsetBackupEmails renders the profile-only backup email manager. It lives
// OUTSIDE the shared FieldGroupRegistration so backup emails never appear on the
// registration form. Adds route through the existing OTP verification flow;
// removes and "make primary" are staged in the form and committed on Save.
export default function FieldsetBackupEmails({ form }: { form: any }) {
  const [newEmail, setNewEmail] = useState("");
  const navigate = useNavigate();
  const sendOtp = useSetAtom(sendOtpAtom);
  const pushNotification = useSetAtom(pushNotificationAtom);

  const addBackupEmail = async () => {
    const email = newEmail.trim();
    const parsed = backupEmailSchema.safeParse(email);
    if (!parsed.success) {
      pushNotification({
        id: "backup-email-invalid",
        title: "Invalid Email Address",
        message: "Please enter a valid email address.",
        variant: "error",
      });
      return;
    }

    const values = form.state.values;
    const existing = [
      values.email,
      ...((values.backupEmails ?? []) as BackupEmail[]).map((b) => b.email),
    ].map((e: string) => e.trim().toLowerCase());
    if (existing.includes(email.toLowerCase())) {
      pushNotification({
        id: "backup-email-invalid",
        title: "Email Already Added",
        message: "That email address is already on your account.",
        variant: "error",
      });
      return;
    }

    // Stash the in-flight form (with the pending backup) so it survives the
    // verification round-trip, then send the OTP and go verify ownership. On
    // return, the profile loader restores this value and the backup is listed.
    const nextValues = {
      ...values,
      backupEmails: [
        ...((values.backupEmails ?? []) as BackupEmail[]),
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
    <form.AppField name="backupEmails" mode="array">
      {(backupField: any) => {
        const rows = (backupField.state.value ?? []) as BackupEmail[];

        const removeRow = (idx: number) => backupField.removeValue(idx);

        const makePrimary = (idx: number) => {
          const values = form.state.values;
          const backups = (values.backupEmails ?? []) as BackupEmail[];
          const promoted = backups[idx];
          if (!promoted) return;

          const domainChanged =
            getDomainFromEmail(values.email) !==
            getDomainFromEmail(promoted.email);

          // The old primary drops into the backup list; the promoted address
          // becomes the primary. No OTP is needed for an already-verified email.
          const nextBackups = backups.filter((_, i) => i !== idx);
          nextBackups.push({ email: values.email, verified: true });

          form.setFieldValue("backupEmails", nextBackups);
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
              Backup Email Addresses
            </legend>

            <p className="text-sm text-slate-600">
              Backup email addresses are used for account recovery and
              notifications. You can make an eligible backup address your primary
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
                      aria-label={`Remove backup email ${row.email}`}
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
                placeholder="Add a backup email address"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
              />
              <Button
                type="button"
                size="lg"
                onClick={addBackupEmail}
                className="bg-[var(--teal-700)] border-[var(--teal-700)] text-white hover:bg-white hover:text-[var(--teal-700)]"
              >
                Add Backup Email
              </Button>
            </div>
          </fieldset>
        );
      }}
    </form.AppField>
  );
}
