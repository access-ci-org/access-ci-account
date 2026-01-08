import { Button } from "./ui/button";
import { FieldSeparator } from "./ui/field";
import { FaKey } from "react-icons/fa";

export function SSHKeysPage() {
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
                <div className="rounded-sm border-1 border-muted">
                    <div className="grid grid-cols-[auto_1fr_auto] items-center gap-3 p-3">

                        <div className="flex flex-col items-start gap-1">
                            <FaKey className="text-3xl mb-1 self-center" />
                            <p className="rounded-sm border-1 text-xs p-1 text-center">
                                SSH
                            </p>
                        </div>


                        <div className="flex flex-col items-start ml-2">
                            <p> Name </p>
                            <p> SHA83929393428934983478437473484334994348439 </p>
                            <p> Added on date </p>
                            <p> Last used within the last - Read/write </p>
                        </div>


                        <div className="flex items-center justify-end">
                            <Button variant={"destructive"}> Delete </Button>
                        </div>
                    </div>
                </div>
                <p> Check out our guide to connecting to GitHub using SSH keys or troubleshoot common SSH problems.</p>
            </div>

        </div>
    );
}