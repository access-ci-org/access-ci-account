import { createFileRoute } from "@tanstack/react-router";
import { apiBaseUrl, siteTitle } from "@/config";
import { LoaderCircle } from "lucide-react";
import { useEffect } from "react";

export const Route = createFileRoute("/login")({
  component: Login,
  head: () => ({ meta: [{ title: `Login | ${siteTitle}` }] }),
});

function Login() {
  useEffect(() => {
    // Create and submit a form to post to the API login route.
    const form = document.createElement("form");
    form.method = "POST";
    form.action = `${apiBaseUrl}/auth/login`;
    form.style.display = "none";

    document.body.appendChild(form);
    form.submit();
  }, []);

  return <LoaderCircle className="animate-spin" />;
}
