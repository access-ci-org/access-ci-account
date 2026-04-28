import { createFileRoute } from "@tanstack/react-router";
import { useAppForm } from "@/hooks/form";
import { siteTitle } from "@/config";
import PasswordForm from "@/components/password-change-form";
import { changePasswordSchema } from "@/helpers/validation";

export const Route = createFileRoute("/password")({
  component: Password,
  head: () => ({ meta: [{ title: `Change Password | ${siteTitle}` }] }),
});

function Password() {
  const form = useAppForm({
    defaultValues: {
      currentPassword: "",
      password: "",
      confirmPassword: "",
    },
    validators: {
      onSubmit: changePasswordSchema,
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
