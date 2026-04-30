import { type DomainResponse } from "../helpers/types";

import HelpTicketLink from "@/components/help-ticket-link";

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
        The email domain {domain.domain} is not yet registered with ACCESS.
        Please <HelpTicketLink /> and ask to have your organization added to the
        ACCESS database.
      </>
    );
  }

  return null;
}
