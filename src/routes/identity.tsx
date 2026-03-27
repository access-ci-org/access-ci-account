import { createFileRoute } from '@tanstack/react-router'
import { IdentityPage } from '@/components/identity-page'
import { siteTitle } from '@/config'

export const Route = createFileRoute('/identity')({
  component: IdentityRoute,
  head: () => ({ meta: [{ title: `Identities | ${siteTitle}` }] }),
})

function IdentityRoute() {
  return <IdentityPage />
}