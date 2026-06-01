import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import * as z from "zod";
import { useAtomValue, useSetAtom } from "jotai";
import { siteTitle } from "@/config";
import { useAppForm } from "@/hooks/form";
import FormChangePassword from "@/components/form-change-password";
import FormSendOtp from "@/components/form-send-otp"
import {
  emailAtom,
  hasOtpTokenAtom,
  isImpersonatingAtom,
  isLoggedInAtom,
  pushNotificationAtom,
  sendOtpAtom,
  store,
  updatePasswordAtom,
} from "@/helpers/state";
import { passwordSchema } from "@/helpers/validation";

export const Route = createFileRoute("/password")({
  component: Password,
  head: () => ({ meta: [{ title: `Change Password | ${siteTitle}` }] }),
  beforeLoad: () => {
    if (store.get(isImpersonatingAtom)) {
      store.set(pushNotificationAtom, {
        id: "impersonating-password",
        variant: "error",
        message: "Changing passwords while impersonating is not allowed.",
      });
      redirect({ to: "/", throw: true });
    }
  },
});

const sendOtpFormSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
});

function Password() {
  const isLoggedIn = useAtomValue(isLoggedInAtom);
  const hasOtpToken = useAtomValue(hasOtpTokenAtom);
  const updatePassword = useSetAtom(updatePasswordAtom);
  const setEmail = useSetAtom(emailAtom);
  const sendOtp = useSetAtom(sendOtpAtom);
  const navigate = useNavigate();

  const sendOtpForm = useAppForm({
    defaultValues: {
      email: "",
    },
    validators: {
      onSubmit: sendOtpFormSchema,
    },
    onSubmit: async ({ value }) => {
      setEmail(value.email);

      const result = await sendOtp();

      if (result.sent) {
        navigate({
          to: "/$flow/verify",
          params: { flow: "password" },
        });
      }
    },
  });

  const form = useAppForm({
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
    validators: {
      onSubmit: passwordSchema,
    },
    onSubmit: async ({ value }) => {
      await updatePassword(value.password);
    },
  });

  if (!isLoggedIn && !hasOtpToken) {
    return (
      <>
        <h1>Change ACCESS Password</h1>
        <FormSendOtp
          form={sendOtpForm}
          title="Reset your Password"
          description="Enter your email address and we will send you a verification code."
          emailPlaceholder="Email address"
          submitLabel="Send Verification Code"
        />
      </>
    );
  }

  return (
    <>
      <h1>Change ACCESS Password</h1>
      <FormChangePassword form={form} />
    </>
  );
}

export default Password;
