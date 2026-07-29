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
  pushNotificationAtom,
  sshKeysAtom,
  sshKeysDeleteAtom,
  store,
} from "@/helpers/state";

import { FaKey } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import ButtonRow from "@/components/button-row";
import type { SshKeyResponse } from "@/helpers/types";
import { SquarePlay } from "lucide-react";

export const Route = createFileRoute("/ssh-keys")({
  component: SSHKeysRoute,
  head: () => ({ meta: [{ title: `SSH Keys | ${siteTitle}` }] }),
  loader: async () => {
    const sshKeys = await store.get(sshKeysAtom);

    if ("error" in sshKeys) {
      redirect({ to: "/login", throw: true });
    }

    return sshKeys;
  },
});

function SSHKeysRoute() {
  const router = useRouter();
  const sshKeyDetails = Route.useLoaderData() as SshKeyResponse["sshKeys"];
  const deleteSshKey = useSetAtom(sshKeysDeleteAtom);
  const setNotification = useSetAtom(pushNotificationAtom);
  const isImpersonating = useAtomValue(isImpersonatingAtom);
  const navigate = useNavigate();

  return (
    <div className="xl:flex items-start">
      <div>
        <div className="flex w-full items-center justify-between gap-4 mb-9">
          <h1 className="mb-0!">SSH Keys</h1>
          <Button
            disabled={isImpersonating}
            onClick={() => navigate({ to: "/add-ssh-key" })}
          >
            Add SSH Key
          </Button>
        </div>

        <p className="text-xs">
          SSH keys provide a way to log into the command line interface of some
          ACCESS resources. This is a list of SSH keys associated with your
          account. Please remove any keys that you do not recognize.
        </p>

        <div className="w-full mb-8 mt-4">
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
