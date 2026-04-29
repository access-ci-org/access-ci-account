import { createFileRoute } from "@tanstack/react-router";
import * as z from "zod";
import { useAtomValue, useSetAtom } from "jotai";
import { siteTitle } from "@/config";
import { useAppForm } from "@/hooks/form";
import PasswordChangeForm from "@/components/password-change-form";
import PasswordResetFlow from "./password-reset-flow";
import PasswordResetForm from "@/components/password-reset-form";
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

function Password() {
  const isLoggedIn = useAtomValue(isLoggedInAtom);
  const hasOtpToken = useAtomValue(hasOtpTokenAtom);
  const updatePassword = useSetAtom(updatePasswordAtom);

  const passwordSchema = isLoggedIn
    ? z
        .object({
          currentPassword: z.string().min(1, "Current password is required"),
          newPassword: strongPasswordSchema,
          repeatedNewPassword: z
            .string()
            .min(1, "Please re-enter your new password"),
        })
        .refine((data) => data.currentPassword !== data.newPassword, {
          message: "New password must be different from current password",
          path: ["newPassword"],
        })
        .refine((data) => data.newPassword === data.repeatedNewPassword, {
          message: "Passwords don't match",
          path: ["repeatedNewPassword"],
        })
    : z
        .object({
          currentPassword: z.string(),
          newPassword: strongPasswordSchema,
          repeatedNewPassword: z
            .string()
            .min(1, "Please re-enter your new password"),
        })
        .refine((data) => data.newPassword === data.repeatedNewPassword, {
          message: "Passwords don't match",
          path: ["repeatedNewPassword"],
        });

  const form = useAppForm({
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      repeatedNewPassword: "",
    },
    validators: {
      onSubmit: passwordSchema,
    },
    onSubmit: async ({ value }) => {
      const payload = isLoggedIn
        ? {
            current_password: value.currentPassword,
            new_password: value.newPassword,
          }
        : {
            new_password: value.newPassword,
          };

      await updatePassword(payload);
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
      {isLoggedIn ? (
        <PasswordChangeForm form={form} />
      ) : (
        <PasswordResetForm form={form} />
      )}
    </>
  );
}

export default Password;