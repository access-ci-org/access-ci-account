import { useNavigate } from "@tanstack/react-router";
import { useAtomValue, useSetAtom } from "jotai";
import { loadable } from "jotai/utils";
import { useAppForm } from "@/hooks/form";
import type { RecoveryEmail } from "@/helpers/types";
import {
  emailAtom,
  getDomainInfoAtom,
  profileFormAtom,
  sendOtpAtom,
  store,
} from "@/helpers/state";
import { getDomainFromEmail } from "@/helpers/email";
import { recoveryEmailSchema } from "@/helpers/validation";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import EmailToken from "@/components/email-token";

// A recovery token's "Make Primary" menu item is only offered once we know
// its domain is eligible and has at least one organization to select on
// promotion.
function RecoveryToken({
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
    <EmailToken
      email={row.email}
      label="Recovery"
      primaryActionLabel="Make Primary"
      onPrimaryAction={canMakePrimary ? onMakePrimary : undefined}
      onDelete={onRemove}
    />
  );
}

// FieldEmailTokens renders the profile's primary + recovery emails as a
// single row of tokens, injected into FieldGroupRegistration via its
// emailSlot prop so the registration form keeps a plain text email field.
// Adding an address routes through the existing OTP verification flow;
// removes and "make primary" are staged in the form and committed on Save.
export default function FieldEmailTokens({ form }: { form: any }) {
  const navigate = useNavigate();
  const sendOtp = useSetAtom(sendOtpAtom);

  // A standalone form for the "add an email" input only, so it can render
  // without staging its value in the profile form itself. Its own onSubmit
  // only runs once the "newEmail" field's validators (below) pass, so
  // invalid/duplicate addresses never reach here — they show as an inline
  // field error instead.
  const addEmailForm = useAppForm({
    defaultValues: { newEmail: "" },
    onSubmit: async ({ value }) => {
      const email = value.newEmail.trim();

      // Stash the in-flight form so other edits survive the verification
      // round trip. The address isn't added to email/recoveryEmails yet —
      // only once ownership is verified (see $flow.verify.tsx) — otherwise
      // navigating away without completing the OTP (e.g. the browser back
      // button) would leave an unverified address in the list.
      store.set(profileFormAtom, form.state.values);
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
        const primaryEmail = form.state.values.email as string;

        const removeRow = (idx: number) => recoveryField.removeValue(idx);

        const makePrimary = (idx: number) => {
          const values = form.state.values;
          const recoveries = (values.recoveryEmails ?? []) as RecoveryEmail[];
          const promoted = recoveries[idx];
          if (!promoted) return;

          const domainChanged =
            getDomainFromEmail(values.email) !==
            getDomainFromEmail(promoted.email);

          // The old primary drops into the recovery list; the promoted
          // address becomes the primary. No OTP is needed for an
          // already-verified email.
          const nextRecoveries = recoveries.filter((_, i) => i !== idx);
          nextRecoveries.push({ email: values.email, verified: true });

          form.setFieldValue("recoveryEmails", nextRecoveries);
          form.setFieldValue("email", promoted.email);
          store.set(emailAtom, promoted.email);

          // Force an explicit organization choice when the domain changes
          // (R1), mirroring the primary email field's old reset behavior.
          if (domainChanged) form.setFieldValue("organizationId", 0);
        };

        // Deletes the primary address outright (unlike makePrimary, the old
        // primary does not get demoted into recoveryEmails). Only offered
        // when there's a recovery address to take over as primary, so the
        // account is never left without one.
        const deletePrimary = () => {
          const values = form.state.values;
          const recoveries = (values.recoveryEmails ?? []) as RecoveryEmail[];
          const next = recoveries[0];
          if (!next) return;

          const domainChanged =
            getDomainFromEmail(values.email) !== getDomainFromEmail(next.email);

          form.setFieldValue("recoveryEmails", recoveries.slice(1));
          form.setFieldValue("email", next.email);
          store.set(emailAtom, next.email);

          if (domainChanged) form.setFieldValue("organizationId", 0);
        };

        return (
          <Field>
            <FieldLabel>Email Addresses</FieldLabel>

            <p className="text-sm! text-muted-foreground">You can add one primary and multiple recovery email addresses. Your primary email must match your institution. Your recovery email addresses can be used to change your password if you lose access to your primary email address.</p>

            <div className="flex flex-wrap items-center gap-2">
              {primaryEmail && (
                <EmailToken
                  email={primaryEmail}
                  label="Primary"
                  primaryActionLabel="Make Recovery"
                  onPrimaryAction={rows.length > 0 ? () => makePrimary(0) : undefined}
                  onDelete={rows.length > 0 ? deletePrimary : undefined}
                />
              )}
              {rows.map((row, idx) => (
                <RecoveryToken
                  key={idx}
                  row={row}
                  onMakePrimary={() => makePrimary(idx)}
                  onRemove={() => removeRow(idx)}
                />
              ))}
            </div>

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
                        message:
                          "That email address is already on your account.",
                      };
                  },
                }}
                children={(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <Field data-invalid={isInvalid}>
                      <Input
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            addEmailForm.handleSubmit();
                          }
                        }}
                        aria-invalid={isInvalid}
                        placeholder="Add an email address"
                        autoComplete="off"
                        className="bg-white border-[var(--teal-700)] rounded-none shadow-none"
                      />
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  );
                }}
              />
              <Button
                type="button"
                size="lg"
                onClick={() => addEmailForm.handleSubmit()}
                className="bg-[var(--teal-700)] border-[var(--teal-700)] text-white hover:bg-white hover:text-[var(--teal-700)]"
              >
                Verify and Add
              </Button>
            </div>
          </Field>
        );
      }}
    </form.AppField>
  );
}
