import { withForm } from "@/hooks/form";
import { FieldGroup } from "@/components/ui/field";
import React from "react";

// Imports for API interaction
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import {
    dismissNotificationAtom,
    notificationsAtom,
    pushNotificationAtom,
} from "@/helpers/notification";
import { countriesAtom, academicStatusesAtom, domainAtom, emailAtom } from "@/helpers/state";

// Navigation Imports
import { useNavigate } from "@tanstack/react-router";


// Option type defines selectable options for form fields
type Option = { label: string; value: string };

const RegistrationFormInputs = withForm({
    defaultValues: {
        firstName: "",
        lastName: "",
        email: "",
        institution: "",
        academicStatus: "",
        residenceCountry: "",
        citizenshipCountry: "",
    },
    render: function Render({ form }) {
        // Redirect to register page if domain is ineligible for registration
        const navigate = useNavigate();

        // Fetching countries, academic status, and domains via atoms
        const [countries] = useAtom(countriesAtom);
        const [academicStatuses] = useAtom(academicStatusesAtom);

        const [domain] = useAtom(domainAtom);
        
        const pushNotification = useSetAtom(pushNotificationAtom);
        const notifications = useAtomValue(notificationsAtom);

        // Mapping API response to Option
        const countryOptions: Option[] =
            countries.map((country) => ({
                value: country.countryId.toString(),
                label: country.countryName,
            }));

        const academicStatusOptions: Option[] =
            academicStatuses.map((status) => ({
                value: status.academicStatusId.toString(),
                label: status.name,
            }));

        const domainOptions: Option[] =
            domain?.organizations?.map((org) => ({
                value: org.organizationId.toString(),
                label:
                    org.organizationName ??
                    org.organizationAbbrev ??
                    `Organization ${org.organizationId}`,
            })) ?? [];

        const email = useAtomValue(emailAtom);
        const emailDomain = email?.split("@")[1]?.toLowerCase() ?? null;

        React.useEffect(() => {
            // Ineligible
            if (domain === null) {
                const id = "ineligible-email-domain";
                const alreadyShown = notifications.some((n) => n.id === id);

                if (!alreadyShown) {
                    pushNotification({
                        id,
                        variant: "error",
                        title: "Ineligible Email Domain",
                        message: (
                            <>
                                The email domain {emailDomain} is not eligible for ACCESS. Please try again
                                with your university or work email address.
                            </>
                        ),
                    });
                }

                navigate({ to: "/register", replace: true });
                return;
            }

            // Unknown (no matching orgs)
            else if (domain?.isEligible === true && (domain.organizations?.length ?? 0) === 0) {
                const id = "unknown-email-domain";
                const alreadyShown = notifications.some((n) => n.id === id);

                if (!alreadyShown) {
                    pushNotification({
                        id,
                        variant: "error",
                        title: "Unknown Email Domain",
                        message: (
                            <>
                                The email domain {emailDomain} is not yet registered with ACCESS. Please open a{" "}
                                <a
                                    href="https://support.access-ci.org/help-ticket"
                                    target="_blank"
                                    rel="noreferrer"
                                    className="underline"
                                >
                                    help ticket
                                </a>{" "}
                                and ask to have your organization added to the ACCESS database.
                            </>
                        ),
                    });
                }

                navigate({ to: "/register", replace: true });
                return;
            }
        }, [domain, pushNotification, navigate, emailDomain]);


        return (

            <FieldGroup>
                <form.AppField
                    name="firstName"
                >
                    {(field) => (
                        <field.TextField
                            label="First Name"
                            placeholder="e.g., John"
                            required
                        />
                    )}
                </form.AppField>
                <form.AppField
                    name="lastName"
                    children={(field) => (
                        <field.TextField
                            label="Last Name"
                            placeholder="e.g., Doe"
                            required
                        />
                    )}
                />
                <form.AppField
                    name="email"
                    children={(field) => (
                        <field.TextField
                            label="Email Address"
                            placeholder="University or work email address"
                            required
                        />
                    )}
                />

                <form.AppField
                    name="institution"
                    children={(field) => {
                        const value = field.state.value; // Ensures that value holds a string
                        return (
                            <field.DropdownSelectField
                                label="Institution"
                                name="institution"
                                value={value}
                                onChange={(v) => field.setValue(v ?? "")}
                                placeholder="Select your institution"
                                options={domainOptions}
                                required
                            />
                        );
                    }}
                />
                <form.AppField
                    name="academicStatus"
                    children={(field) => {
                        const value = field.state.value; // Ensures that value holds a string
                        return (
                            <field.DropdownSelectField
                                label="Academic Status"
                                name="academicStatus"
                                value={value}
                                onChange={(v) => field.setValue(v ?? "")}
                                placeholder="Select your academic status"
                                options={academicStatusOptions}
                                required
                            />
                        );
                    }}
                />
                <form.AppField
                    name="residenceCountry"
                    children={(field) => {
                        const value = field.state.value; // Ensures that value holds a string
                        return (
                            <field.DropdownSelectField
                                label="Country of Residence"
                                name="residenceCountry"
                                value={value}
                                onChange={(v) => field.setValue(v ?? "")}
                                placeholder="Select your country of residence"
                                options={countryOptions}
                                required
                            />
                        );
                    }}
                />
                <form.AppField
                    name="citizenshipCountry"
                    children={(field) => {
                        const value = field.state.value; // Ensures that value holds a string
                        return (
                            <field.DropdownSelectField
                                label="Country of Citizenship"
                                name="citizenshipCountry"
                                value={value}
                                onChange={(v) => field.setValue(v ?? "")}
                                placeholder="Select your country of citizenship"
                                options={countryOptions}
                                required
                            />
                        );
                    }}
                />
            </FieldGroup>
        );
    }
});

export default RegistrationFormInputs;