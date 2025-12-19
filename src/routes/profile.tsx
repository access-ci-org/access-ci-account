import { createFileRoute } from "@tanstack/react-router";
import { useAppForm } from "@/hooks/form";
import { siteTitle } from "@/config";
import ProfileForm from "@/components/profile-form";

import { profileFormSchema } from "@/helpers/validation";

export const Route = createFileRoute("/profile")({
  component: Profile,
  head: () => ({ meta: [{ title: `Profile | ${siteTitle}` }] }),
});


function Profile() {
  const form = useAppForm({
    defaultValues: {
      email: "",
      role: [] as string[],
      degree: "",
      degreeField: "",
      timeZone: "",
      first_name: "",
      last_name: "",
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
      <h1>ACCESS Profile</h1>
      <ProfileForm form={form} />
    </>
  );
}
