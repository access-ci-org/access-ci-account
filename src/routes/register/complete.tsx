import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { useAppForm } from "@/hooks/form";
import { siteTitle } from "@/config";
import RegistrationLayout from "@/components/registration-layout";
import {
  noPasswordSchema,
  passwordSchema,
  profileFormSchema,
} from "@/helpers/validation";

import { useAtom, useSetAtom } from "jotai";
import {
  domainAtom,
  hasOtpTokenAtom,
  linkTokensAtom,
  registrationFormAtom,
  registrationPasswordAtom,
  store,
} from "@/helpers/state";
import { useAtomValue } from "jotai";
import { emailAtom } from "@/helpers/state";
import { passwordDefaultValues } from "@/helpers/defaults";

import FormCompleteRegistration from "@/components/form-complete-registration";
import RedirectToIdp from "@/components/redirect-to-idp";

export const Route = createFileRoute("/register/complete")({
  component: RegisterComplete,
  head: () => ({
    meta: [{ title: `Required Registration Information | ${siteTitle}` }],
  }),
  beforeLoad: async () => {
    // Check to make sure we have a valid OTP token.
    if (!store.get(hasOtpTokenAtom)) redirect({ to: "/register", throw: true });
  },
});

function RegisterComplete() {
  const navigate = useNavigate();
  const [registrationForm, setRegistrationForm] = useAtom(registrationFormAtom);
  const setRegistrationPassword = useSetAtom(registrationPasswordAtom);
  const email = useAtomValue(emailAtom);
  const domain = useAtomValue(domainAtom);
  const linkTokens = useAtomValue(linkTokensAtom);
  const showPasswordFields = domain ? domain.idps.length === 0 : false;
  const needsIdpSignIn = !!(
    domain &&
    domain.idps.length &&
    !linkTokens.accessToken
  );

  const form = useAppForm({
    defaultValues: {
      ...registrationForm,
      email,
      ...passwordDefaultValues,
    },
    validators: {
      onSubmit: profileFormSchema.and(
        showPasswordFields ? passwordSchema : noPasswordSchema,
      ),
    },
    onSubmit: async ({ value }) => {
      const { password, confirmPassword, ...registrationValues } = value;
      setRegistrationForm(registrationValues);
      setRegistrationPassword(password);
      navigate({ to: "/register/aup" });
    },
  });

  if (needsIdpSignIn) {
    return (
      <RegistrationLayout>
        <h1>Sign In Required</h1>
        <RedirectToIdp
          idpName={domain.idps[0].displayName}
          idpHint={domain.idps.map((idp) => idp.entityId).join(",")}
        />
      </RegistrationLayout>
    );
  }

  return (
    <>
      <h1>Required Registration Information</h1>
      <RegistrationLayout>
        <FormCompleteRegistration form={form} />
      </RegistrationLayout>
    </>
  );
}
