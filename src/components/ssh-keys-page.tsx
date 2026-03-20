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

    async function handleDeleteSshKey(event: React.FormEvent<HTMLFormElement>, keyId: number) { // form submit event package
        event.preventDefault(); // prevents refresh

        // if there is no id, throw error notification
        if (!keyId) {
            setNotification({
                variant: "error",
                message: "Missing  SSH Key Id.",
            });
            return;
        }

        try {
            setDeletingKey(keyId); // put in "delete" state
            console.log("deleting...", keyId)

            const result = await deleteSshKey(keyId) // calling delete atom on id
            if (result?.error || result?.response?.error) { // if backend returned an error 
                throw new Error("Unable to delete SSH.");
            } else {
                // successful deletion
                setNotification({
                    variant: "success",
                    message: "SSH Key deleted successfully.",
                });
            }

        } catch (error) {
            // if anything else fails..
            setNotification({
                variant: "error",
                message: "Unable to delete SSH Key",
            });

        } finally {
            setDeletingKey(null); // reset state so button returns to normal
        }

    }

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
                    return (
                        <form
                            key={key.keyId}
                            onSubmit={(event) => handleDeleteSshKey(event, key.keyId)}
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
                                        type="submit"
                                        variant="destructive"
                                        size="lg"
                                        disabled={deletingKey === key.keyId}
                                    >
                                        {deletingKey === key.keyId ? (
                                            <>
                                                <LoaderCircle className="mr-2 size-4 animate-spin" />
                                                Deleting...
                                            </>
                                        ) : (
                                            "Delete"
                                        )}
                                    </Button>
                                </div>
                            </div>
                        </form>
                    )
                })}
            </div>
        </div>
    )
};
