import { Button } from "./ui/button";
import { FieldSeparator } from "./ui/field";
import { IoPerson } from "react-icons/io5";
import DeleteRow from "./delete-row";

// Imports for API Interaction
import { useAtom, useSetAtom } from "jotai";
import { identityAtom, identityDeleteAtom } from "@/helpers/state";

export function IdentityPage() {
    // Fetching Identity details via atoms
    const [identityDetails] = useAtom(identityAtom)
    const deleteIdentity = useSetAtom(identityDeleteAtom)

    // Due to nested structure, we will need to flatten out details to show row by row
    const flattenedIdentityDetails = (identityDetails ?? []).flatMap((identity) => // flattens and maps at the same time
        (identity.identifiers ?? []).map((identifier) => ({ // mapping details 
            identityId: identity.identityId,
            organization: identity.organization,
            type: identifier.type,
            identifier: identifier.identifier,
            login: identifier.login,
        }))
    );

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
                {flattenedIdentityDetails.length === 0 && (
                    <p className="text-sm text-muted-foreground mt-4">
                        No identities added yet.
                    </p>
                )}

                {flattenedIdentityDetails.map((item) => (
                    <form
                        key={`${item.identityId}-${item.type}-${item.identifier}`}
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
                                    <DeleteRow
                                    id={item.identityId}
                                    onDelete={deleteIdentity}
                                    label="Delete"
                                />
                            </div>
                        </div>
                    </form>
                ))
                }
            </div>
        </div>
    )
};