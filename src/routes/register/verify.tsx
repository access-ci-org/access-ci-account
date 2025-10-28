import { createFileRoute } from "@tanstack/react-router";
import { siteTitle } from "@/config";

export const Route = createFileRoute("/register/verify")({
  component: RegisterVerify,
  head: () => ({ meta: [{ title: `Verify Email Address | ${siteTitle}` }] }),
});

function RegisterVerify() {
  return <div>Verify email address</div>;
}
