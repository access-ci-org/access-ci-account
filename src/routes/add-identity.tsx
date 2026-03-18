import { createFileRoute } from "@tanstack/react-router"
import { siteTitle } from '@/config'
import { useAppForm } from "@/hooks/form"
import { identityFormSchema } from "@/helpers/validation"
import AddIdentityForm from "@/components/add-identity-form"

import { useNavigate } from "@tanstack/react-router";
import { useSetAtom } from "jotai";
import { identityAddAtom } from "@/helpers/state";
import { pushNotificationAtom } from "@/helpers/notification";


export const Route = createFileRoute("/add-identity")({
  component: AddIdentity,
  head: () => ({ meta: [{ title: `Add Identity | ${siteTitle}` }] }),
})

function AddIdentity() {
  const navigate = useNavigate()
  const AddIdentity = useSetAtom(identityAddAtom)
  const setNotification = useSetAtom(pushNotificationAtom)
  const form = useAppForm({

    defaultValues: {
        identity: "",
    },
    validators: {
      onSubmit: identityFormSchema
    },
    onSubmit: async ({ value }) => {
      const trimmed = value.identity.trim()
      if (!trimmed) {
        setNotification({ variant: "error", message: "Please paste a identity here." })
        return
      }

      const result = await AddIdentity(trimmed)
      if (result.success) {
        setNotification({ variant: "success", message: "Identity added successfully." })
        navigate({ to: "/identity" })
        return
      }

      // Stay on page for error and show message
      const backendMsg = result?.error?.message
      const errorMessage =
        typeof backendMsg === "string"
          ? backendMsg
          : backendMsg?.detail || "Failed to add identity."
      
      setNotification({ variant: "error", message: errorMessage })

    },
  })

  return (
    <>
      <h1>Add new Identity</h1>
      <AddIdentityForm form={form} />
    </>
  )
}