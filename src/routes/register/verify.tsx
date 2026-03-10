import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { siteTitle } from "@/config";
import { useAppForm } from "@/hooks/form";
import * as z from "zod";
import VerifyEmailForm from "@/components/email-verification-form";
import { useAtom, useSetAtom } from "jotai";
import {
  emailAtom,
  otpAtom,
  sendOtpAtom,
  store,
  verifyOtpAtom,
  pendingEmailAtom,
  domainAtom,
  accountAtom
} from "@/helpers/state";

import {
  pushNotificationAtom,
} from "@/helpers/notification";

import { Link } from "@tanstack/react-router";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { TriangleAlert } from "lucide-react";
import ProgressBar from "@/components/progress-bar";
import RegistrationLayout from "@/components/registration-layout";


export const Route = createFileRoute("/register/verify")({
  component: RegisterVerify,
  head: () => ({ meta: [{ title: `Verify Email Address | ${siteTitle}` }] }),
  loader: () => {
    if (!store.get(sendOtpAtom).sent)
      redirect({ to: "/register", throw: true });
  },
});

const formSchema = z.object({
  otp: z
    .string()
    .length(6, { message: "OTP code must be 6 digits and letters." }), // Only error is must be 6 digits due to only allowing numeric input
});

function RegisterVerify() {
  const [email, setEmail] = useAtom(emailAtom);
  const [otp, setOtp] = useAtom(otpAtom);
  const [verifyStatus, verifyOtp] = useAtom(verifyOtpAtom);
  const pushNotification = useSetAtom(pushNotificationAtom);
  const navigate = useNavigate();
  const [pendingEmail, setPendingEmail] = useAtom(pendingEmailAtom);
  const [domain] = useAtom(domainAtom);

  const [account] = useAtom(accountAtom);
  const effectiveEmail = pendingEmail || email; // if pending email exists use for domain look up
  const emailDomain = effectiveEmail?.split("@")[1]?.toLowerCase() ?? null; // domain from email for domain look up

  function handleVerificationFailure() {
    pushNotification({
      title: "Incorrect Code",
      message:
        "The verification code you entered did not match. Please try again.",
      variant: "error",
    });

    if (pendingEmail) {
      setEmail(account.email); // Rollback to last verified email
      navigate({ to: "/profile" });
      return;
    } else {
      setEmail(""); // Registration mode, clear email and force user to registration page
      navigate({ to: "/register" });
      return;
    }
  }

  function handleExistingAccount(username: string) {
    pushNotification({
      title: "Existing Account",
      message: (
        <>
          You already have an ACCESS account. Your ACCESS ID is{" "}
          <strong>{username}</strong>. You can{" "}
          <Link to="/login">login</Link> or
          <a href="https://identity.access-ci.org/password-reset">
            {" "}
            reset your password
          </a>
          .
        </>
      ),
      variant: "error",
    });
    navigate({ to: "/profile" });
    return;
  }

  function handleIneligibleDomain() {
    // Don't evaluate eligibility/redirect until the user has typed a real domain
    if (!emailDomain) return;

    // When the domain atom is still loading, avoid firing notifications/redirects
    if (domain === undefined) return;

    // Ineligible
    if (domain === null) {
      const id = "ineligible-email-domain";

      pushNotification({
        id,
        variant: "error",
        title: "Ineligible Email Domain",
        message: (
          <>
            The email domain {emailDomain} is not eligible for ACCESS. Please try again
            with your university or work email address.
          </>
        ),
      });
      navigate({ to: "/register", replace: true });
      return;
    }
  }

  function handleUnknownDomain() {
    // Unknown (no matching orgs)
    if (domain?.isEligible === true && (domain.organizations?.length ?? 0) === 0) {
      const id = "unknown-email-domain";

      pushNotification({
        id,
        variant: "error",
        title: "Unknown Email Domain",
        message: (
          <>
            The email domain {emailDomain} is not yet registered with ACCESS. Please open a{" "}
            <a
              href="https://support.access-ci.org/help-ticket"
              target="_blank"
              rel="noreferrer"
              className="underline"
            >
              help ticket
            </a>{" "}
            and ask to have your organization added to the ACCESS database.
          </>
        ),
      });
      navigate({ to: "/register", replace: true });
      return;
    }
  }


  const form = useAppForm({
    defaultValues: {
      otp,
    },
    validators: {
      onSubmit: formSchema,
    },
    onSubmit: async ({ value }) => {
      setOtp(value.otp);
      const status = await verifyOtp(); // Checks if is registration or email change in verifyOTP
      setOtp("");
      // OTP verification failed
      if (!status.verified) {
        handleVerificationFailure();
        return;
      }
      // Existing account check after successful OTP
      if (status.username) {
        const existingUsername = status.username;
        if (pendingEmail) { // if pending email exists, and is already associated with an account...
          setPendingEmail("");
        } else { // if email is already associated with an account...
          setEmail("");
        }
        handleExistingAccount(existingUsername);
        return;
      }

      // Domain validation check
      handleIneligibleDomain();
      handleUnknownDomain();

      // If we have a pending email, we set it, otherwise send to registration/complete to fill in rest of registration form
      if (pendingEmail) {
        setEmail(pendingEmail);
        pushNotification({
          id: "profile-saved",
          title: "Profile Saved",
          message: "Changes to your profile have been saved.",
          variant: "success",
        });
        navigate({ to: "/dashboard" });
        return;
      }
      navigate({ to: "/register/complete" });
    }
  });

  return (
    <>
      <h1>Verify Email Address</h1>
      <p className="intro">
        Enter the 6-digit verification code sent to {pendingEmail ?? email}.
      </p>
      {verifyStatus?.error && (
        <Alert variant="destructive">
          <TriangleAlert />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{verifyStatus.error}</AlertDescription>
        </Alert>
      )}
      <RegistrationLayout
        left={<VerifyEmailForm form={form} />}
        right={<ProgressBar />}
      />
    </>
  );
}
