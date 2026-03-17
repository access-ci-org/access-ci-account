import { createFileRoute } from "@tanstack/react-router";
import { siteTitle } from "@/config";
import { LoaderCircle } from "lucide-react";
import { useEffect } from "react";
import { startLogin } from "@/helpers/auth";

export const Route = createFileRoute("/login")({
  component: Login,
  head: () => ({ meta: [{ title: `Login | ${siteTitle}` }] }),
});

function Login() {
  useEffect(() => {
    // Create and submit a form to post to the API login route.
    startLogin();
  }, []);

  return <LoaderCircle className="animate-spin" />;
}
