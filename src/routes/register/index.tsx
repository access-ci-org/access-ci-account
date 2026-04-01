import { createFileRoute, useNavigate } from "@tanstack/react-router";
import * as z from "zod";
import { useAppForm } from "@/hooks/form";
import { siteTitle } from "@/config";
import StartRegistrationForm from "@/components/start-registration-form";
import { useAtom, useSetAtom } from "jotai";
import {
  emailAtom,
  linkTokensAtom,
  otpTokensAtom,
  sendOtpAtom,
  store,
} from "@/helpers/state";

import ProgressBar from "@/components/progress-bar";

import RegistrationLayout from "@/components/registration-layout";
import { pushNotificationAtom } from "@/helpers/notification";

export const Route = createFileRoute("/register/")({
  component: RegisterStart,
  head: () => ({ meta: [{ title: `Register | ${siteTitle}` }] }),
  beforeLoad: () => {
    // Reset everything
    store.set(emailAtom, "");
    store.set(linkTokensAtom, { accessToken: "", refreshToken: "" });
    store.set(otpTokensAtom, { accessToken: "", refreshToken: "" });
  },
});

const formSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
});

function RegisterStart() {
  const [email, setEmail] = useAtom(emailAtom);
  const [otpStatus, sendOtp] = useAtom(sendOtpAtom);
  const pushNotification = useSetAtom(pushNotificationAtom);
  const navigate = useNavigate();

  const form = useAppForm({
    defaultValues: {
      email,
    },
    validators: {
      onSubmit: formSchema,
    },
    onSubmit: async ({ value }) => {
      setEmail(value.email);
      const status = await sendOtp();
      if (otpStatus.error)
        pushNotification({
          title: "Error Sending Verification Code",
          message: otpStatus.error,
          variant: "error",
        });
      else if (status.sent) navigate({ to: "/register/verify" });
    },
  });

  return (
    <>
      <h1>ACCESS Registration</h1>
      <p className="intro">
        Welcome! Create an account to use ACCESS resources and start or join
        projects.
      </p>
      <RegistrationLayout
        left={<StartRegistrationForm form={form} />}
        right={<ProgressBar />}
      />
    </>
  );
}
