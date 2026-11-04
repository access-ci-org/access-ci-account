import {
  createFileRoute,
  redirect,
  useNavigate,
  useRouter,
} from "@tanstack/react-router";
import { siteTitle } from "@/config";
import { useSetAtom, useAtomValue } from "jotai";
import {
  isImpersonatingAtom,
  isServiceUnavailable,
  pushNotificationAtom,
  resourceUsernamesAtom,
  sshKeysAtom,
  sshKeysDeleteAtom,
  store,
} from "@/helpers/state";

import { FaKey } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import ButtonRow from "@/components/button-row";
import ResourceUsernames from "@/components/resource-usernames";
import type { SshKeyResponse } from "@/helpers/types";
import { ServiceUnavailableError } from "@/components/service-unavailable";
import { SquarePlay } from "lucide-react";

export const Route = createFileRoute("/ssh-keys")({
  component: SSHKeysRoute,
  head: () => ({
    meta: [{ title: `SSH Keys and Resource Usernames | ${siteTitle}` }],
  }),
  loader: async ({ location }) => {
    const [sshKeys, resourceUsernames] = await Promise.all([
      store.get(sshKeysAtom),
      store.get(resourceUsernamesAtom),
    ]);

    // Only SSH key errors decide the page's fate. If resource usernames fail
    // to load, the section below shows a message and the keys still render.
    if (isServiceUnavailable(sshKeys)) throw new ServiceUnavailableError();
    if ("error" in sshKeys) {
      redirect({
        to: "/login",
        search: { next: location.href },
        throw: true,
      });
    }

    return { sshKeys, resourceUsernames };
  },
});

function SSHKeysRoute() {
  const router = useRouter();
  const { sshKeys, resourceUsernames } = Route.useLoaderData();
  const sshKeyDetails = sshKeys as SshKeyResponse["sshKeys"];
  const deleteSshKey = useSetAtom(sshKeysDeleteAtom);
  const setNotification = useSetAtom(pushNotificationAtom);
  const isImpersonating = useAtomValue(isImpersonatingAtom);
  const navigate = useNavigate();

  return (
    <div className="xl:flex items-start">
      <div>
        <h1>SSH Keys and Resource Usernames</h1>

        {/* SSH KEYS (editable) */}
        <section className="mb-8">
          <div className="flex w-full items-center justify-between gap-4 mb-3">
            <h2 className="font-extrabold text-2xl mb-0!">SSH Keys</h2>
            <Button
              disabled={isImpersonating}
              onClick={() => navigate({ to: "/add-ssh-key" })}
            >
              Add SSH Key
            </Button>
          </div>

          <p className="text-xs">
            SSH keys provide a way to log into the command line interface of
            some ACCESS resources. This is a list of SSH keys associated with
            your account. Please remove any keys that you do not recognize.
          </p>

          <div className="w-full mt-4">
            {sshKeyDetails?.length === 0 && (
              <p className="text-sm text-muted-foreground mt-4">
                No SSH keys added yet.
              </p>
            )}
            {sshKeyDetails?.map((key) => {
              return (
                <div
                  key={key.keyId}
                  className="rounded-sm border overflow-hidden"
                >
                  <div className="flex flex-col gap-3 p-2 m-2 sm:flex-row sm:items-center sm:justify-between">
                    {/* LEFT ICON */}
                    <div className="flex flex-col items-start gap-1 sm:w-auto">
                      <FaKey
                        className="!text-2xl mb-1 self-center"
                        style={{ color: "#1a5b6e" }}
                      />
                      <p className="border !text-sm px-2 py-0.5 text-center self-center bg-muted">
                        SSH
                      </p>
                    </div>

                    {/* DETAILS */}
                    <div className="text-xs sm:flex-1 sm:ml-4 min-w-0">
                      <p className="break-words">{key.hash}</p>
                      <p className="!text-sm">Added on {key.created}</p>
                    </div>

                    {/* ACTION */}
                    <div className="flex justify-end sm:justify-end">
                      <ButtonRow
                        disabled={isImpersonating}
                        label="Delete"
                        variant="destructive"
                        onSubmit={async () => {
                          try {
                            await deleteSshKey(key.keyId);
                            router.invalidate({
                              filter: (match) => match.routeId === "/ssh-keys",
                            });
                            setNotification({
                              variant: "success",
                              message: "SSH key deleted successfully.",
                            });
                          } catch (error) {
                            setNotification({
                              variant: "error",
                              message: "Unable to delete SSH key.",
                            });
                          }
                        }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* RESOURCE USERNAMES (read-only, below the editable SSH keys) */}
        <section className="mb-8">
          <h2 className="font-extrabold text-2xl mb-3">Resource Usernames</h2>
          <p className="text-xs">
            These are the usernames assigned to you on ACCESS resources. Use
            them when logging in to a resource provider's systems.
          </p>
          {"error" in resourceUsernames ? (
            <p className="text-sm text-muted-foreground mt-4">
              Unable to load your resource usernames. Please try again later.
            </p>
          ) : (
            <ResourceUsernames organizations={resourceUsernames} />
          )}
        </section>
      </div>
      <section className="bg-[var(--teal-050)] p-5 xl:ml-5 mt-5 xl:mt-0 xl:w-[280px] shrink-0">
        <h2 className="font-extrabold text-2xl mb-3">Learn More</h2>
        <ul>
          <li>
            <a
              href="https://www.youtube.com/watch?v=kkEnezr6MWo"
              target="_blank"
              rel="noreferrer"
              className="underline"
            >
              <SquarePlay className="inline me-0.5" /> Intro to SSH Keys
            </a>
          </li>
          <li>
            <a
              href="https://www.youtube.com/watch?v=DjTBQykeg0c"
              target="_blank"
              rel="noreferrer"
              className="underline"
            >
              <SquarePlay className="inline me-0.5" /> Creating SSH Keys
            </a>
          </li>
        </ul>
      </section>
    </div>
  );
}
