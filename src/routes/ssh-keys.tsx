import { createFileRoute } from '@tanstack/react-router'
import SSHKeysPage from '@/components/ssh-keys-page'
import { siteTitle } from '@/config'
import { useAppForm } from '@/hooks/form'
import { pushNotificationAtom } from "@/helpers/notification";

import { useSetAtom } from 'jotai'
import { sshKeysDeleteAtom } from '@/helpers/state'

export const Route = createFileRoute('/ssh-keys')({
  component: SSHKeysRoute,
  head: () => ({ meta: [{ title: `SSH Keys | ${siteTitle}` }] }),
})

function SSHKeysRoute() {
  const deleteSshKey = useSetAtom(sshKeysDeleteAtom)
  const setNotification = useSetAtom(pushNotificationAtom)

  const form = useAppForm({
    defaultValues: {
      keyId: 0,
    },
    onSubmit: async ({ value }) => {
      console.log("DELETE BUTTON CLICKED")
      console.log(`Deleting.... ${value.keyId}`)
      console.log("submit fired", value)
      if (!value.keyId){
        setNotification({ variant: "error", message: "SSH key does not exist." })
        return
      } 
      try {
        await deleteSshKey(Number(value.keyId))
        setNotification({ variant: "success", message: "SSH key deleted successfully." })
      } catch (error) {
        setNotification({ variant: "error", message: "Unable to delete SSH key." })
      }
    },
  })

  return <SSHKeysPage />
}
