import { createFileRoute } from "@tanstack/react-router";
import * as z from "zod";
import { useAtomValue, useSetAtom } from "jotai";
import { siteTitle } from "@/config";
import { useAppForm } from "@/hooks/form";
import PasswordChangeForm from "@/components/password-change-form";
import PasswordResetFlow from "@/components/password-reset-flow";
import {
  hasOtpTokenAtom,
  isLoggedInAtom,
  updatePasswordAtom,
} from "@/helpers/state";
import { validatePassword } from "@/helpers/password";

export const Route = createFileRoute("/password")({
  component: Password,
  head: () => ({ meta: [{ title: `Change Password | ${siteTitle}` }] }),
});

const strongPasswordSchema = z.string().superRefine((password, ctx) => {
  const errors = validatePassword(password);
  for (const message of errors) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message });
  }
});

const passwordSchema = z
  .object({
    password: strongPasswordSchema,
    confirmPassword: z.string().min(1, "Please re-enter your new password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
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
      await updatePassword({
        new_password: value.password,
      });
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
      <PasswordChangeForm form={form} />
    </>
  );
}

export default Password;