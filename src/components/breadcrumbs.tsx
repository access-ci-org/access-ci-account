import type { MouseEvent } from "react";
import { Breadcrumbs as AccessBreadcrumbs } from "@access-ci/ui/react";
import { useLinkProps, useMatches, useNavigate } from "@tanstack/react-router";

export default function Breadcrumbs() {
  const matches = useMatches();
  const navigate = useNavigate();
  const { href: baseUrl } = useLinkProps({ to: "/" });

  if (matches.length < 2) return;
  const match = matches[1];

  const makeItem = (name: string, path?: string) => ({
    name,
    href: path ? `${baseUrl}${path.replace(/^\//, "")}` : undefined,
    onClick: path
      ? (e: MouseEvent<HTMLAnchorElement>) => {
          e.preventDefault();
          navigate({ to: path });
        }
      : undefined,
  });

  const isHome = match.fullPath === "/";
  const items = [makeItem("Account", isHome ? undefined : "/")];
  if (!isHome) {
    if (match.fullPath.match(/\/register\/.+/))
      items.push(makeItem("Register", "/register"));
    if (match?.meta?.length && match.meta[0]?.title)
      items.push(makeItem(match.meta[0].title.split("|")[0].trim(), undefined));
  }

  return <AccessBreadcrumbs topBorder={true} items={items} />;
}
