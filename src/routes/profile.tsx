import { createFileRoute, redirect } from "@tanstack/react-router";
import { useAppForm } from "@/hooks/form";
import { siteTitle } from "@/config";
import ProfileForm from "@/components/profile-form";
import { accountAtom, store } from "@/helpers/state";

import { profileFormSchema } from "@/helpers/validation";

export const Route = createFileRoute("/profile")({
  component: Profile,
  head: () => ({ meta: [{ title: `Profile | ${siteTitle}` }] }),
  loader: async () => {
    const account = await store.get(accountAtom);
    if (account.error) redirect({ to: "/login", throw: true });
    return account;
  },
});

function Profile() {
  const account = Route.useLoaderData();
  const form = useAppForm({
    defaultValues: {
      email: account.email,
      role: [] as string[],
      degree: "",
      degreeField: "",
      timeZone: account.timeZone,
      firstName: account.firstName,
      lastName: account.lastName,
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
    },
  });

  return (
    <>
      <h1>ACCESS Profile</h1>
      <ProfileForm form={form} />
    </>
  );
}
