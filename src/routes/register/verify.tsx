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
  updateAccountAtom
} from "@/helpers/state";

import { Link } from "@tanstack/react-router";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { TriangleAlert } from "lucide-react";
import ProgressBar from "@/components/progress-bar";
import RegistrationLayout from "@/components/registration-layout";
import { pushNotificationAtom } from "@/helpers/notification";


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
  const updateAccount = useSetAtom(updateAccountAtom);

  const form = useAppForm({
    defaultValues: {
      otp,
    },
    validators: {
      onSubmit: formSchema,
    },
    onSubmit: async ({ value }) => {
      setOtp(value.otp);
      const status = await verifyOtp();
      setOtp("");
      if (!status.verified) {
        pushNotification({
          title: "Incorrect Code",
          message:
            "The verification code you entered did not match. Please try again.",
          variant: "error",
        });
        setEmail("");
        navigate({ to: "/register" });
      } else if (status.username) {
        setEmail("");
        pushNotification({
          title: "Existing Account",
          message: (
            <>
              You already have an ACCESS account. Your ACCESS ID is{" "}
              <strong>{status.username}</strong>. You can{" "}
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
        navigate({ to: "/" });
      } else {
        if (pendingEmail) {
          await updateAccount({ email: pendingEmail });
          setEmail(pendingEmail);
          setPendingEmail("");
          navigate({ to: "/profile" });
          return;
        } else {
          navigate({ to: "/register/complete" });
        }
      }
    },
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
