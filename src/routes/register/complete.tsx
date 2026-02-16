import { createFileRoute, useNavigate} from "@tanstack/react-router";
import { useAppForm } from "@/hooks/form";
import { siteTitle } from "@/config";
import CompleteRegistrationForm from "@/components/complete-registration-form";
import ProgressBar from "@/components/progress-bar";
import RegistrationLayout from "@/components/registration-layout";
import { profileFormSchema } from "@/helpers/validation";

import { useSetAtom } from "jotai";
import { registrationDataAtom } from "@/helpers/registration-data";

export const Route = createFileRoute("/register/complete")({
  component: RegisterComplete,
  head: () => ({ meta: [{ title: `Register | ${siteTitle}` }] }),
});


function RegisterComplete() {
  const navigate = useNavigate();
  const setRegistrationData = useSetAtom(registrationDataAtom);

  const form = useAppForm({
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      institution: "",
      academicStatus: "",
      residenceCountry: "",
      citizenshipCountry: "",
    },
    validators: {
      onSubmit: profileFormSchema,
    },
    onSubmit: async ({ value }) => {
      const payload = {
        first_name: value.firstName,
        last_name: value.lastName,
        email: value.email,
        institution: value.institution,
        academic_status: value.academicStatus,
        residence_country: value.residenceCountry,
        citizenship_country: value.citizenshipCountry,
      }
      setRegistrationData(payload)
      await Promise.resolve() // Ensure state is set before navigating
      navigate({ to: "/register/aup" })
    },
    
  });
  
  return (
    <>
      <h1>ACCESS Required Registration Information</h1>
      <RegistrationLayout
      left={<CompleteRegistrationForm form= {form} />}
      right={<ProgressBar />}
      />
    </>
  );
}
