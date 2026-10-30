import type { ResourceUsernameOrganization } from "@/helpers/types";

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

  // If a user has different usernames on resources at one site, show an
  // extra column listing the resources. Otherwise use a two-column layout.
  const showResources = sites.some((site) => site.usernames.length > 1);

  if (sites.length === 0) {
    return (
      <p className="text-sm text-muted-foreground mt-4">
        You don't have any resource usernames yet. They are created when your
        accounts on ACCESS resources are set up.
      </p>
    );
  }

  return (
    <div className="rounded-sm border overflow-x-auto mt-4">
      <table className="w-full text-sm">
        <thead className="bg-muted text-left">
          <tr>
            <th className="p-2 font-semibold">Site</th>
            <th className="p-2 font-semibold">Username</th>
            {showResources && <th className="p-2 font-semibold">Resources</th>}
          </tr>
        </thead>
        <tbody>
          {sites.map((site) =>
            site.usernames.map(([username, resources], index) => (
              <tr key={`${site.name}-${username}`} className="border-t">
                {index === 0 && (
                  <td className="p-2 align-top" rowSpan={site.usernames.length}>
                    {site.name}
                  </td>
                )}
                <td className="p-2 align-top">{username}</td>
                {showResources && (
                  <td className="p-2 align-top">
                    {resources.map((resource, i) => (
                      <div key={`${resource}-${i}`}>{resource}</div>
                    ))}
                  </td>
                )}
              </tr>
            )),
          )}
        </tbody>
      </table>
    </div>
  );
}
