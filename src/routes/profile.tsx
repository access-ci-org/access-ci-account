import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { useAppForm } from "@/hooks/form";
import { siteTitle } from "@/config";
import FormProfile from "@/components/form-profile";
import {
  accountAtom,
  dismissNotificationAtom,
  domainAtom,
  emailAtom,
  profileFormAtom,
  saveProfileAtom,
  store,
} from "@/helpers/state";

import {
  profileFormSchemaWithRecoveries,
  usernameSchema,
} from "@/helpers/validation";
import { useSetAtom } from "jotai";
import type { DomainResponse } from "@/helpers/types";

export const Route = createFileRoute("/profile")({
  component: Profile,
  gcTime: 0, // Prevent the route from showing stale data while the loader resolves.
  head: () => ({ meta: [{ title: `Profile | ${siteTitle}` }] }),
  beforeLoad: () => {
    store.set(dismissNotificationAtom, ["profile-saved", "profile-error"]);
  },
  loader: async () => {
    const account = await store.get(accountAtom);
    let domain: DomainResponse | null = null;
    if ("error" in account) {
      throw redirect({ to: "/login" });
    }
    // Restore in-flight edits when returning from the OTP verification page
    // (e.g. after adding a recovery email); otherwise start fresh from the account.
    const pending = store.get(profileFormAtom);
    const initial =
      pending.username && pending.username === account.username
        ? pending
        : account;
    store.set(emailAtom, initial.email);
    domain = await store.get(domainAtom);
    return { account, initial, domain };
  },
});

function Profile() {
  const { initial, domain } = Route.useLoaderData();
  const setProfileForm = useSetAtom(profileFormAtom);
  const saveProfile = useSetAtom(saveProfileAtom);
  const navigate = useNavigate();

  const form = useAppForm({
    defaultValues: initial,
    validators: {
      onSubmit: profileFormSchemaWithRecoveries.and(usernameSchema),
    },
    onSubmit: async ({ value }) => {
      setProfileForm(value);

      const { saved } = await saveProfile();
      if (saved) {
        navigate({ to: "/" });
      } else {
        window.scrollTo({ top: 0 });
      }
    },
  });

  return (
    <>
      <h1>ACCESS Profile</h1>
      <FormProfile form={form} domain={domain} />
    </>
  );
}
