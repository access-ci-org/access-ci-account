import { createFileRoute } from "@tanstack/react-router";
import { siteTitle } from "@/config";
import { useAppForm } from "@/hooks/form";
import { sshKeyFormSchema } from "@/helpers/validation";
import { useNavigate } from "@tanstack/react-router";
import { useSetAtom } from "jotai";
import { pushNotificationAtom, sshKeysAddAtom } from "@/helpers/state";

import FormAddSshKey from "@/components/form-add-ssh-key";

export const Route = createFileRoute("/add-ssh-key")({
  component: AddSshKey,
  head: () => ({ meta: [{ title: `Add SSH Key | ${siteTitle}` }] }),
});

function AddSshKey() {
  const navigate = useNavigate();
  const addSshKey = useSetAtom(sshKeysAddAtom);
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
          id: "add-ssh-key-error",
          variant: "error",
          message: "Please paste an SSH public key.",
        });
        return;
      }

      const result = await addSshKey(trimmed);
      if ("success" in result && result.success) {
        setNotification({
          id: "ssh-key-added",
          persist: true,
          variant: "success",
          message: "SSH key added successfully.",
        });
        navigate({ to: "/ssh-keys" });
      } else {
        const errorMessage =
          "error" in result ? result.error.message : "Failed to add SSH key.";

        setNotification({
          id: "add-ssh-key-error",
          variant: "error",
          message: errorMessage,
        });
      }
    },
  });

  return (
    <>
      <h1>Add SSH Key</h1>
      <FormAddSshKey form={form} />
    </>
  );
}
