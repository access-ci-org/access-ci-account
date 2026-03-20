import React from "react";
import { Button } from "./ui/button";
import { FieldSeparator } from "./ui/field";
import { IoPerson } from "react-icons/io5";
import { Link } from "@tanstack/react-router"
import { pushNotificationAtom } from "@/helpers/notification"
import { LoaderCircle } from "lucide-react";
import { apiBaseUrl } from "@/config";

// Imports for API Interaction
import { useAtom, useSetAtom } from "jotai";
import { identityAtom, identityDeleteAtom, isLoggedInAtom } from "@/helpers/state";

export function IdentityPage() {
    const [isLoggedIn] = useAtom(isLoggedInAtom);
    // Fetching Identity details via atoms
    const [identityDetails] = useAtom(identityAtom)
    const deleteIdentity = useSetAtom(identityDeleteAtom)

    // Notification atom for feedback on actions
    const setNotification = useSetAtom(pushNotificationAtom)

    // States to show loading when deleting a key
    const [deletingIdentity, setDeletingIdentity] = React.useState<number | null>(null)

    // Linking a new identity handler 
    function handleLinkIdentity() {
        if (!isLoggedIn) { // checking if user is logged in to make CiLogon call
            setNotification({
                variant: "error",
                message: "User is not logged in."
            });
            return
        } else {
            const form = document.createElement("form");
            form.method = "POST";
            form.action = `${apiBaseUrl}/auth/link`;
            form.style.display = "none";

            document.body.appendChild(form);
            form.submit();
        }
    }

    // Deleting identities action
    async function handleDeleteIdentity(event: React.FormEvent<HTMLFormElement>, identityId: number) { // form submit event package
        event.preventDefault(); // prevents refresh

        // if there is no id, throw error notification
        if (!identityId) {
            setNotification({
                variant: "error",
                message: "Missing identity id.",
            });
            return;
        }

        try {
            setDeletingIdentity(identityId); // put in "delete" state
            console.log("deleting...", identityId)

            /*
                const result = await deleteIdentity(identityId) // calling delete atom on id
                if (result?.error ||result?.response?.error) { // if backend returned an error 
                      throw new Error("Unable to delete identity.");
                } else {
                    // successful deletion
                    setNotification({
                        variant: "success",
                        message: "Identity deleted successfully.",
                    });
                }
            */

        } catch (error) {
            // if anything else fails..
            setNotification({
                variant: "error",
                message: "Unable to delete identity",
            });

        } finally {
            setDeletingIdentity(null); // reset state so button returns to normal
        }

    }

    return (
        <div className="w-full mt-4">
            <div className="flex w-full items-center justify-between gap-4 mb-2">
                <h1> Identities </h1>
                <Button onClick={handleLinkIdentity}>
                    Link New Idenitity 
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
                    <form
                        key={`${item.identity_id}-${item.type}-${item.identifier}`}
                        onSubmit={(event) => handleDeleteIdentity(event, item.identity_id)}
                        className="rounded-sm border border-muted overflow-hidden mb-3"
                    >
                        <div className="flex flex-col gap-3 p-2 m-2 sm:flex-row sm:items-center sm:justify-between">
                            {/* 1st */}
                            <div className="flex flex-col items-start gap-1 w-full sm:w-24 shrink-0">
                                <IoPerson className="!text-2xl mb-1 self-center" style={{ color: "#1a5b6e" }} />
                                <p className="rounded-sm border !text-sm px-2 py-0.5 text-center self-center bg-muted">
                                    {item.type}
                                </p>
                            </div>

                            {/* 2nd */}
                            <div className="text-xs sm:flex-1 sm:ml-4 min-w-0">
                                <p className="break-words">{item.identifier}</p>
                            </div>

                            {/* 3rd */}
                            <div className="text-xs sm:flex-1 sm:ml-4 min-w-0">
                                <p>{item.login ? "Used for login" : "Not used for login"}</p>
                            </div>

                            {/* 4th */}
                            <div className="flex justify-end sm:justify-end">
                                <Button
                                    type="submit"
                                    variant="destructive"
                                    size="lg"
                                    disabled={deletingIdentity === item.identity_id}
                                >
                                    {deletingIdentity === item.identity_id ? (
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
                ))
                }
            </div>
        </div>
    )
};