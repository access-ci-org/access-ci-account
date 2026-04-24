import { type DomainResponse } from "./types";
import { pushNotificationAtom } from "./state";
import { useSetAtom } from "jotai";

const pushNotification = useSetAtom(pushNotificationAtom)


export function getDomainValidationResponse(domain: DomainResponse | null) {
    // Domain is not eligible
    if (!domain?.isEligible) {
        pushNotification({
            variant: "error",
            title: "Ineligible Email Domain",
            message: `The email domain ${domain ? domain.domain : ""} is not eligible for ACCESS. Please try again with your university or work email address.`
        });
    }

    // Domain is eligible but needs to be added to the system
    if (domain?.isEligible && !domain?.organizations.length) {
        return {
            message: `The email domain ${domain.domain} is not yet registered with
            ACCESS.`,
            needsHelpTicket: true,
        };
    }

    return null;
}