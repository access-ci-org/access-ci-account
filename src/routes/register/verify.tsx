import { createFileRoute } from "@tanstack/react-router";
import { siteTitle } from "@/config";
import { useAppForm } from "@/hooks/form";
import * as z from "zod";
import VerifyEmailForm from "@/components/email-verification-form";

const formSchema = z.object({
  otp_code: z
    .string()
    .length(6, { message: "OTP code must be 6 digits." }) // Only error is must be 6 digits due to only allowing numeric input
});

export const Route = createFileRoute("/register/verify")({
  component: RegisterVerify,
  head: () => ({ meta: [{ title: `Verify Email Address | ${siteTitle}` }] }),
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
      <div className="-mt-12 sm:-mt-14 md:-mt-16 pb-10 sm:pb-12 md:pb-14">
        <div className="min-h-[80vh] flex flex-col justify-center items-center bg-white px-4">
          <h1 className="text-center text-2xl font-semibold text-gray-800 mt-2">
            Verify Email Address
          </h1>
          <p className="text-center text-sm text-gray-500 mt-1 mb-5">
            Enter the 6-digit verification code sent to your registered email.
          </p>
          <VerifyEmailForm form={form} />
        </div>
      </div>
    </>
  )
}
