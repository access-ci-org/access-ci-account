import { createFileRoute } from "@tanstack/react-router";
import { siteTitle } from "@/config";
import { useAppForm } from "@/hooks/form";
import * as z from "zod";
import VerifyEmailForm from "@/components/email-verification-form";

const formSchema = z.object({
  otp_code: z
    .string()
    .length(6, { message: "OTP code must be 6 digits." })
    .regex(/^\d+$/, { message: "OTP code must contain only digits." }),
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
      <div className="min-h-[80vh] flex flex-col justify-center items-center bg-white px-4">
        <h1 className="text-center text-2xl font-semibold text-gray-800">
          Verify Email Address
        </h1>
        <p className="text-center text-sm text-gray-500 mt-2 mb-6">
          Enter the 6-digit verification code sent to your registered email.
        </p>
        <VerifyEmailForm form={form} />
      </div>
    </>
  )
}
