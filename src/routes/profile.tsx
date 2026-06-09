import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { useAppForm } from "@/hooks/form";
import { siteTitle } from "@/config";
import FormProfile from "@/components/form-profile";
import {
  accountAtom,
  dismissNotificationAtom,
  domainAtom,
  emailAtom,
  profileFormAtom,
  saveProfileAtom,
  sendOtpAtom,
  store,
} from "@/helpers/state";

import { profileFormSchema, usernameSchema } from "@/helpers/validation";
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
    } else {
      store.set(emailAtom, account.email);
      domain = await store.get(domainAtom);
    }
    return { account, domain };
  },
});

function Profile() {
  const { account, domain } = Route.useLoaderData();
  const setProfileForm = useSetAtom(profileFormAtom);
  const saveProfile = useSetAtom(saveProfileAtom);
  const sendOtp = useSetAtom(sendOtpAtom);
  const navigate = useNavigate();

  const form = useAppForm({
    defaultValues: account,
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
      onSubmit: profileFormSchema.and(usernameSchema),
    },
    onSubmit: async ({ value }) => {
      setProfileForm(value);
      if (value.email === account.email) {
        // The email address has not changed. Save the profile now.
        const { saved } = await saveProfile();
        if (saved) {
          navigate({ to: "/" });
        } else {
          window.scrollTo({ top: 0 });
        }
      } else {
        // The email address has changed. Verify the email address before
        // saving the profile.
        await sendOtp();
        navigate({
          to: "/$flow/verify",
          params: { flow: "profile" },
        });
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
