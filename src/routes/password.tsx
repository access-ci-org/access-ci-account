import { createFileRoute } from "@tanstack/react-router";
import * as z from "zod";
import { useAppForm } from "@/hooks/form";
import { siteTitle } from "@/config";
import PasswordForm from "@/components/password-change-form";
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

const registrationSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: strongPasswordSchema,
  repeatedNewPassword: z.string().min(1, "Please re-enter your new password"),
  // Check if currentPassword is different from newPassword
}).refine((data) => data.currentPassword !== data.newPassword, {
  message: "New password must be different from current password",
  path: ["newPassword"], // Shows error on the newPassword field
}) .refine((data) => data.newPassword === data.repeatedNewPassword, {
  message: "Passwords don't match",
  path: ["repeatedNewPassword"], // Shows error on the repeatedNewPassword field
});
// TODO Check if currentPassword is the same as database password, this may need to be done on the server side, but for now there are checks on the client side only.


function Password() {
  const form = useAppForm({
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      repeatedNewPassword: "",
    },
    validators: {
      onSubmit: registrationSchema,
    },
    onSubmit: async ({ value }) => {
      console.log(value);
    },
  });

  return (
    <>
      <h1> Change ACCESS Password  </h1>
      <PasswordForm form={form} />
    </>
  );
}
