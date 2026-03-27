import { Button } from "./ui/button";
import { FieldSeparator } from "./ui/field";
import { FaKey } from "react-icons/fa";
import { Link } from "@tanstack/react-router"

// Imports for API Interaction
import { useSetAtom, useAtomValue } from "jotai";
import { sshKeysAtom, sshKeysDeleteAtom } from "@/helpers/state";
import DeleteRow from "./delete-row";

function SSHKeysPage() {
    const sshKeyDetails = useAtomValue(sshKeysAtom)
    const deleteSshKey = useSetAtom(sshKeysDeleteAtom);
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
                <p className="text-xs" > This is a list of SSH keys associated with your account. Please remove any keys that you do not recognize.</p>
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
                                    <FaKey className="!text-2xl mb-1 self-center" style={{ color: "#1a5b6e" }} />
                                    <p className="rounded-sm border !text-sm px-2 py-0.5 text-center self-center bg-muted">
                                        SSH
                                    </p>
                                </div>

                                {/* DETAILS */}
                                <div className="text-xs sm:flex-1 sm:ml-4 min-w-0">
                                    <p className="break-words"> {key.hash} </p>
                                    <p className="!text-sm"> Added on {key.created} </p>
                                </div>

                                {/* ACTION */}
                                <div className="flex justify-end sm:justify-end">
                                    <DeleteRow
                                        id={key.keyId}
                                        onDelete={deleteSshKey}
                                        label="Delete"
                                    />
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default SSHKeysPage;
