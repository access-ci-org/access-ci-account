import { createFileRoute } from "@tanstack/react-router";
import { siteTitle } from "@/config";

import { CheckCircle2Icon } from "lucide-react"
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export const Route = createFileRoute("/dashboard")({
  component: Dashboard,
  head: () => ({ meta: [{ title: `My ACCESS Account | ${siteTitle}` }] }),
});

function Dashboard() {
  return (
    <>
      <h1>My ACCESS Account</h1>
      <div className="min-h-full">
        <Alert>
          <CheckCircle2Icon />
          <AlertTitle>Congratulations! You've successfully created your ACCESS Account </AlertTitle>
          <AlertDescription>
            <h3> Next steps: </h3>
            <ol>
              <li>Review and edit your profile. Share your account with ORCID.</li>
              <li>Start a project and get an allocation.</li>
              <li>Add information to your Community Personas and participate in the ACCESS community.</li>
            </ol>
          </AlertDescription>
        </Alert>
        <div className="flex flex-col">
          <Card className="w-full max-w-sm">
            <CardHeader>
              <CardTitle>Login to your account</CardTitle>
              <CardDescription>
                Enter your email below to login to your account
              </CardDescription>
              <CardAction>
              </CardAction>
            </CardHeader>
          </Card>
        </div>
      </div>
    </>
  );
}
