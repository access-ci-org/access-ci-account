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
  email: z.string().email({ message: "Invalid email address." }),
});

function RegisterComplete() {
  const form = useAppForm({
    defaultValues: {
      email: "",
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
