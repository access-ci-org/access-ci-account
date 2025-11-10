import { createFileRoute } from "@tanstack/react-router";
import { siteTitle } from "@/config";

import { Link } from "@tanstack/react-router";
import { CheckCircle2Icon } from "lucide-react"
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"
import {
  Card,
  CardAction,
  CardDescription,
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
      <div className="min-h-full pt-3">
        <div>
          <Alert>
            <CheckCircle2Icon />
            <AlertTitle className="text-lg font-medium">Congratulations! You've successfully created your ACCESS Account </AlertTitle>
            <AlertDescription>
              <h3 className="text-base"> Next steps: </h3>
              <ol className="list-decimal pl-5">
                <li className="text-sm"> Review and edit your profile. Share your account with ORCID.</li>
                <li className="text-sm"> Start a project and get an allocation.</li>
                <li className="text-sm"> Add information to your Community Personas and participate in the ACCESS community.</li>
              </ol>
            </AlertDescription>
          </Alert>
        </div>

        <div className="grid grid-flow-col items-center pt-5 gap-10">
          <Link to="/profile" className="block">
            <Card>
              <CardHeader>
                <CardTitle> Profile </CardTitle>
                <CardDescription>
                  Edit, update, or add to your profile.
                </CardDescription>
                <CardAction>
                </CardAction>
              </CardHeader>
            </Card>
          </Link>

          <Link to="/profile" className="block">
            <Card>
              <CardHeader>
                <CardTitle> Projects </CardTitle>
                <CardDescription>
                  Find your allocations and projects.
                </CardDescription>
                <CardAction>
                </CardAction>
              </CardHeader>
            </Card>
          </Link>

          <Link to="/profile" className="block">
            <Card>
              <CardHeader>
                <CardTitle> SSH Keys </CardTitle>
                <CardDescription>
                  Log into your resources securely. Find user names/SSH keys.
                </CardDescription>
                <CardAction>
                </CardAction>
              </CardHeader>
            </Card>
          </Link>

          <Link to="/profile" className="block">
            <Card>
              <CardHeader>
                <CardTitle> Metrics </CardTitle>
                <CardDescription>
                  Use XDMoD to track your project's performance and efficiency.
                </CardDescription>
                <CardAction>
                </CardAction>
              </CardHeader>
            </Card>
          </Link>
        </div>

        <div className="grid grid-flow-col items-center pb-5 gap-10">
          <Link to="/profile" className="block">
            <Card>
              <CardHeader>
                <CardTitle> Publications </CardTitle>
                <CardDescription>
                  Add your paper, dataset, software, dissertation, or other published work.
                </CardDescription>
                <CardAction>
                </CardAction>
              </CardHeader>
            </Card>
          </Link>

          <Link to="/profile" className="block">
            <Card>
              <CardHeader>
                <CardTitle> Community Persona </CardTitle>
                <CardDescription>
                  Tag your skills and interests. Find affinity groups, contributions, and event registrations.
                </CardDescription>
                <CardAction>
                </CardAction>
              </CardHeader>
            </Card>
          </Link>

          <Link to="/profile" className="block">
            <Card>
              <CardHeader>
                <CardTitle> Help Tickets </CardTitle>
                <CardDescription>
                  Find Help Tickets associated with your account.
                </CardDescription>
                <CardAction>
                </CardAction>
              </CardHeader>
            </Card>
          </Link>
        </div>
      </div>
    </>
  );
}
