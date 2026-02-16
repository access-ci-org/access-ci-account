import { createFileRoute } from "@tanstack/react-router";
import { siteTitle } from "@/config";
import RegistrationLayout from "@/components/registration-layout";
import SuccessMessage from "@/components/success-message";
import ProgressBar from "@/components/progress-bar";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/register/success")({
    component: Success,
    head: () => ({ meta: [{ title: siteTitle }] }),
});

function Success() {
    return (
        <>
            <RegistrationLayout
                left={<SuccessMessage />}
                right={
                    <>
                        <div className="p-8">
                            <ProgressBar />
                            <Button asChild className="bg-secondary border-none text-black mt-4 w-full">
                                <a
                                    href="https://support.access-ci.org/help-ticket"
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    Open a ticket
                                </a>
                            </Button>

                        </div>
                    </>
                }
            />
        </>
    );
}
