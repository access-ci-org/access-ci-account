import { Fragment } from "react";
import { createFileRoute, redirect, useRouter } from "@tanstack/react-router";
import { useAtomValue, useSetAtom } from "jotai";
import {
  identityAtom,
  identityDeleteAtom,
  isImpersonatingAtom,
  oidcAuthorizeAtom,
  pushNotificationAtom,
  store,
} from "@/helpers/state";
import { siteTitle } from "@/config";

import { IoPerson } from "react-icons/io5";
import { FieldSeparator } from "@/components/ui/field";
import ButtonRow from "@/components/button-row";
import type { IdentityResponse } from "@/helpers/types";

export const Route = createFileRoute("/linked-accounts")({
  component: LinkedAccountsRoute,
  head: () => ({ meta: [{ title: `Linked Accounts | ${siteTitle}` }] }),
  loader: async () => {
    const identitiesResponse = await store.get(identityAtom);

    if ("error" in identitiesResponse) throw redirect({ to: "/login" });

    return identitiesResponse.filter(
      (identity) =>
        !identity.identifiers.some((item) =>
          item.identifier.includes("@access-ci.org"),
        ),
    );
  },
});

function LinkedAccountsRoute() {
  const router = useRouter();
  const identityDetails =
    Route.useLoaderData() as IdentityResponse["identities"];
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

      <p className="text-xs mt-4!">
        This is a list of accounts associated with your ACCESS account. Please
        remove any accounts that you do not recognize.
      </p>

      <div className="w-full mb-8 mt-4">
        {identityDetails.length === 0 && (
          <p className="text-sm text-muted-foreground mt-4">
            No accounts linked yet.
          </p>
        )}

        {identityDetails.map((identity) => (
          <div
            key={identity.identityId}
            className="mb-3 overflow-hidden rounded-sm border"
          >
            <div className="grid gap-4 p-4 md:grid-cols-[56px_minmax(0,1fr)_120px_180px_auto] md:items-center">
              <div className="flex items-center justify-center self-center">
                <IoPerson className="text-2xl" style={{ color: "#1a5b6e" }} />
              </div>

              <div className="min-w-0 space-y-3">
                {identity.identifiers
                  .sort((a, b) => (a.type < b.type ? -1 : 1))
                  .map((item, i) => (
                    <Fragment key={item.type}>
                      {i === 0 && (
                        <h2 className="font-bold text-[1.375rem]">
                          {identity.organization || item.identifier}
                        </h2>
                      )}
                      <p className="break-words text-sm mb-0!">
                        <strong>{item.type}:</strong> {item.identifier}
                      </p>
                    </Fragment>
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
                <ButtonRow
                  disabled={isImpersonating}
                  label="Delete"
                  variant="destructive"
                  onSubmit={async () => {
                    try {
                      await deleteIdentity(identity.identityId);
                      router.invalidate({
                        filter: (match) => match.routeId === "/linked-accounts",
                      });
                      setNotification({
                        variant: "success",
                        message: "Linked account deleted successfully.",
                      });
                    } catch (error) {
                      setNotification({
                        variant: "error",
                        message: "Unable to delete linked account.",
                      });
                    }
                  }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
