import { createFileRoute, useNavigate } from "@tanstack/react-router";
import * as z from "zod";
import { useAppForm } from "@/hooks/form";
import { registrationDisabled, siteTitle } from "@/config";
import { useAtom, useSetAtom } from "jotai";
import {
  bypassIdpAtom,
  emailAtom,
  linkTokensAtom,
  maintenanceTitle,
  otpTokensAtom,
  sendOtpAtom,
  store,
} from "@/helpers/state";
import { registerSearchSchema } from "@/helpers/validation";
import { Wrench } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import FormSendOtp from "@/components/form-send-otp";
import RegistrationLayout from "@/components/registration-layout";

export const Route = createFileRoute("/register/")({
  component: RegisterStart,
  head: () => ({ meta: [{ title: `Register | ${siteTitle}` }] }),
  validateSearch: (search) => registerSearchSchema.parse(search),
  beforeLoad: ({ search }) => {
    // Reset everything
    store.set(emailAtom, "");
    store.set(linkTokensAtom, { accessToken: "", refreshToken: "" });
    store.set(otpTokensAtom, { accessToken: "", refreshToken: "" });
    store.set(bypassIdpAtom, search.idp?.trim().toLowerCase() === "access");
  },
});

const formSchema = z.object({
  email: z.string().trim().pipe(z.email({ message: "Invalid email address." })),
});

function RegisterStart() {
  const [email, setEmail] = useAtom(emailAtom);
  const sendOtp = useSetAtom(sendOtpAtom);
  const navigate = useNavigate();

  const form = useAppForm({
    defaultValues: {
      email,
    },
    validators: {
      onSubmit: formSchema,
    },
    onSubmit: async ({ value }) => {
      setEmail(value.email.trim());
      const status = await sendOtp();
      if (status.sent) {
        navigate({
          to: "/$flow/verify",
          params: { flow: "register" },
        });
      }
    },
  });

  return (
    <>
      <h1>ACCESS Registration</h1>
      <p className="intro">
        Welcome! Create an account to use ACCESS resources and start or join
        projects.
      </p>
      <RegistrationLayout>
        {registrationDisabled ? (
          <Alert variant="warning" role="alert">
            <Wrench />
            <AlertTitle>{maintenanceTitle}</AlertTitle>
            <AlertDescription>
              ACCESS registration is temporarily unavailable due to system
              maintenance. Please try again later.
            </AlertDescription>
          </Alert>
        ) : (
          <FormSendOtp form={form} />
        )}
      </RegistrationLayout>
    </>
  );
}
