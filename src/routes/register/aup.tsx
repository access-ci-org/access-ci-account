import { createFileRoute } from "@tanstack/react-router";
import { siteTitle } from "@/config";
import RegistrationLayout from "@/components/registration-layout";
import ProgressBar from "@/components/progress-bar";
import AcceptAupForm from "@/components/accept-aup-form";
import { useAppForm } from "@/hooks/form";
import * as z from "zod";
import { useNavigate } from "@tanstack/react-router";

import {
  store,
  createAccountAtom,
  pushNotificationAtom,
} from "@/helpers/state";

export const Route = createFileRoute("/register/aup")({
  component: AcceptableUsePolicy,
  head: () => ({ meta: [{ title: `Acceptable Use Policy | ${siteTitle}` }] }),
  beforeLoad: () => {
    // TODO: Validate registration form data.
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
      <RegistrationLayout
        left={<AcceptAupForm form={form} />}
        right={<ProgressBar />}
      />
    </>
  );
}

export default AcceptableUsePolicy;
