import { createFileRoute } from "@tanstack/react-router";
import { useAppForm } from "@/hooks/form";
import { siteTitle } from "@/config";
import CompleteRegistrationForm from "@/components/complete-registration-form";
import { profileFormSchema } from "@/helpers/validation";

export const Route = createFileRoute("/register/complete")({
  component: RegisterComplete,
  head: () => ({ meta: [{ title: `Register | ${siteTitle}` }] }),
});


function RegisterComplete() {
  const form = useAppForm({
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      institution: "",
      academic_status: "",
      residence_country: "",
      citizenship_country: "",
    },
    validators: {
      onSubmit: profileFormSchema,
    },
    onSubmit: async ({ value }) => {
      console.log(value);
    },
    
  });
  
  return (
    <>
      <h1>ACCESS Registration</h1>
      <CompleteRegistrationForm form={form} />
    </>
  );
}
