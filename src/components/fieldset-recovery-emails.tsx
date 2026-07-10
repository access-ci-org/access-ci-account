import { useNavigate } from "@tanstack/react-router";
import { useAtomValue, useSetAtom } from "jotai";
import { loadable } from "jotai/utils";
import { Button } from "@/components/ui/button";
import { useAppForm } from "@/hooks/form";
import type { RecoveryEmail } from "@/helpers/types";
import {
  emailAtom,
  getDomainInfoAtom,
  profileFormAtom,
  sendOtpAtom,
  store,
  verifyIntentAtom,
} from "@/helpers/state";
import { getDomainFromEmail } from "@/helpers/email";
import { recoveryEmailSchema } from "@/helpers/validation";

// Shows "Make Primary" only once we know the recovery address's domain is
// eligible and has at least one organization to select on promotion.
function RecoveryEmailRow({
  row,
  onMakePrimary,
  onRemove,
}: {
  row: RecoveryEmail;
  onMakePrimary: () => void;
  onRemove: () => void;
}) {
  const domain = getDomainFromEmail(row.email);
  const domainInfo = useAtomValue(loadable(getDomainInfoAtom(domain ?? "")));
  const canMakePrimary =
    domainInfo.state === "hasData" &&
    !!domainInfo.data?.isEligible &&
    (domainInfo.data?.organizations.length ?? 0) > 0;

  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-[1fr_auto_auto] md:items-center">
      <span className="break-all">{row.email}</span>
      {canMakePrimary ? (
        <Button
          type="button"
          size="lg"
          onClick={onMakePrimary}
          className="bg-[var(--teal-700)] border-[var(--teal-700)] text-white hover:bg-white hover:text-[var(--teal-700)]"
        >
          Make Primary
        </Button>
      ) : (
        <span />
      )}
      <Button
        type="button"
        variant="destructive"
        size="lg"
        className="border-red-600 hover:bg-white hover:border-red-600"
        onClick={onRemove}
        aria-label={`Remove recovery email ${row.email}`}
      >
        Remove
      </Button>
    </div>
  );
}

// FieldsetRecoveryEmails renders the profile-only recovery email manager. It lives
// OUTSIDE the shared FieldGroupRegistration so recovery emails never appear on the
// registration form. Adds route through the existing OTP verification flow;
// removes and "make primary" are staged in the form and committed on Save.
export default function FieldsetRecoveryEmails({ form }: { form: any }) {
  const navigate = useNavigate();
  const sendOtp = useSetAtom(sendOtpAtom);

  // A standalone form for the "add a recovery email" input only, so it can render
  // through field.FieldText (which needs a form.AppField context) without staging
  // its value in the profile form itself. Its own onSubmit only runs once the
  // "newEmail" field's validators (below) pass, so invalid/duplicate addresses
  // never reach here — they show as an inline field error instead.
  const addEmailForm = useAppForm({
    defaultValues: { newEmail: "" },
    onSubmit: async ({ value }) => {
      const email = value.newEmail.trim();

      // Stash the in-flight form so other edits survive the verification round trip,
      // without adding the pending address to recoveryEmails yet — it's only added
      // once ownership is actually verified (see $flow.verify.tsx's "collect"
      // handling). Otherwise navigating away without completing the OTP (e.g. the
      // browser back button) would leave an unverified address in the list.
      store.set(profileFormAtom, form.state.values);
      store.set(verifyIntentAtom, "collect");
      store.set(emailAtom, email);
      addEmailForm.setFieldValue("newEmail", "");
      await sendOtp();
      navigate({ to: "/$flow/verify", params: { flow: "profile" } });
    },
  });

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
              className="mb-0 flex w-fit items-center gap-2 text-sm leading-snug font-semibold select-none"
            >
              Recovery Email Addresses
            </legend>

            <p className="text-sm! text-muted-foreground">
              Recovery email addresses are used for account recovery and
              notifications.
            </p>

            {rows.length > 0 && (
              <div className="space-y-2">
                {rows.map((row, idx) => (
                  <RecoveryEmailRow
                    key={idx}
                    row={row}
                    onMakePrimary={() => makePrimary(idx)}
                    onRemove={() => removeRow(idx)}
                  />
                ))}
              </div>
            )}

            <div className="grid grid-cols-1 gap-3 md:grid-cols-[1fr_auto] md:items-start">
              <addEmailForm.AppField
                name="newEmail"
                validators={{
                  onSubmit: ({ value }: { value: string }) => {
                    const email = value.trim();
                    const parsed = recoveryEmailSchema.safeParse(email);
                    if (!parsed.success)
                      return { message: "Please enter a valid email address." };

                    const values = form.state.values;
                    const existing = [
                      values.email,
                      ...((values.recoveryEmails ?? []) as RecoveryEmail[]).map(
                        (b) => b.email,
                      ),
                    ].map((e: string) => e.trim().toLowerCase());
                    if (existing.includes(email.toLowerCase()))
                      return {
                        message: "That email address is already on your account.",
                      };
                  },
                }}
                children={(field) => (
                  <field.FieldText
                    label="Recovery Email Address"
                    placeholder="Add a recovery email address"
                  />
                )}
              />
              <Button
                type="button"
                size="lg"
                onClick={() => addEmailForm.handleSubmit()}
                className="bg-[var(--teal-700)] border-[var(--teal-700)] text-white hover:bg-white hover:text-[var(--teal-700)] md:mt-8"
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
