import { createFileRoute } from "@tanstack/react-router";
import { siteTitle } from "@/config";
import { LoaderCircle } from "lucide-react";
import { useEffect } from "react";
import { startAuth } from "@/helpers/auth";

export const Route = createFileRoute("/login")({
  component: Login,
  head: () => ({ meta: [{ title: `Login | ${siteTitle}` }] }),
});

function Login() {
  useEffect(() => startAuth("login"), []);

  return <LoaderCircle className="animate-spin" />;
}
