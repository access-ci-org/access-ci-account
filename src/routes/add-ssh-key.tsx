import { createFileRoute } from "@tanstack/react-router"
import { siteTitle } from '@/config'
import { useAppForm } from "@/hooks/form"
import { sshKeyFormSchema } from "@/helpers/validation"
import AddSshKeyForm from "@/components/add-ssh-keys-form"

import { useNavigate } from "@tanstack/react-router";
import { useSetAtom } from "jotai";
import { sskKeysAddAtom } from "@/helpers/state";
import { pushNotificationAtom } from "@/helpers/notification";


export const Route = createFileRoute("/add-ssh-key")({
  component: AddSshKey,
  head: () => ({ meta: [{ title: `Add SSH Key | ${siteTitle}` }] }),
})

function AddSshKey() {
  const navigate = useNavigate()
  const addSshKey = useSetAtom(sskKeysAddAtom)
  const setNotification = useSetAtom(pushNotificationAtom)
  const form = useAppForm({

    defaultValues: {
      sshKey: "",
    },
    validators: {
      onSubmit: sshKeyFormSchema
    },
    onSubmit: async ({ value }) => {
      const trimmed = value.sshKey.trim()
      if (!trimmed) {
        setNotification({ variant: "error", message: "Please paste a public SSH key." })
        return
      }

      const result = await addSshKey(trimmed)
      if (result.success) {
        setNotification({ variant: "success", message: "SSH key added successfully." })
        navigate({ to: "/ssh-keys" })
        return
      }

      // Stay on page for error and show message
      const backendMsg = result?.error?.message
      const errorMessage =
        typeof backendMsg === "string"
          ? backendMsg
          : backendMsg?.detail || "Failed to add SSH key."
      
      setNotification({ variant: "error", message: errorMessage })

    },
  })

  return (
    <>
      <h1>Add new SSH Key</h1>
      <AddSshKeyForm form={form} />
    </>
  )
}