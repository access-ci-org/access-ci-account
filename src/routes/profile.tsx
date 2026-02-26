import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { useAppForm } from "@/hooks/form";
import { siteTitle } from "@/config";
import ProfileForm from "@/components/profile-form";
import { accountAtom, updateAccountAtom, store, pendingEmailAtom } from "@/helpers/state";
import {
  dismissNotificationAtom,
  pushNotificationAtom,
} from "@/helpers/notification";

import { profileFormSchema } from "@/helpers/validation";
import { useSetAtom, useAtomValue } from "jotai";
import { sendOtpAtom } from "@/helpers/state";

export const Route = createFileRoute("/profile")({
  component: Profile,
  head: () => ({ meta: [{ title: `Profile | ${siteTitle}` }] }),
  beforeLoad: () => {
    store.set(dismissNotificationAtom, ["profile-saved", "profile-error"]);
  },
  loader: async () => {
    const account = await store.get(accountAtom);
    if (account.error) redirect({ to: "/login", throw: true });
    return account;
  },
});


function Profile() {
  const account = Route.useLoaderData();
  const refreshAccount = useSetAtom(accountAtom);
  const updateAccount = useSetAtom(updateAccountAtom);
  const pushNotification = useSetAtom(pushNotificationAtom);
  const navigate = useNavigate();

  
  // Updating email address
  const pendingEmail = useAtomValue(pendingEmailAtom);
  const setPendingEmail = useSetAtom(pendingEmailAtom);

  const sendOtp = useSetAtom(sendOtpAtom);

  const form = useAppForm({
    defaultValues: {
      firstName: account.firstName as string,
      lastName: account.lastName as string,
      email: (pendingEmail || account.email) as string,
      institution: account.organizationId as number,
      academicStatus: account.academicStatusId as number,
      residenceCountry: account.residenceCountryId as number,
      citizenshipCountryIds: account.citizenshipCountryIds as number[],
      role: [] as string[],
      degree: "",
      degreeField: "",
      timeZone: account.timeZone as string,
    },
    validators: {
      onSubmit: profileFormSchema,
    },
    onSubmit: async ({ value }) => {
      const currentEmail = (account.email ?? "").trim().toLowerCase();
      const newEmail = (value.email ?? "").trim().toLowerCase();

      // Detecting a new email input
      if (newEmail && newEmail !== currentEmail){
        // storing new email temp
        setPendingEmail(newEmail);
        // send OTP
        const status = await sendOtp();
        // if sent go to verify
        if (status.sent) navigate({ to: "/register/verify" });
        return
      }

      const { saved } = await updateAccount({
        firstName: value.firstName,
        lastName: value.lastName,
        email: (pendingEmail || value.email),
        organizationId: value.institution,
        academicStatusId: value.academicStatus,
        residenceCountryId: value.residenceCountry,
        citizenshipCountryIds: value.citizenshipCountryIds,
        timeZone: value.timeZone,
        // TODO: Add degree
      });

      if (saved) {
        pushNotification({
          id: "profile-saved",
          title: "Profile Saved",
          message: "Changes to your profile have been saved.",
          variant: "success",
        });
        navigate({ to: "/dashboard" });
        refreshAccount();
      } else {
        pushNotification({
          id: "profile-error",
          title: "Error Saving Profile",
          message: `An error occurred while saving your profile. Please try again later.`,
          variant: "error",
        });
        window.scrollTo({ top: 0 });
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
