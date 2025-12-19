import { createFileRoute } from "@tanstack/react-router";
import * as z from "zod";
import { useAppForm } from "@/hooks/form";
import { siteTitle } from "@/config";
import PasswordForm from "@/components/password-change-form";

export const Route = createFileRoute("/password")({
  component: Password,
  head: () => ({ meta: [{ title: `Change Password | ${siteTitle}` }] }),
});

const formSchema = z.object({
  currentPassword: z.string().catch(""),
  newPassword: z.string().catch(""),
  repeatedNewPassword: z.string().catch(""),
});

function Password() {
  const form = useAppForm({
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      repeatedNewPassword: "",
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
      <h1>ACCESS Change Password Form </h1>
      <PasswordForm form={form} />
    </>
  );
}
