import * as React from "react"
import { createFileRoute, useNavigate } from "@tanstack/react-router"
import { useSetAtom } from "jotai"
import {
  Field,
  FieldContent,
  FieldDescription,
} from "@/components/ui/field"
import { Button } from "@/components/ui/button"
import { sskKeysAddAtom } from "@/helpers/state"
import { pushNotificationAtom } from "@/helpers/notification"

export const Route = createFileRoute("/add")({
  component: RouteComponent,
})

function RouteComponent() {
  const navigate = useNavigate()
  const addSshKey = useSetAtom(sskKeysAddAtom)
  const setNotification = useSetAtom(pushNotificationAtom)


  const [publicKey, setPublicKey] = React.useState("")

  return (
    <div>
      <h1>Add Key</h1>

      <form
        onSubmit={async (e) => {
          e.preventDefault()
          const trimmed = publicKey.trim()
          if (!trimmed) return

          const result = await addSshKey(trimmed)
          if (result.success) {
            setNotification({ variant: "success", message: "SSH key added successfully." })
            navigate({ to: "/ssh-keys" })
            return
          } 

          // Stay on page for error and show message
          const errorMessage =
          typeof result.error === "string"
            ? result.error
            : result.error?.detail || result.error?.message || "Failed to add SSH key."
            setNotification({ variant: "error", message: errorMessage })


        }}
      >
        <div className="mb-4">
          <Field>
            <FieldDescription> Please paste your public SSH key below to add it to your ACCESS account. </FieldDescription>
            <FieldContent>
              <textarea value={publicKey}
                onChange={(e) => setPublicKey(e.target.value)}
                placeholder="ssh-ed25519 AAAA... comment"
                rows={6} />
            </FieldContent>
          </Field>
        </div>
        <Button className="mb-4" type="submit">Submit Key</Button>
      </form>
    </div>

  )
}