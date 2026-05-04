import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { useAppForm } from "@/hooks/form";
import { siteTitle } from "@/config";
import CompleteRegistrationForm from "@/components/complete-registration-form";
import RegistrationLayout from "@/components/registration-layout";
import { profileFormSchema } from "@/helpers/validation";

import { useAtom } from "jotai";
import {
  domainAtom,
  hasOtpTokenAtom,
  linkTokensAtom,
  registrationFormAtom,
  store,
} from "@/helpers/state";
import { useAtomValue } from "jotai";
import { emailAtom } from "@/helpers/state";
import { startAuth } from "@/helpers/auth";

export const Route = createFileRoute("/register/complete")({
  component: RegisterComplete,
  head: () => ({ meta: [{ title: `Register | ${siteTitle}` }] }),
  beforeLoad: async () => {
    // Check to make sure we have a valid OTP token.
    if (!store.get(hasOtpTokenAtom)) redirect({ to: "/register", throw: true });

    // Check to see whether the email domain has an associated IdP.
    const domain = await store.get(domainAtom);
    const linkTokens = store.get(linkTokensAtom);

    if (domain && domain.idps.length && !linkTokens.accessToken) {
      startAuth("link", domain.idps.map((idp) => idp.entityId).join(","));
      return new Promise(() => {});
    }
  },
});

function RegisterComplete() {
  const navigate = useNavigate();
  const [registrationForm, setRegistrationForm] = useAtom(registrationFormAtom);
  const email = useAtomValue(emailAtom);

  const form = useAppForm({
    defaultValues: { ...registrationForm, email },
    validators: {
      onSubmit: profileFormSchema,
    },
    onSubmit: async ({ value }) => {
      setRegistrationForm(value);
      navigate({ to: "/register/aup" });
    },
  });

  return (
    <>
      <h1>ACCESS Required Registration Information</h1>
      <RegistrationLayout>
        <CompleteRegistrationForm form={form} />
      </RegistrationLayout>
    </>
  );
}
