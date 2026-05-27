import * as z from "zod";
import { useSetAtom } from "jotai";
import { useNavigate } from "@tanstack/react-router";

import { useAppForm } from "@/hooks/form";
import { emailAtom, pushNotificationAtom, sendOtpAtom } from "@/helpers/state";

import FormEmailVerfication from "./form-email-verfication";

const formSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
});

export default function PasswordResetFlow() {
  const setEmail = useSetAtom(emailAtom);
  const sendOtp = useSetAtom(sendOtpAtom);
  const pushNotification = useSetAtom(pushNotificationAtom);
  const navigate = useNavigate();

  const form = useAppForm({
    defaultValues: {
      email: "",
    },
    validators: {
      onSubmit: formSchema,
    },
    onSubmit: async ({ value }) => {
      setEmail(value.email);

      const result = await sendOtp();

      if (result.sent) {
        pushNotification({
          title: "Verification Code Sent",
          message: `A verification code was sent to ${value.email}.`,
          variant: "success",
        });

        navigate({
          to: "/$flow/verify",
          params: { flow: "password" },
        });
      }
    },
  });

  return (
    <FormEmailVerfication
      form={form}
      title="Reset your Password"
      description="Enter your email address and we will send you a verification code."
      emailPlaceholder="Email address"
      submitLabel="Send Verification Code"
    />
  );
}
