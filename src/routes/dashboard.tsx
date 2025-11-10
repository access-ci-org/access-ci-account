import { createFileRoute } from "@tanstack/react-router";
import { siteTitle } from "@/config";

export const Route = createFileRoute("/dashboard")({
  component: Dashboard,
  head: () => ({ meta: [{ title: `My ACCESS Account | ${siteTitle}` }] }),
});

function Dashboard() {
  return <h1>My ACCESS Account</h1>;
}
