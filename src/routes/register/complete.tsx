import { createFileRoute } from "@tanstack/react-router";
import * as z from "zod";
import { useAppForm } from "@/hooks/form";
import { siteTitle } from "@/config";
import CompleteRegistrationForm from "@/components/complete-registration-form";

export const Route = createFileRoute("/register/complete")({
  component: RegisterComplete,
  head: () => ({ meta: [{ title: `Register | ${siteTitle}` }] }),
});

const formSchema = z.object({
  first_name: z.string().min(1, { message: "First name is required."}),
  last_name: z.string().min(1, { message: "Last name is required."}),
  email: z.string().email({ message: "Invalid email address." }),
  institution: z.string().min(1, { message: "Institution is required."}),
  academic_status: z.string().min(1, { message: "Academic status is required."}),
  residence_country: z.string().min(1, { message: "Country of residence is required."}),
  citizenship_country: z.string().min(1, { message: "Country of citizenship is required."}),
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
      onSubmit: formSchema,
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
