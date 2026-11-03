import type { ResourceUsernameOrganization } from "@/helpers/types";

const cellClasses = "border border-[#cccccc] p-2 align-top";
const headerClasses =
  "border border-[#cccccc] p-2 text-left align-bottom font-bold";

type ResourceUsernamesProps = {
  organizations: ResourceUsernameOrganization[];
};

export default function ResourceUsernames({
  organizations,
}: ResourceUsernamesProps) {
  // Group each organization's logins by username, collecting resource names.
  // Organizations without any logins are dropped so they don't render empty.
  const sites = organizations
    .map((org) => {
      const usernames = new Map<string, string[]>();
      for (const login of org.logins) {
        const resources = usernames.get(login.username) ?? [];
        resources.push(login.displayName ?? login.resourceName);
        usernames.set(login.username, resources);
      }
      return { name: org.organizationName, usernames: [...usernames] };
    })
    .filter((site) => site.usernames.length > 0);

  if (sites.length === 0) {
    return (
      <p className="text-sm text-muted-foreground mt-4">
        You don't have any resource usernames yet. They are created when your
        accounts on ACCESS resources are set up.
      </p>
    );
  }

  return (
    <div className="border border-[#cccccc] bg-white overflow-x-auto mt-4">
      <table className="w-full border-collapse border-hidden">
        <thead>
          <tr>
            <th className={headerClasses}>Resource Provider</th>
            <th className={headerClasses}>Username</th>
            <th className={headerClasses}>Resources</th>
          </tr>
        </thead>
        <tbody>
          {sites.map((site) =>
            site.usernames.map(([username, resources], index) => (
              <tr key={`${site.name}-${username}`}>
                {index === 0 && (
                  <td className={cellClasses} rowSpan={site.usernames.length}>
                    {site.name}
                  </td>
                )}
                <td className={cellClasses}>{username}</td>
                <td className={cellClasses}>
                  {resources.map((resource, i) => (
                    <div key={`${resource}-${i}`}>{resource}</div>
                  ))}
                </td>
              </tr>
            )),
          )}
        </tbody>
      </table>
    </div>
  );
}
