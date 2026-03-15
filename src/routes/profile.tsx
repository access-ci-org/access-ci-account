import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { useAppForm } from "@/hooks/form";
import { siteTitle } from "@/config";
import ProfileForm from "@/components/profile-form";
import { accountAtom, updateAccountAtom, store, pendingEmailAtom, otpTokenAtom, pendingProfileAtom, domainAtom } from "@/helpers/state";
import {
  dismissNotificationAtom,
  pushNotificationAtom,
} from "@/helpers/notification";

import { profileFormSchema } from "@/helpers/validation";
import { useSetAtom, useAtomValue, useAtom } from "jotai";
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
  const accountValue = useAtomValue(accountAtom);
  const refreshAccount = useSetAtom(accountAtom);
  const updateAccount = useSetAtom(updateAccountAtom);
  const pushNotification = useSetAtom(pushNotificationAtom);
  const navigate = useNavigate();
  const domainValue = useAtomValue(domainAtom);

  // Updating email address
  const pendingEmailValue = useAtomValue(pendingEmailAtom);
  const setPendingEmail = useSetAtom(pendingEmailAtom);
  const emailOtpToken = useAtomValue(otpTokenAtom);
  const [, setPendingProfile] = useAtom(pendingProfileAtom);

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
      const currentEmail = (accountValue.email ?? "").trim().toLowerCase();
      const newEmail = (value.email ?? "").trim().toLowerCase();
      const pendingEmail = (pendingEmailValue ?? "").trim().toLowerCase();

      const currentDomain = currentEmail.split("@")[1] ?? "";
      const newDomain = newEmail.split("@")[1] ?? "";
      const domainChanged = currentDomain !== newDomain;

      const isVerifiedPendingEmail = Boolean(
        pendingEmail && emailOtpToken && newEmail === pendingEmail,
      );

      const emailChanged = Boolean(newEmail && newEmail !== currentEmail);

      // If user entered a new email that has not been verified yet,
      // stop here, store pending data, send OTP, and go to verify page.
      if (emailChanged && !isVerifiedPendingEmail) {
        if (domainChanged) {
          if (!value.institution) {
            pushNotification({
              id: "organization-required",
              title: "Institution Required",
              message:
                "Because you changed your email domain, please select an institution that matches your new email.",
              variant: "error",
            });
            return;
          }

          const matchingOrganizations = domainValue?.organizations ?? [];
          const matchesInstitution = matchingOrganizations.some(
            (org) => org.organizationId === value.institution,
          );

          if (!matchesInstitution) {
            pushNotification({
              id: "institution-domain-mismatch",
              title: "Institution Does Not Match Email",
              message:
                "Please select an institution that matches your new email domain before continuing.",
              variant: "error",
            });
            return;
          }
        }

        setPendingEmail(newEmail);
        setPendingProfile({
          first_name: value.firstName,
          last_name: value.lastName,
          organization_id: value.institution,
          academic_status_id: value.academicStatus,
          residence_country_id: value.residenceCountry,
          citizenship_country_ids: value.citizenshipCountryIds,
          time_zone: value.timeZone,
          degree: value.degree,
          role: value.role,
          degree_field: value.degreeField,
        });

        const status = await sendOtp();
        if (status.sent) {
          navigate({ to: "/register/verify" });
          return;
        }
        pushNotification({
          id: "otp-send-failed",
          title: "Unable to Send Verification Code",
          message: "We could not send a verification code. Please try again.",
          variant: "error",
        });
        return;
      }

      // Otherwise, this is either:
      // no email change, or  email change that has already been verified
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
          message: "An error occurred while saving your profile. Please try again later.",
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
