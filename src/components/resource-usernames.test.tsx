import { describe, it, expect } from "vitest";
import { render, screen, within } from "@testing-library/react";
import ResourceUsernames from "@/components/resource-usernames";
import type {
  ResourceLogin,
  ResourceUsernameOrganization,
} from "@/helpers/types";

function login(overrides: Partial<ResourceLogin> = {}): ResourceLogin {
  return {
    resourceName: "bridges2-rm.psc.xsede.org",
    displayName: "PSC Bridges-2 RM",
    rdrResourceId: 1,
    ciderResourceId: "bridges2-rm.psc.access-ci.org",
    username: "ada",
    ...overrides,
  };
}

function org(
  organizationName: string,
  logins: ResourceLogin[],
): ResourceUsernameOrganization {
  return { organizationId: 1, organizationName, logins };
}

describe("ResourceUsernames", () => {
  it("shows an empty message when there are no organizations", () => {
    render(<ResourceUsernames organizations={[]} />);
    expect(
      screen.getByText(/You don't have any resource usernames yet/),
    ).toBeInTheDocument();
    expect(screen.queryByRole("table")).toBeNull();
  });

  it("shows the empty message when no organization has logins", () => {
    render(<ResourceUsernames organizations={[org("ACCESS", [])]} />);
    expect(
      screen.getByText(/You don't have any resource usernames yet/),
    ).toBeInTheDocument();
    expect(screen.queryByRole("table")).toBeNull();
  });

  it("uses a two-column layout when each site has one username", () => {
    render(
      <ResourceUsernames
        organizations={[
          org("National Center for Supercomputing Applications", [
            login({ username: "ada1" }),
            login({ username: "ada1", displayName: "NCSA Delta GPU" }),
          ]),
          org("Pittsburgh Supercomputing Center", [
            login({ username: "ada2" }),
          ]),
        ]}
      />,
    );

    const headers = screen
      .getAllByRole("columnheader")
      .map((h) => h.textContent);
    expect(headers).toEqual(["Site", "Username"]);
    // One row per site, even when a site has several resources.
    expect(screen.getAllByRole("row")).toHaveLength(3);
    expect(screen.getByText("ada1")).toBeInTheDocument();
    expect(screen.getByText("ada2")).toBeInTheDocument();
  });

  it("adds a Resources column when a site has more than one username", () => {
    render(
      <ResourceUsernames
        organizations={[
          org("National Center for Supercomputing Applications", [
            login({ username: "ada1", displayName: "NCSA Delta CPU" }),
            login({
              username: "ada9",
              displayName: null,
              resourceName: "delta-gpu",
            }),
          ]),
          org("Pittsburgh Supercomputing Center", [
            login({ username: "ada2" }),
          ]),
        ]}
      />,
    );

    const headers = screen
      .getAllByRole("columnheader")
      .map((h) => h.textContent);
    expect(headers).toEqual(["Site", "Username", "Resources"]);

    // The site cell spans both of that site's username rows.
    const site = screen.getByText(
      "National Center for Supercomputing Applications",
    );
    expect(site).toHaveAttribute("rowspan", "2");

    // Falls back to resourceName when displayName is null.
    const ada9Row = screen.getByText("ada9").closest("tr")!;
    expect(within(ada9Row).getByText("delta-gpu")).toBeInTheDocument();

    // Sites with a single username still list their resources.
    const ada2Row = screen.getByText("ada2").closest("tr")!;
    expect(within(ada2Row).getByText("PSC Bridges-2 RM")).toBeInTheDocument();
  });
});
