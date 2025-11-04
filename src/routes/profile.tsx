import { createFileRoute } from "@tanstack/react-router";
import * as z from "zod";
import { useAppForm } from "@/hooks/form";
import { siteTitle } from "@/config";
import ProfileForm from "@/components/profile-form";

export const Route = createFileRoute("/profile")({
  component: Profile,
  head: () => ({ meta: [{ title: `Profile | ${siteTitle}` }] }),
});

const formSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
  role: z.array(z.string()).min(1, { message: "Please select at least one role." }),
  degree: z.string().min(1, { message: "Please select a degree." }),
  degreeField: z.string().min(1, {message: "Please enter your degree field"}),
  timeZone: z.string().min(1, { message: "Please select a time zone." }),
});

function Profile() {
  const form = useAppForm({
    defaultValues: {
      email: "",
      role: [] as string[],
      degree: "",
      degreeField: "",
      timeZone: "",
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
      <h1>ACCESS Profile</h1>
      <ProfileForm form={form} />
    </>
  );
}
