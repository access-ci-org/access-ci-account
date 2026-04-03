import { createFileRoute } from "@tanstack/react-router";
import { siteTitle } from "@/config";
import { useAppForm } from "@/hooks/form";
import { sshKeyFormSchema } from "@/helpers/validation";
import AddSshKeyForm from "@/components/add-ssh-keys-form";

import { useNavigate } from "@tanstack/react-router";
import { useSetAtom } from "jotai";
import { pushNotificationAtom, sskKeysAddAtom } from "@/helpers/state";

export const Route = createFileRoute("/add-ssh-key")({
  component: AddSshKey,
  head: () => ({ meta: [{ title: `Add SSH Key | ${siteTitle}` }] }),
});

function AddSshKey() {
  const navigate = useNavigate();
  const addSshKey = useSetAtom(sskKeysAddAtom);
  const setNotification = useSetAtom(pushNotificationAtom);
  const form = useAppForm({
    defaultValues: {
      sshKey: "",
    },
    validators: {
      onSubmit: sshKeyFormSchema,
    },
    onSubmit: async ({ value }) => {
      const trimmed = value.sshKey.trim();
      if (!trimmed) {
        setNotification({
          variant: "error",
          message: "Please paste an SSH public key.",
        });
        return;
      }

      const result = await addSshKey(trimmed);
      if ("success" in result && result.success) {
        setNotification({
          variant: "success",
          message: "SSH key added successfully.",
        });
        navigate({ to: "/ssh-keys" });
      } else {
        const errorMessage =
          "error" in result ? result.error.message : "Failed to add SSH key.";

        setNotification({ variant: "error", message: errorMessage });
      }
    },
  });

  return (
    <>
      <h1>Add SSH Key</h1>
      <AddSshKeyForm form={form} />
    </>
  );
}
