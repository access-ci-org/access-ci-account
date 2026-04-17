import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { siteTitle } from "@/config";
import { useAppForm } from "@/hooks/form";
import * as z from "zod";
import VerifyEmailForm from "@/components/email-verification-form";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import {
  domainAtom,
  emailAtom,
  isLoggedInAtom,
  otpAtom,
  pushNotificationAtom,
  saveProfileAtom,
  sendOtpAtom,
  store,
  verifyOtpAtom,
} from "@/helpers/state";

import { Link } from "@tanstack/react-router";
import { checkDomain } from "@/helpers/domain-notification";
import RegistrationLayout from "@/components/registration-layout";

const helpTicketLink = (
  <a
    href="https://support.access-ci.org/help-ticket"
    target="_blank"
    rel="noreferrer"
    className="underline"
  >
    open a help ticket
  </a>
);

export const Route = createFileRoute("/register/verify")({
  component: RegisterVerify,
  head: () => ({ meta: [{ title: `Verify Email Address | ${siteTitle}` }] }),
  loader: () => {
    if (!store.get(sendOtpAtom).sent)
      redirect({ to: "/register", throw: true });
  },
});

const formSchema = z.object({
  otp: z.string().length(6, { message: "OTP code must be 6 characters." }),
});

function RegisterVerify() {
  const [email, setEmail] = useAtom(emailAtom);
  const [otp, setOtp] = useAtom(otpAtom);
  const verifyOtp = useSetAtom(verifyOtpAtom);
  const pushNotification = useSetAtom(pushNotificationAtom);
  const saveProfile = useSetAtom(saveProfileAtom);
  const isLoggedIn = useAtomValue(isLoggedInAtom);
  const navigate = useNavigate();

  const prevPath = isLoggedIn ? "/profile" : "/register";
  const nextPath = isLoggedIn ? "/" : "/register/complete";
  const existingAccountPath = isLoggedIn ? "/profile" : "/";

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
        navigate({ to: prevPath });
      } else if (status.username) {
        setEmail("");
        pushNotification({
          title: "Existing Account",
          message: isLoggedIn ? (
            <>
              The email address {email} is already associated with ACCESS ID{" "}
              {status.username}. Please {helpTicketLink} if you have multiple
              ACCESS IDs and need to have them merged.
            </>
          ) : (
            <>
              You already have an ACCESS account. Your ACCESS ID is{" "}
              <strong>{status.username}</strong>. You can{" "}
              <Link to="/login">login</Link> or{" "}
              <a href="https://identity.access-ci.org/password-reset">
                reset your password
              </a>
              .
            </>
          ),
          variant: "error",
        });
        navigate({ to: existingAccountPath });
      } else {
        const domain = await store.get(domainAtom);
        const isValidDomain = checkDomain(domain, pushNotification);

        if (!isValidDomain) {
          navigate({ to: prevPath });
          return;
        }

        if (isLoggedIn) await saveProfile();
        navigate({ to: nextPath });
      }
    },
  });

  return (
    <>
      <h1>Verify Email Address</h1>
      <p className="intro">
        Enter the 6-digit verification code sent to {email}.
      </p>
      <RegistrationLayout>
        <VerifyEmailForm form={form} />
      </RegistrationLayout>
    </>
  );
}
