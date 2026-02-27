import React from "react";
import { Button } from "./ui/button";
import { FieldSeparator } from "./ui/field";
import { FaKey } from "react-icons/fa";
import { Link } from "@tanstack/react-router"
import { pushNotificationAtom } from "@/helpers/notification"
import { LoaderCircle } from "lucide-react";

// Imports for API Interaction
import { useAtom, useSetAtom } from "jotai";
import { sshKeysAtom, sshKeysDeleteAtom } from "@/helpers/state";

export function SSHKeysPage() {
    // Fetching SSH keys details via atoms
    const [sshKeyDetails] = useAtom(sshKeysAtom)
    const deleteSshKey = useSetAtom(sshKeysDeleteAtom)

    // Notification atom for feedback on actions
    const setNotification = useSetAtom(pushNotificationAtom)

    // States to show loading when deleting a key
    const [deletingKey, setDeletingKey] = React.useState<number | null>(null)

    return (
        <div className="w-full mt-4">
            <div className="flex w-full items-center justify-between gap-4 mb-2">
                <h1> SSH Keys </h1>
                <Button asChild>
                    <Link to="/add-ssh-key">New SSH Key</Link>
                </Button>
            </div>

            <FieldSeparator />

            <div className="mt-4">
                <p className="text-xs"> This is a list of SSH keys associated with your account. Please remove any keys that you do not recognize.</p>
                <h2 className="text-xl font-semibold"> Authentication Keys </h2>
            </div>

            <div className="w-full mb-8 mt-4">
                {sshKeyDetails?.length === 0 && (
                    <p className="text-sm text-muted-foreground mt-4">
                        No SSH keys added yet.
                    </p>
                )}
                {sshKeyDetails?.map((key) => {
                    const deletingThis = deletingKey === key.keyId
                    const deletingAny = deletingKey !== null
                    return (
                        <div
                            key={key.keyId}
                            className="rounded-sm border border-muted overflow-hidden"
                        >
                            <div className="flex flex-col gap-3 p-2 m-2 sm:flex-row sm:items-center sm:justify-between">
                                {/* LEFT ICON */}
                                <div className="flex flex-col items-start gap-1 sm:w-auto">
                                    <FaKey className="text-2xl mb-1 self-center" style={{ color: "#1a5b6e" }} />
                                    <p className="rounded-sm border text-xs px-2 py-0.5 text-center self-center bg-muted">
                                        SSH
                                    </p>
                                </div>

                                {/* DETAILS */}
                                <div className="text-xs sm:flex-1 sm:ml-4 min-w-0">
                                    <p className="break-words"> {key.hash} </p>
                                    <p> Added on {key.created} </p>
                                </div>

                                {/* ACTION */}
                                <div className="flex justify-end sm:justify-end">
                                    <Button
                                        variant="destructive"
                                        size="lg"
                                        disabled={deletingAny}
                                        onClick={async () => {
                                            // show loading immediately
                                            setDeletingKey(key.keyId)
                                            try {
                                                const result = await deleteSshKey(key.keyId)
                                                if (result.success) {
                                                    setNotification({ variant: "success", message: "SSH key deleted." })
                                                } else {
                                                    setNotification({ variant: "error", message: "Failed to delete SSH key." })
                                                }
                                            } finally {
                                                setDeletingKey(null)
                                            }
                                        }}
                                    >
                                        {deletingThis ? (
                                            <span className="inline-flex items-center gap-2">
                                                <LoaderCircle className="h-4 w-4 animate-spin" />
                                                Deleting…
                                            </span>
                                        ) : (
                                            "Delete"
                                        )}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
};
