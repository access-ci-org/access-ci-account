import { createFileRoute, redirect } from "@tanstack/react-router";
import { useAtomValue, useSetAtom } from "jotai";
import { siteTitle } from "@/config";
import { useAppForm } from "@/hooks/form";
import FormChangePassword from "@/components/form-change-password";
import PasswordResetFlow from "@/components/password-reset-flow";
import {
  hasOtpTokenAtom,
  isImpersonatingAtom,
  isLoggedInAtom,
  pushNotificationAtom,
  store,
  updatePasswordAtom,
} from "@/helpers/state";
import { passwordSchema } from "@/helpers/validation";

export const Route = createFileRoute("/password")({
  component: Password,
  head: () => ({ meta: [{ title: `Change Password | ${siteTitle}` }] }),
  beforeLoad: () => {
    if (store.get(isImpersonatingAtom)) {
      store.set(pushNotificationAtom, {
        id: "impersonating-password",
        variant: "error",
        message: "Changing passwords while impersonating is not allowed.",
      });
      redirect({ to: "/", throw: true });
    }
  },
});

function Password() {
  const isLoggedIn = useAtomValue(isLoggedInAtom);
  const hasOtpToken = useAtomValue(hasOtpTokenAtom);
  const updatePassword = useSetAtom(updatePasswordAtom);

  const form = useAppForm({
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
    validators: {
      onSubmit: passwordSchema,
    },
    onSubmit: async ({ value }) => {
      await updatePassword(value.password);
    },
  });

  if (!isLoggedIn && !hasOtpToken) {
    return (
      <>
        <h1>Change ACCESS Password</h1>
        <PasswordResetFlow />
      </>
    );
  }

  return (
    <>
      <h1>Change ACCESS Password</h1>
      <FormChangePassword form={form} />
    </>
  );
}

export default Password;
