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

  const form = useAppForm({
    defaultValues: account,
    listeners: {
      onBlur: ({ fieldApi }) => {
        if (fieldApi.name === "email") setEmail(fieldApi.state.value);
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
