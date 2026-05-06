import { createFileRoute } from "@tanstack/react-router";
import { useAtomValue } from "jotai";
import { domainAtom, usernameAtom } from "@/helpers/state";
import { siteTitle } from "@/config";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import RegistrationLayout from "@/components/registration-layout";

export const Route = createFileRoute("/register/success")({
  component: Success,
  head: () => ({ meta: [{ title: `Your ACCESS ID | ${siteTitle}` }] }),
});

function Success() {
  const domain = useAtomValue(domainAtom);
  const idpName =
    domain?.idps && domain.idps.length > 0
      ? domain.idps[0].displayName
      : "ACCESS CI (XSEDE)";
  const username = useAtomValue(usernameAtom);

  return (
    <>
      <h1>Your ACCESS ID</h1>
      <RegistrationLayout>
        <Card>
          <div className="p-6">
            <p>
              Your new ACCESS ID is:{" "}
              <span className="font-bold"> {username}</span>
            </p>
            <p> To log in to ACCESS: </p>
            <ul className="list-disc pl-6">
              <li>
                Select <span className="font-bold"> {idpName} </span> as your
                identity provider.
              </li>
            </ul>
            <Button asChild className="bg-primary mt-4 align-center">
              <Link to="/login">Login</Link>
            </Button>
          </div>
        </Card>
      </RegistrationLayout>
    </>
  );
}
