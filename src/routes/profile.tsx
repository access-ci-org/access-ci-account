import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { useAppForm } from "@/hooks/form";
import { siteTitle } from "@/config";
import ProfileForm from "@/components/profile-form";
import {
  accountAtom,
  dismissNotificationAtom,
  emailAtom,
  profileFormAtom,
  saveProfileAtom,
  sendOtpAtom,
  store,
} from "@/helpers/state";

import { profileFormSchema } from "@/helpers/validation";
import { useSetAtom } from "jotai";
import type { AccountResponse } from "@/helpers/types";
import { getDomainFromEmail } from "@/helpers/email";

export const Route = createFileRoute("/profile")({
  component: Profile,
  head: () => ({ meta: [{ title: `Profile | ${siteTitle}` }] }),
  beforeLoad: () => {
    store.set(dismissNotificationAtom, ["profile-saved", "profile-error"]);
  },
  loader: async () => {
    const account = await store.get(accountAtom);
    if ("error" in account) {
      redirect({ to: "/login", throw: true });
    } else {
      store.set(emailAtom, account.email);
    }
    return account;
  },
});


function Profile() {
  const account = Route.useLoaderData() as AccountResponse;
  const setEmail = useSetAtom(emailAtom);
  const setProfileForm = useSetAtom(profileFormAtom);
  const saveProfile = useSetAtom(saveProfileAtom);
  const sendOtp = useSetAtom(sendOtpAtom);
  const navigate = useNavigate();

  const defaultValues = {
    ...account,
    role: account.role ?? [],
    degrees: account.degrees ?? [],
    timeZone: account.timeZone ?? "",
    username: account.username ?? "",
    password: "",
    confirmPassword: "",
  };

  const form = useAppForm({
    defaultValues,
    listeners: {
      onBlur: ({ fieldApi, formApi }) => {
        if (fieldApi.name === "email") {
          if (
            getDomainFromEmail(account.email) !==
            getDomainFromEmail(fieldApi.state.value)
          )
            formApi.setFieldValue("organizationId", 0);
          setEmail(fieldApi.state.value);
        }
      },
    },
    validators: {
      onSubmit: profileFormSchema,
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
        navigate({ to: "/register/verify" });
      }
    },
  });

  return (
    <>
      <h1>ACCESS Profile</h1>
      <ProfileForm form={form} />
    </>
  );
}
