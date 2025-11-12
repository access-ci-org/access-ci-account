import { createFileRoute } from "@tanstack/react-router";
import { siteTitle } from "@/config";


import { CheckCircle2Icon } from "lucide-react"
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"
import { DashboardCard } from "@/components/dashboard-card";

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
                <div className="text-base">
                  <li> Review and edit your profile. Share your account with ORCID.</li>
                  <li> Start a project and get an allocation.</li>
                  <li> Add information to your Community Personas and participate in the ACCESS community.</li>
                </div>
              </ol>
            </AlertDescription>
          </Alert>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch pt-6">
          <div className="w-full h-full">
            <DashboardCard
              title="Profile"
              description="Edit, update, or add to your profile."
              to="/profile"
            />
          </div>
          <div className="w-full h-full">
            <DashboardCard
              title="Projects"
              description="Find your allocations and projects."
              to="https://allocations.access-ci.org/"
            />
          </div>
          <div className="w-full h-full">
            <DashboardCard
              title="SSH Keys"
              description="Log into your resources securely. Find user names/SSH keys."
              to="/ssh-keys"
            />
          </div>
          <div className="w-full h-full">
            <DashboardCard
              title="Metrics"
              description="Use XDMoD to track your project's performance and efficiency."
              to="https://metrics.access-ci.org/"
            />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7 items-stretch pt-6 pb-6">
          <div className="w-full h-full">
            <DashboardCard
              title="Publications"
              description="Add your paper, dataset, software, dissertation, or other publihsed work."
              to="https://allocations.access-ci.org/publications"
            />
          </div>
          <div className="w-full h-full">
            <DashboardCard
              title="Community Persona"
              description="Tag your skills and interests. Find affinity groups, contributions, and event registrations."
              to="https://support.access-ci.org/community-persona"
            />
          </div>
          <div className="w-full h-full">
            <DashboardCard
              title="Help Tickets"
              description="Find Help Tickts assocaited with your account."
              to="https://access-ci.atlassian.net/servicedesk/customer/user/requests"
            />
          </div>
        </div>
      </div>
    </>
  );
}
