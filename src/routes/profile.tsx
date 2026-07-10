import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { useAppForm } from "@/hooks/form";
import { siteTitle } from "@/config";
import FormProfile from "@/components/form-profile";
import {
  accountAtom,
  dismissNotificationAtom,
  domainAtom,
  emailAtom,
  emailOtpTokensAtom,
  profileFormAtom,
  saveProfileAtom,
  sendOtpAtom,
  store,
  verifyIntentAtom,
} from "@/helpers/state";

import {
  profileFormSchemaWithRecoveries,
  usernameSchema,
} from "@/helpers/validation";
import { useSetAtom } from "jotai";
import type { DomainResponse } from "@/helpers/types";
import { getDomainFromEmail } from "@/helpers/email";

export const Route = createFileRoute("/profile")({
  component: Profile,
  gcTime: 0, // Prevent the route from showing stale data while the loader resolves.
  head: () => ({ meta: [{ title: `Profile | ${siteTitle}` }] }),
  beforeLoad: () => {
    store.set(dismissNotificationAtom, ["profile-saved", "profile-error"]);
  },
  loader: async () => {
    const account = await store.get(accountAtom);
    let domain: DomainResponse | null = null;
    if ("error" in account) {
      throw redirect({ to: "/login" });
    }
    // Restore in-flight edits when returning from the OTP verification page
    // (e.g. after adding a recovery email); otherwise start fresh from the account.
    const pending = store.get(profileFormAtom);
    const initial =
      pending.username && pending.username === account.username
        ? pending
        : account;
    store.set(emailAtom, initial.email);
    domain = await store.get(domainAtom);
    return { account, initial, domain };
  },
});

function Profile() {
  const { account, initial, domain } = Route.useLoaderData();
  const setProfileForm = useSetAtom(profileFormAtom);
  const saveProfile = useSetAtom(saveProfileAtom);
  const sendOtp = useSetAtom(sendOtpAtom);
  const setVerifyIntent = useSetAtom(verifyIntentAtom);
  const setEmail = useSetAtom(emailAtom);
  const navigate = useNavigate();

  const form = useAppForm({
    defaultValues: initial,
    listeners: {
      onBlur: async ({ fieldApi, formApi }) => {
        if (fieldApi.name === "email") {
          if (
            getDomainFromEmail(account.email) !==
            getDomainFromEmail(fieldApi.state.value)
          )
            formApi.setFieldValue("organizationId", 0);
        }
      },
    },
    validators: {
      onSubmit: profileFormSchemaWithRecoveries.and(usernameSchema),
    },
    onSubmit: async ({ value }) => {
      setProfileForm(value);

      // Is the primary email new to the account (needs OTP verification)? A
      // primary that is unchanged or promoted from an existing recovery address does not.
      const accountEmails = new Set(
        [account.email, ...account.recoveryEmails.map((b) => b.email)].map((e) =>
          e.trim().toLowerCase(),
        ),
      );
      const primaryLc = value.email.trim().toLowerCase();
      const primaryIsNew = !accountEmails.has(primaryLc);
      const hasToken = !!store.get(emailOtpTokensAtom)[primaryLc];

      if (primaryIsNew && !hasToken) {
        // Verify ownership of the new primary email, then commit on return.
        setVerifyIntent("save");
        setEmail(value.email);
        await sendOtp();
        navigate({ to: "/$flow/verify", params: { flow: "profile" } });
        return;
      }

      const { saved } = await saveProfile();
      if (saved) {
        navigate({ to: "/" });
      } else {
        window.scrollTo({ top: 0 });
      }
    },
  });

  return (
    <>
      <h1>ACCESS Profile</h1>
      <FormProfile form={form} domain={domain} />
    </>
  );
}
