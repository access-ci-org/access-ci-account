import { createFileRoute } from '@tanstack/react-router'
//import { SSHKeysPage } from '@/components/ssh-keys-page'
import { siteTitle } from '@/config'

export const Route = createFileRoute('/identity')({
  component: IdentityRoute,
  head: () => ({ meta: [{ title: `identity | ${siteTitle}` }] }),
})

function IdentityRoute() {
  return <h1> Hi </h1>
}
