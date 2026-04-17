import { type DomainResponse } from "@/helpers/types";

type PushNotification = (args: {
  variant: "error" | "success" | "warning";
  title: string;
  message: React.ReactNode;
}) => void;

const helpTicketLink = (
  <a
    href="https://support.access-ci.org/help-ticket"
    target="_blank"
    rel="noreferrer"
    className="underline"
  >
    open a help ticket
  </a>
);

// Checks the domain response and pushes correct notification based on domain. 
// Returns false if domain is ineligible or unknown, and true if domain is eligible with organizations.
export function checkDomain(
  domain: DomainResponse | null,
  pushNotification: PushNotification,
) {
    if (domain === null || !domain.isEligible) {
      pushNotification({
        variant: "error",
        title: "Ineligible Email Domain",
        message: (
          <>
            The email domain {domain ? domain.domain : ""} is not eligible for ACCESS.
            Please try again with your university or work email address.
          </>
        ),
      });
      return false;
    } else if (domain.isEligible && !domain.organizations.length) {
      pushNotification({
        variant: "error",
        title: "Unknown Email Domain",
        message: (
          <>
            The email domain {domain.domain} is not yet registered with
            ACCESS. Please {helpTicketLink} and ask to have your
            organization added to the ACCESS database.
          </>
        ),
      });
      return false;
    }
    return true;
  }