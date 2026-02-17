import { createFileRoute } from "@tanstack/react-router"
import { siteTitle } from "@/config"
import RegistrationLayout from "@/components/registration-layout"
import ProgressBar from "@/components/progress-bar"
import AcceptAupForm from "@/components/accept-aup-form"
import { useAppForm } from "@/hooks/form"
import * as z from "zod"
import { useNavigate } from "@tanstack/react-router";

import { store, createAccountAtom } from "@/helpers/state"
import { registrationDataAtom } from "@/helpers/registration-data"

export const Route = createFileRoute("/register/aup")({
  component: AcceptableUsePolicy,
  head: () => ({ meta: [{ title: `Acceptable Use Policy | ${siteTitle}` }] }),
})

const formSchema = z.object({
  accepted: z.literal(true, { message: "You must accept the terms to continue." }),
})

function AcceptableUsePolicy() {
  const navigate = useNavigate();
  const form = useAppForm({
    defaultValues: { accepted: false },
    validators: { onSubmit: formSchema },
    onSubmit: async ({ value }) => {
      // Just in case, but the form validator should prevent this from happening
      if (!value.accepted) return

      const registrationData = store.get(registrationDataAtom)

      if (!registrationData) {
        console.error("[AUP route] Missing registrationDataAtom; cannot create account.")
        return
      }

      const payload = {
        firstName: registrationData.first_name,
        lastName: registrationData.last_name,
        organizationId: Number(registrationData.institution),
        academicStatusId: Number(registrationData.academic_status),
        residenceCountryId: Number(registrationData.residence_country),
        citizenshipCountryIds: [Number(registrationData.citizenship_country)],
      }

      const status = await store.set(createAccountAtom, payload)

      if (status?.created) {
        store.set(registrationDataAtom, null)
        // navigate to next step here
        navigate({ to: "/register/success" });
      }
    },
  })

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

export default AcceptableUsePolicy
