import { createFileRoute, redirect } from "@tanstack/react-router";
import { siteTitle } from "@/config";
import { useAppForm } from "@/hooks/form";
import * as z from "zod";
import VerifyEmailForm from "@/components/email-verification-form";
import { sendOtpAtom, store } from "@/helpers/state";

const formSchema = z.object({
  otp_code: z.string().length(6, { message: "OTP code must be 6 digits." }), // Only error is must be 6 digits due to only allowing numeric input
});

export const Route = createFileRoute("/register/verify")({
  component: RegisterVerify,
  head: () => ({ meta: [{ title: `Verify Email Address | ${siteTitle}` }] }),
  loader: () => {
    if (!store.get(sendOtpAtom).sent)
      redirect({ to: "/register", throw: true });
  },
});

function RegisterVerify() {
  const form = useAppForm({
    defaultValues: {
      otp_code: "",
    },
    validators: {
      onSubmit: formSchema,
    },
    onSubmit: async ({ value }) => {
      console.log(value);
    },
  });
  return (
    <>
      <div className="min-h-screen flex flex-col items-start bg-white px-4 sm:px-16 pt-10 sm:pt-12">
        <h1 className="text-left text-2xl font-semibold text-gray-800 mt-2">
          Verify Email Address
        </h1>
        <p className="text-left text-sm text-gray-500 mt-1 mb-5 max-w-md">
          Enter the 6-digit verification code sent to your registered email.
        </p>
        <VerifyEmailForm form={form} />
      </div>
    </>
  );
}
