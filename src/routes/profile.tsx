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
  role: z.array(z.string()).catch([]),
  degree: z.string().catch(""),
  degreeField: z.string().catch(""),
  timeZone: z.string().catch(""),
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
