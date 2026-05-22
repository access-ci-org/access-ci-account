import { createFileRoute } from "@tanstack/react-router";
import { siteTitle } from "@/config";
import { useSetAtom, useAtomValue } from "jotai";
import {
  isImpersonatingAtom,
  pushNotificationAtom,
  sshKeysAtom,
  sshKeysDeleteAtom,
} from "@/helpers/state";
import { useNavigate } from "@tanstack/react-router";

import { FaKey } from "react-icons/fa";
import { BsQuestionCircleFill } from "react-icons/bs";
import { Button } from "@/components/ui/button";
import { FieldSeparator } from "@/components/ui/field";
import ButtonRow from "@/components/button-row";

export const Route = createFileRoute("/ssh-keys")({
  component: SSHKeysRoute,
  head: () => ({ meta: [{ title: `SSH Keys | ${siteTitle}` }] }),
});

function SSHKeysRoute() {
  const sshKeyDetails = useAtomValue(sshKeysAtom);
  const deleteSshKey = useSetAtom(sshKeysDeleteAtom);
  const setNotification = useSetAtom(pushNotificationAtom);
  const isImpersonating = useAtomValue(isImpersonatingAtom);
  const navigate = useNavigate();

  return (
    <div className="w-full mt-4">
      <div className="flex w-full items-center justify-between mb-2">
        <div className="flex items-center gap-4">
          <h1>SSH Keys</h1>
          <div className="group relative inline-flex">
            <BsQuestionCircleFill className="cursor-pointer !text-2xl text-[#1a5b6e] hover:text-[#2a7f96]" />
            <div className="absolute left-0 top-full z-50 hidden w-73 max-w-sm rounded border bg-white p-3 shadow group-hover:block">
              <p className="!text-lg mb-2">Need some help with SSH Keys?</p>
              <a
                href="https://www.youtube.com/watch?v=kkEnezr6MWo"
                target="_blank"
                rel="noopener noreferrer"
                className="block text-blue-600 underline hover:text-blue-400"
              >
                Introduction to SSH Keys
              </a>
              <a
                href="https://www.youtube.com/watch?v=DjTBQykeg0c"
                target="_blank"
                rel="noopener noreferrer"
                className="block text-blue-600 underline mt-1 hover:text-blue-400"
              >
                Creating SSH Keys
              </a>
            </div>
          </div>
        </div>

        <div>
          <Button
            disabled={isImpersonating}
            onClick={() => navigate({ to: "/add-ssh-key" })}
          >
            Add SSH Key
          </Button>

        </div>
      </div>

      <FieldSeparator />

      <div className="mt-4">
        <p className="text-xs">
          This is a list of SSH keys associated with your account. Please remove
          any keys that you do not recognize.
        </p>
        <h2 className="text-xl font-semibold"> Authentication Keys </h2>
      </div>

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
              className="rounded-sm border border-muted overflow-hidden"
            >
              <div className="flex flex-col gap-3 p-2 m-2 sm:flex-row sm:items-center sm:justify-between">
                {/* LEFT ICON */}
                <div className="flex flex-col items-start gap-1 sm:w-auto">
                  <FaKey
                    className="!text-2xl mb-1 self-center"
                    style={{ color: "#1a5b6e" }}
                  />
                  <p className="rounded-sm border !text-sm px-2 py-0.5 text-center self-center bg-muted">
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
  );
}
