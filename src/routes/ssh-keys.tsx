import { createFileRoute } from '@tanstack/react-router'
import { SSHKeysPage } from '@/components/ssh-keys-page'
import { siteTitle } from '@/config'

export const Route = createFileRoute('/ssh-keys')({
  component: SSHKeysRoute,
  head: () => ({ meta: [{ title: `SSH Keys | ${siteTitle}` }] }),
})

function SSHKeysRoute() {
  return <SSHKeysPage />
}
