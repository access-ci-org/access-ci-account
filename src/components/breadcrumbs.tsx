import { Breadcrumbs as AccessBreadcrumbs } from "@access-ci/ui/react";
import { useLinkProps, useMatches } from "@tanstack/react-router";

export default function Breadcrumbs() {
  const matches = useMatches();
  const { href: baseUrl } = useLinkProps({ to: "/" });

  if (matches.length < 2) return;
  const match = matches[1];

  const isHome = match.fullPath === "/";
  const items = [{ name: "Account", href: isHome ? undefined : baseUrl }];
  if (!isHome) {
    if (match.fullPath.match(/\/register\/.+/))
      items.push({ name: "Register", href: `${baseUrl}/register` });
    if (match?.meta?.length && match.meta[0]?.title)
      items.push({
        name: match.meta[0].title.split("|")[0].trim(),
        href: undefined,
      });
  }

  return <AccessBreadcrumbs topBorder={true} items={items} />;
}
