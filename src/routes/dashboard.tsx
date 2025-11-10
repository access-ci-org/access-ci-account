import { createFileRoute } from "@tanstack/react-router";
import { siteTitle } from "@/config";


import { CheckCircle2Icon } from "lucide-react"
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"
import { DashboardCard } from "@/components/dashboard-cards";

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
          <DashboardCard
            title="Profile"
            description="Edit, update, or add to your profile."
            to="/profile"
          />
          <DashboardCard
            title="Projects"
            description="Find your allocations and projects."
            to="https://allocations.access-ci.org/"
          />
          <DashboardCard
            title="SSH Keys"
            description="Log into your resources securely. Find user names/SSH keys."
            to="/ssh-keys"
          />
          <DashboardCard
            title="Metrics"
            description="Use XDMoD to track your project's performance and efficiency."
            to="https://metrics.access-ci.org/"
          />
        </div>
        <div className="grid grid-flow-col items-center pt-5 pb-10 gap-10">
        <DashboardCard
            title="Publications"
            description="Add your paper, dataset, software, dissertation, or other publihsed work."
            to="https://allocations.access-ci.org/publications"
          />
          <DashboardCard
            title="Community Persona"
            description="Tag your skills and interests. Find affinity groups, contributions, and event registrations."
            to="https://support.access-ci.org/community-persona"
          />
          <DashboardCard
            title="Help Tickets"
            description="Find Help Tickts assocaited with your account."
            to="https://access-ci.atlassian.net/servicedesk/customer/user/requests"
          />
        </div>
      </div>
    </>
  );
}
