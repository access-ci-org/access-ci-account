import { createFileRoute } from "@tanstack/react-router";
import { siteTitle } from "@/config";
import { LoaderCircle } from "lucide-react";
import { useEffect } from "react";
import { useSetAtom } from "jotai";
import { logoutAtom } from "@/helpers/state";
import { deleteSsoCookie } from "@/helpers/cookie";

export const Route = createFileRoute("/logout")({
  component: Logout,
  head: () => ({ meta: [{ title: `Logout | ${siteTitle}` }] }),
});

function Logout() {
  const logout = useSetAtom(logoutAtom);
  useEffect(() => {
    logout();
    deleteSsoCookie();
    window.location.href = "https://cilogon.org/logout/?skin=access";
  }, []);

  return <LoaderCircle className="animate-spin" />;
}
