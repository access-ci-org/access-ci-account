import { createFileRoute, useNavigate} from "@tanstack/react-router";
import { useAppForm } from "@/hooks/form";
import { siteTitle } from "@/config";
import CompleteRegistrationForm from "@/components/complete-registration-form";
import ProgressBar from "@/components/progress-bar";
import RegistrationLayout from "@/components/registration-layout";
import { profileFormSchema } from "@/helpers/validation";

export const Route = createFileRoute("/register/complete")({
  component: RegisterComplete,
  head: () => ({ meta: [{ title: `Register | ${siteTitle}` }] }),
});


function RegisterComplete() {
  const navigate = useNavigate();
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
      console.log(value);
      navigate({ to: "/register/aup" });
    },
    
  });
  
  return (
    <>
      <h1>ACCESS Registration</h1>
      <RegistrationLayout
      left={<CompleteRegistrationForm form= {form} />}
      right={<ProgressBar />}
      />
    </>
  );
}
