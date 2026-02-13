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
      firstName: account.firstName as string,
      lastName: account.lastName as string,
      email: account.email as string,
      institution: account.organizationId as number,
      academicStatus: account.academicStatusId as number,
      residenceCountry: account.residenceCountryId as number,
      citizenshipCountryIds: account.citizenshipCountryIds as number[],
      role: [] as string[],
      degree: "",
      degreeField: "",
      timeZone: account.timeZone as string,
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
