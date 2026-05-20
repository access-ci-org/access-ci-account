import { createFileRoute } from "@tanstack/react-router";
import { siteTitle } from "@/config";
import { LoaderCircle } from "lucide-react";
import { useEffect } from "react";
import { oidcAuthorizeAtom, store } from "@/helpers/state";

export const Route = createFileRoute("/login")({
  component: Login,
  head: () => ({ meta: [{ title: `Login | ${siteTitle}` }] }),
});

function Login() {
  useEffect(() => {
    store.set(oidcAuthorizeAtom, "login");
  }, []);

  return <LoaderCircle className="animate-spin" />;
}
