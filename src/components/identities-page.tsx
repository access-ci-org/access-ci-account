import React from "react";
import { Button } from "./ui/button";
import { FieldSeparator } from "./ui/field";
import { IoPerson } from "react-icons/io5";
import { Link } from "@tanstack/react-router"
import { pushNotificationAtom } from "@/helpers/notification"
import { LoaderCircle } from "lucide-react";

// Imports for API Interaction
import { useAtom, useSetAtom } from "jotai";
import { identityAtom } from "@/helpers/state";

export function IdentityPage() {
    // Fetching SSH keys details via atoms
    const [identityDetails] = useAtom(identityAtom)
    // const deleteSshKey = useSetAtom(sshKeysDeleteAtom)

    // Notification atom for feedback on actions
    const setNotification = useSetAtom(pushNotificationAtom)

    // States to show loading when deleting a key
    const [deletingKey, setDeletingKey] = React.useState<number | null>(null)

    return (
        <div className="w-full mt-4">
            <div className="flex w-full items-center justify-between gap-4 mb-2">
                <h1> Identities </h1>
                <Button asChild>
                    <Link to="/add-identity">New Idenitity</Link>
                </Button>
            </div>

            <FieldSeparator />

            <div className="mt-4">
                <p className="text-xs"> This is a list of identities associated with your account. Please remove any identities that you do not recognize.</p>
                <h2 className="text-xl font-semibold"> Authenticated Identities </h2>
            </div>

            <div className="w-full mb-8 mt-4">
                {identityDetails?.length === 0 && (
                    <p className="text-sm text-muted-foreground mt-4">
                        No identities added yet.
                    </p>
                )}

                {identityDetails?.map((item) => (
                    <div
                        key={`${item.identity_id}-${item.type}-${item.identifier}`}
                        className="rounded-sm border border-muted overflow-hidden mb-3"
                    >
                        <div className="flex flex-col gap-3 p-2 m-2 sm:flex-row sm:items-center sm:justify-between">
                            <div className="flex flex-col items-start gap-1 sm:w-auto">
                                <IoPerson className="text-2xl mb-1 self-center" style={{ color: "#1a5b6e" }} />
                                <p className="rounded-sm border text-xs px-2 py-0.5 text-center self-center bg-muted">
                                    {item.type}
                                </p>
                            </div>

                            <div className="text-xs sm:flex-1 sm:ml-4 min-w-0">
                                <p className="break-words">{item.identifier}</p>
                                <p>{item.login ? "Used for login" : "Not used for login"}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
};