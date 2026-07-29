import { createFileRoute } from "@tanstack/react-router";
import { siteTitle } from "@/config";
import { LoaderCircle } from "lucide-react";
import { useEffect } from "react";
import { oidcAuthorizeAtom, oidcNextAtom, store } from "@/helpers/state";
import { loginSearchSchema } from "@/helpers/validation";

export const Route = createFileRoute("/login")({
  component: Login,
  head: () => ({ meta: [{ title: `Login | ${siteTitle}` }] }),
  validateSearch: (search) => loginSearchSchema.parse(search),
});

function Login() {
  const { next } = Route.useSearch();

  useEffect(() => {
    store.set(oidcNextAtom, next ?? "");
    store.set(oidcAuthorizeAtom, "login");
  }, []);

  return <LoaderCircle className="animate-spin" />;
}
