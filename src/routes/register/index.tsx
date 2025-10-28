import { createFileRoute } from "@tanstack/react-router";
import * as z from "zod";
import { useAppForm } from "@/hooks/form";
import { siteTitle } from "@/config";
import StartRegistrationForm from "@/components/start-registration-form";

export const Route = createFileRoute("/register/")({
  component: RegisterStart,
  head: () => ({ meta: [{ title: `Register | ${siteTitle}` }] }),
});

const formSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
});

function RegisterStart() {
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
      <p className="intro">
        Welcome! Create an account to use ACCESS resources and start or join
        projects.
      </p>
      <StartRegistrationForm form={form} />
    </>
  );
}
