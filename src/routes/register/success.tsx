import { createFileRoute, redirect } from "@tanstack/react-router";
import { siteTitle } from "@/config";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import RegistrationLayout from "@/components/registration-layout";
import { accountCreateStatusAtom, store } from "@/helpers/state";

export const Route = createFileRoute("/register/success")({
  component: Success,
  head: () => ({ meta: [{ title: `Your ACCESS ID | ${siteTitle}` }] }),
  loader: () => {
    const status = store.get(accountCreateStatusAtom);
    if (!status.created) throw redirect({ to: "/register" });
    return status;
  },
});

function Success() {
  const { username, idp } = Route.useLoaderData();
  return (
    <>
      <h1>Your ACCESS ID</h1>
      <RegistrationLayout>
        <Card>
          <div className="p-6">
            <p>
              Your new ACCESS ID is: <strong>{username}</strong>
            </p>
            <p> To log in to ACCESS: </p>
            <ul className="list-disc pl-6">
              <li>
                Select <strong>{idp}</strong> as your identity provider.
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
