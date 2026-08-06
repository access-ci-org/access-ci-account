import { useRef } from "react";
import {
  createFileRoute,
  redirect,
  useBlocker,
  useNavigate,
} from "@tanstack/react-router";
import { useAppForm } from "@/hooks/form";
import { useUnsavedProfileChanges } from "@/hooks/use-unsaved-profile-changes";
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
  const { account, initial, domain } = Route.useLoaderData();
  const setProfileForm = useSetAtom(profileFormAtom);
  const saveProfile = useSetAtom(saveProfileAtom);
  const navigate = useNavigate();
  const leavingAfterSaveRef = useRef(false);

  const form = useAppForm({
    defaultValues: initial,
    validators: {
      onSubmit: profileFormSchemaWithRecoveries.and(usernameSchema),
    },
    onSubmit: async ({ value }) => {
      setProfileForm(value);

      const { saved } = await saveProfile();
      if (saved) {
        // Leaving on purpose after a successful save — don't let the
        // unsaved-changes blocker below intercept this navigate() (the form
        // itself still holds the just-submitted, now-stale-vs-account
        // values at this point, so pageIsDirty is still true).
        leavingAfterSaveRef.current = true;
        navigate({ to: "/" });
      } else {
        window.scrollTo({ top: 0 });
      }
    },
  });

  const { pageIsDirty } = useUnsavedProfileChanges(form, account);

  useBlocker({
    shouldBlockFn: ({ next }) => {
      if (leavingAfterSaveRef.current) return false;
      if (!pageIsDirty) return false;
      // Don't block the "Verify and Add" -> OTP hop, even if an earlier
      // unsaved recovery email is already staged in this session.
      if (next.routeId === "/$flow/verify") return false;
      return !window.confirm(
        "You have unsaved changes. If you leave this page now, they will be lost. Continue?",
      );
    },
    enableBeforeUnload: () => pageIsDirty,
  });

  return (
    <>
      <h1>ACCESS Profile</h1>
      <FormProfile form={form} domain={domain} account={account} />
    </>
  );
}
