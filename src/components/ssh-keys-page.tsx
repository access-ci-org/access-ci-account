import { Button } from "./ui/button";
import { FieldSeparator } from "./ui/field";
import { FaKey } from "react-icons/fa";

// Imports for API Interaction
import { useAtom } from "jotai";
import { sshKeysAtom } from "@/helpers/state";

export function SSHKeysPage() {
    // Fetching SSH keys details via atoms
    const [sshKeyDetails] = useAtom(sshKeysAtom);

    return (
        <div className="w-full">
            <div className="flex w-full items-center justify-between gap-4 mb-2">
                <h1> SSH keys </h1>
                <Button>New SSH Key</Button>
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
                {sshKeyDetails?.map((key) => (
                    <div key={key.keyId}
                        className="rounded-sm border border-muted"
                    >
                        <div className="grid grid-cols-[auto_1fr_auto] items-center gap-3 p-3 m-4">
                            {/* LEFT ICON */}
                            <div className="flex flex-col items-start gap-1">
                                <FaKey className="text-3xl mb-1 self-center" style={{ color: "#1a5b6e" }} />
                                <p className="rounded-sm border !text-sm p-1 text-center">
                                    SSH
                                </p>
                            </div>

                            {/* DETAILS */}
                            <div className="flex flex-col items-start ml-2 text-sm">
                                <p> {key.keyId} </p>
                                <p> SHA256: {key.hash} </p>
                                <p> Added on {key.created} </p>
                            </div>

                            {/* ACTION */}
                            <div className="flex items-center justify-end">
                                <Button variant={"destructive"}> Delete </Button>
                            </div>
                        </div>
                    </div>
                ))}
                <p className="mt-4"> Check out our guide to connecting to GitHub using SSH keys or troubleshoot common SSH problems.</p>
            </div>
        </div>
    );
}
