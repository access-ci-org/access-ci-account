import { createFileRoute } from '@tanstack/react-router'
import { SSHKeysPage } from '@/components/ssh-key-page'

export const Route = createFileRoute('/ssh-keys')({
  component: SSHKeysRoute,
})

function SSHKeysRoute() {
  return <SSHKeysPage />
}