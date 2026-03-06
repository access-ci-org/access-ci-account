import { createFileRoute } from "@tanstack/react-router";
import { siteTitle } from "@/config";

import { useAtomValue } from "jotai";
import { isLoggedInAtom } from "@/helpers/state";
import Dashboard from "@/components/dashboard";
import Welcome from "@/components/welcome";

export const Route = createFileRoute("/")({
  component: Home,
  head: () => ({ meta: [{ title: siteTitle }] }),
});

function Home() {
  const isLoggedIn = useAtomValue(isLoggedInAtom);

  return isLoggedIn ? <Dashboard /> : <Welcome />;
}
