import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { siteTitle } from "@/config";
import { useAppForm } from "@/hooks/form";
import * as z from "zod";
import VerifyEmailForm from "@/components/email-verification-form";
import { useAtom, useAtomValue } from "jotai";
import {
  emailAtom,
  otpAtom,
  sendOtpAtom,
  store,
  verifyOtpAtom,
} from "@/helpers/state";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { TriangleAlert } from "lucide-react";

export const Route = createFileRoute("/register/verify")({
  component: RegisterVerify,
  head: () => ({ meta: [{ title: `Verify Email Address | ${siteTitle}` }] }),
  loader: () => {
    if (!store.get(sendOtpAtom).sent)
      redirect({ to: "/register", throw: true });
  },
});

const formSchema = z.object({
  otp: z.string().length(6, { message: "OTP code must be 6 digits." }), // Only error is must be 6 digits due to only allowing numeric input
});

function RegisterVerify() {
  const email = useAtomValue(emailAtom);
  const [otp, setOtp] = useAtom(otpAtom);
  const [verifyStatus, verifyOtp] = useAtom(verifyOtpAtom);
  const navigate = useNavigate();

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
      if (status.verified) {
        setOtp("");
        navigate({ to: "/register/complete" });
      }
    },
  });

  return (
    <>
      <h1>Verify Email Address</h1>
      <p className="intro">
        Enter the 6-digit verification code sent to {email}.
      </p>
      {verifyStatus?.error && (
        <Alert variant="destructive">
          <TriangleAlert />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{verifyStatus.error}</AlertDescription>
        </Alert>
      )}
      <VerifyEmailForm form={form} />
    </>
  );
}
