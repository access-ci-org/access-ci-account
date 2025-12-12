import { createFileRoute } from "@tanstack/react-router";
import { siteTitle } from "@/config";
import RegistrationLayout from "@/components/registration-layout";
import ProgressBar from "@/components/progress-bar";
import AcceptAupForm from "@/components/accept-aup-form";
import { useAppForm } from "@/hooks/form";
import * as z from "zod";

export const Route = createFileRoute("/register/aup")({
  component: AcceptableUsePolicy,
  head: () => ({
    meta: [{ title: `Acceptable Use Policy | ${siteTitle}` }],
  }),
});

const formSchema = z.object({
  accepted: z.literal(true, {
    message: "You must accept the terms to continue.",
  }),
});

function AcceptableUsePolicy() {
  const form = useAppForm({
      defaultValues: {
        accepted: false,
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
      <h1>Acceptable Use Policy</h1>
      <RegistrationLayout
        left={<AcceptAupForm form={form}/>}
        right={<ProgressBar />}
      />
    </>
  );
}

export default AcceptableUsePolicy;
