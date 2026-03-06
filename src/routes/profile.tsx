import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { useAppForm } from "@/hooks/form";
import { siteTitle } from "@/config";
import ProfileForm from "@/components/profile-form";
import { accountAtom, updateAccountAtom, store, pendingEmailAtom, otpTokenAtom } from "@/helpers/state";
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
  const accountValue = useAtomValue(accountAtom);
  const refreshAccount = useSetAtom(accountAtom);
  const updateAccount = useSetAtom(updateAccountAtom);
  const pushNotification = useSetAtom(pushNotificationAtom);
  const navigate = useNavigate();

  
  // Updating email address
  const pendingEmailValue = useAtomValue(pendingEmailAtom);
  const setPendingEmail = useSetAtom(pendingEmailAtom);
  const emailOtpToken = useAtomValue(otpTokenAtom);

  const sendOtp = useSetAtom(sendOtpAtom);

  const form = useAppForm({
    defaultValues: {
      firstName: accountValue.firstName as string,
      lastName: accountValue.lastName as string,
      email: (pendingEmailValue || accountValue.email) as string,
      institution: accountValue.organizationId as number,
      academicStatus: accountValue.academicStatusId as number,
      residenceCountry: accountValue.residenceCountryId as number,
      citizenshipCountryIds: accountValue.citizenshipCountryIds as number[],
      role: [] as string[],
      degree: "",
      degreeField: "",
      timeZone: accountValue.timeZone as string,
    },
    validators: {
      onSubmit: profileFormSchema,
    },
    onSubmit: async ({ value }) => {
      const currentEmail = (accountValue.email ?? "").trim().toLowerCase(); // Email from account 
      const newEmail = (value.email ?? "").trim().toLowerCase(); // Email from form input 
      const pendingEmail = (pendingEmailValue ?? "").trim().toLowerCase(); // pending email from state
      console.log("currentEmail", currentEmail);
      console.log("newEmail", newEmail);
      console.log("pendingEmail", pendingEmail);
      console.log("emailOtpToken", emailOtpToken);

      let isVerifiedPendingEmail = false;
      if (pendingEmail && emailOtpToken && newEmail === pendingEmail) {
        isVerifiedPendingEmail = true;
      } // if there is a pending email, an otp token, and new email matches pending email, then the pending email is verified and can be saved.

      console.log("isVerifiedPendingEmail", isVerifiedPendingEmail);
      
      let emailChanged = false;
      if (newEmail && newEmail !== currentEmail) {
        emailChanged = true;
      } // if there is a new email and its different from the current email, then it needs verfication before saving. 

      console.log("isEmailChanged", emailChanged);

      // Detecting a new unverified email input
      if (emailChanged && !isVerifiedPendingEmail) {
        setPendingEmail(newEmail);
        const status = await sendOtp();
        if (status.sent) {
          navigate({ to: "/register/verify" });
          return;
        }
      }
      
      // TODO: Figure out a way to save other fields if they are changed along with the emai change. 
      const { saved } = await updateAccount({
        firstName: value.firstName,
        lastName: value.lastName,
        email: isVerifiedPendingEmail ? pendingEmail : value.email,
        emailOtpToken: isVerifiedPendingEmail ? emailOtpToken : undefined,
        organizationId: value.institution,
        academicStatusId: value.academicStatus,
        residenceCountryId: value.residenceCountry,
        citizenshipCountryIds: value.citizenshipCountryIds,
        timeZone: value.timeZone,
        // TODO: Add degree
      });

      console.log("isVerifiedPendingEmail", isVerifiedPendingEmail);

      console.log("saved", saved);

      if (saved) {
        if (isVerifiedPendingEmail) {
          setPendingEmail("");
        }
        pushNotification({
          id: "profile-saved",
          title: "Profile Saved",
          message: "Changes to your profile have been saved.",
          variant: "success",
        });
        await refreshAccount();
        navigate({ to: "/dashboard" });
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
