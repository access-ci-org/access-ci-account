import { type DomainResponse } from "../helpers/types";

import HelpTicketLink from "@/components/help-ticket-link";
import OrganizationRequestLink from "./organization-request-link";

export default function DomainValidationResponse({
  domain,
}: {
  domain: DomainResponse | null;
}) {
  // Domain is not eligible
  if (!domain?.isEligible) {
    return (
      <>
        The email domain {domain ? domain.domain : ""} is not eligible for
        ACCESS. Please try again with your university or work email address.
      </>
    );
  }

  // Domain is eligible but needs to be added to the system
  if (domain?.isEligible && !domain?.organizations.length) {
    return (
      <>
        The email domain {domain.domain} is not yet registered with ACCESS. Please <OrganizationRequestLink /> to have
        your organization added to ACCESS. If you have trouble with the form, please <HelpTicketLink />.
      </>
    );
  }

  return null;
}
