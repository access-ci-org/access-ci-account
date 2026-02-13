import { createFileRoute } from "@tanstack/react-router";
import { siteTitle } from "@/config";
import RegistrationLayout from "@/components/registration-layout";
import SuccessMessage from "@/components/success-message";
import ProgressBar from "@/components/progress-bar";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";

export const Route = createFileRoute("/success")({
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
                        <ProgressBar />
                        <Button asChild className="bg-secondary border-none text-black mt-4">
                            <Link to="/">Open a ticket</Link>
                        </Button>
                    </>
                }
            />
        </>
    );
}
