import { createFileRoute, useNavigate } from "@tanstack/react-router";
import * as z from "zod";
import { useAppForm } from "@/hooks/form";
import { siteTitle } from "@/config";
import StartRegistrationForm from "@/components/start-registration-form";
import { useAtom } from "jotai";
import { emailAtom, sendOtpAtom } from "@/helpers/state";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { TriangleAlert } from "lucide-react";

import ProgressBar from "@/components/progress-bar";

import RegistrationLayout from "@/components/registration-layout";

export const Route = createFileRoute("/register/")({
  component: RegisterStart,
  head: () => ({ meta: [{ title: `Register | ${siteTitle}` }] }),
});

const formSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
});

function RegisterStart() {
  const [email, setEmail] = useAtom(emailAtom);
  const [otpStatus, sendOtp] = useAtom(sendOtpAtom);
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
      if (status.sent) navigate({ to: "/register/verify" });
    },
  });

  return (
    <>
      <h1>ACCESS Registration</h1>
      <p className="intro">
        Welcome! Create an account to use ACCESS resources and start or join
        projects.
      </p>
      {otpStatus?.error && (
        <Alert variant="destructive">
          <TriangleAlert />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{otpStatus.error}</AlertDescription>
        </Alert>
      )}
      <RegistrationLayout
      left={<StartRegistrationForm form={form} />}
      right={<ProgressBar />}
      />
    </>
  );
}
