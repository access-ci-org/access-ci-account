import { createFileRoute, redirect } from "@tanstack/react-router";
import { siteTitle } from "@/config";
import RegistrationLayout from "@/components/registration-layout";
import AcceptAupForm from "@/components/accept-aup-form";
import { useAppForm } from "@/hooks/form";
import * as z from "zod";
import { useNavigate } from "@tanstack/react-router";

import {
  store,
  createAccountAtom,
  pushNotificationAtom,
  hasOtpTokenAtom,
  registrationFormAtom,
} from "@/helpers/state";
import { profileFormSchema } from "@/helpers/validation";

export const Route = createFileRoute("/register/aup")({
  component: AcceptableUsePolicy,
  head: () => ({ meta: [{ title: `Acceptable Use Policy | ${siteTitle}` }] }),
  beforeLoad: () => {
    // Check to make sure we have a valid OTP token.
    if (!store.get(hasOtpTokenAtom)) redirect({ to: "/register", throw: true });

    // Validate registration form data.
    const validationResult = profileFormSchema.safeParse(
      store.get(registrationFormAtom),
    );
    if (!validationResult.success)
      redirect({ to: "/register/complete", throw: true });
  },
});

const formSchema = z.object({
  accepted: z.literal(true, {
    message: "You must accept the terms to continue.",
  }),
});

function AcceptableUsePolicy() {
  const navigate = useNavigate();

  const form = useAppForm({
    defaultValues: { accepted: false },
    validators: { onSubmit: formSchema },
    onSubmit: async () => {
      const status = await store.set(createAccountAtom);

      if (status?.created) {
        navigate({ to: "/register/success" });
      } else {
        store.set(pushNotificationAtom, {
          title: "Account Creation Failed",
          message: status.error,
          variant: "error",
        });
      }
    },
  });

  return (
    <>
      <h1>Acceptable Use Policy</h1>
      <RegistrationLayout>
        <AcceptAupForm form={form} />
      </RegistrationLayout>
    </>
  );
}

export default AcceptableUsePolicy;
