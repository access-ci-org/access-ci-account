import { Button } from "./ui/button";
import { FieldSeparator } from "./ui/field";
import { IoPerson } from "react-icons/io5";
import { pushNotificationAtom } from "@/helpers/notification";
import ButtonRow from "@/components/button-row";

// Imports for API Interaction
import { useAtom, useSetAtom } from "jotai";
import { identityAtom, identityDeleteAtom } from "@/helpers/state";

export function IdentityPage() {
    // Fetching Identity details via atoms
    const [identityDetails] = useAtom(identityAtom)
    const deleteIdentity = useSetAtom(identityDeleteAtom)
    const setNotification = useSetAtom(pushNotificationAtom);

    return (
        <div className="w-full mt-4">
            <div className="flex w-full items-center justify-between gap-4 mb-2">
                <h1> Identities </h1>
                <Button>
                    Link New Idenitity
                </Button>
            </div>

            <FieldSeparator />

            <div className="mt-4">
                <p className="text-xs"> This is a list of identities associated with your account. Please remove any identities that you do not recognize.</p>
                <h2 className="text-xl font-semibold"> Authenticated Identities </h2>
            </div>

            <div className="w-full mb-8 mt-4">
                {identityDetails.length === 0 && (
                    <p className="text-sm text-muted-foreground mt-4">
                        No identities added yet.
                    </p>
                )}

                {identityDetails.map((identity) => (
                    <div
                        key={identity.identityId}
                        className="rounded-sm border border-muted overflow-hidden mb-3"
                    >
                        <div className="flex flex-col p-2 m-2 sm:flex-row sm:items-center sm:justify-between">
                            {/* 1st */}
                            <div className="flex flex-col items-start w-full sm:w-24 shrink-0">
                                <IoPerson className="!text-2xl mb-1 self-center" style={{ color: "#1a5b6e" }} />
                            </div>

                            {/* 2nd */}
                            <div className="text-xs flex-[2] sm:ml-4 min-w-0">
                                {identity.identifiers.map((item) => (
                                    <p key={item.identifier} className="break-words">{item.identifier}</p>
                                ))}
                            </div>

                            {/* 3rd */}
                            <div className="text-xs flex-[0.5] sm:ml-4 min-w-0 flex flex-col items-center justify-center" >
                                {identity.identifiers.map((item) => (
                                    <p key={item.identifier} className="rounded-sm border !text-sm px-2 py-0.5 max-w-20 text-center self-center bg-muted">
                                        {item.type}
                                    </p>
                                ))}
                            </div>

                            {/* 4th */}
                            <div className="text-xs sm:flex-1 sm:ml-4 min-w-0 flex flex-col items-center justify-center">
                                <p>
                                    {identity.identifiers.some((item) => item.login) ?
                                        "Used for login" : "Not used for login"}
                                </p>
                            </div>

                            {/* 5th */}
                            <div className="flex justify-end sm:justify-end min-w-[100px]">
                                {!identity.identifiers.some((item) => item.identifier.includes("@access-ci.org")) ? (
                                    <ButtonRow
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
                                    <div className="w-full h-8" />
                                )}
                            </div>
                        </div>
                    </div>
                ))
                }
            </div>
        </div>
    )
};