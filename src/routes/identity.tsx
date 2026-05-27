import { createFileRoute, redirect } from "@tanstack/react-router";
import { useAtomValue, useSetAtom } from "jotai";
import {
  identityAtom,
  identityDeleteAtom,
  isImpersonatingAtom,
  oidcAuthorizeAtom,
  pushNotificationAtom,
  store,
  isLoggedInAtom,
} from "@/helpers/state";
import { siteTitle } from "@/config";

import { IoPerson } from "react-icons/io5";
import { FieldSeparator } from "@/components/ui/field";
import ButtonRow from "@/components/button-row";

export const Route = createFileRoute("/identity")({
  component: IdentityRoute,
  head: () => ({ meta: [{ title: `Linked Accounts | ${siteTitle}` }] }),
  loader: async () => {
    const isLoggedIn = await store.get(isLoggedInAtom);
    
    if (!isLoggedIn) {
      redirect({ to: "/login", throw: true });
    }

    const identityDetails = await store.get(identityAtom);

    if ("error" in identityDetails) {
      redirect({ to: "/login", throw: true });
    }

    return identityDetails;
  },
});

function IdentityRoute() {
  // Fetching Identity details via atoms
  const identityDetails = Route.useLoaderData();
  const deleteIdentity = useSetAtom(identityDeleteAtom);
  const setNotification = useSetAtom(pushNotificationAtom);
  const isImpersonating = useAtomValue(isImpersonatingAtom);
  const oidcAuthorize = useSetAtom(oidcAuthorizeAtom);

  return (
    <div className="w-full mt-4">
      <div className="flex w-full items-center justify-between gap-4 mb-2">
        <h1>Linked Accounts</h1>
        <ButtonRow
          disabled={isImpersonating}
          label="Link an Account"
          variant="default"
          onSubmit={async () => {
            await oidcAuthorize("link");
          }}
        />
      </div>

      <FieldSeparator />

      <div className="mt-4">
        <p className="text-xs">
          This is a list of accounts associated with your ACCESS account. Please
          remove any accounts that you do not recognize.
        </p>
        <h2 className="text-xl font-semibold">Linked Accounts</h2>
      </div>

      <div className="w-full mb-8 mt-4">
        {identityDetails.length === 0 && (
          <p className="text-sm text-muted-foreground mt-4">
            No accounts linked yet.
          </p>
        )}

        {identityDetails.map((identity) => (
          <div
            key={identity.identityId}
            className="mb-3 overflow-hidden rounded-sm border border-muted"
          >
            <div className="grid gap-4 p-4 md:grid-cols-[56px_minmax(0,1fr)_120px_180px_auto] md:items-center">
              <div className="flex items-center justify-center self-center">
                <IoPerson className="text-2xl" style={{ color: "#1a5b6e" }} />
              </div>

              <div className="min-w-0 space-y-3">
                {identity.identifiers.map((item) => (
                  <div
                    key={item.type}
                    className="grid gap-2 md:grid-cols-[minmax(0,1fr)_120px] md:items-center"
                  >
                    <p className="break-words text-sm">{item.identifier}</p>
                    <p className="w-fit rounded-sm border bg-muted px-2 py-0.5 text-center text-xs md:justify-self-start">
                      {item.type}
                    </p>
                  </div>
                ))}
              </div>

              <div className="flex items-center text-sm md:justify-center">
                <p>
                  {identity.identifiers.some((item) => item.login)
                    ? "Used for login"
                    : "Not used for login"}
                </p>
              </div>

              <div className="flex items-center md:justify-end">
                {!identity.identifiers.some((item) =>
                  item.identifier.includes("@access-ci.org"),
                ) ? (
                  <ButtonRow
                    disabled={isImpersonating}
                    label="Delete"
                    variant="destructive"
                    onSubmit={async () => {
                      try {
                        await deleteIdentity(identity.identityId);
                        setNotification({
                          variant: "success",
                          message: "Identity deleted successfully.",
                        });
                      } catch (error) {
                        setNotification({
                          variant: "error",
                          message: "Unable to delete identity.",
                        });
                      }
                    }}
                  />
                ) : (
                  <div className="h-8 w-[88px]" />
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
