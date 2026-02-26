import { withForm } from "@/hooks/form";
import { FieldGroup } from "@/components/ui/field";
import React from "react";

// Imports for API interaction
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import {
    notificationsAtom,
    pushNotificationAtom,
} from "@/helpers/notification";
import { countriesAtom, academicStatusesAtom, domainAtom, emailAtom, pendingEmailAtom } from "@/helpers/state";

// Navigation Imports
import { useNavigate } from "@tanstack/react-router";
import { useStore } from "@tanstack/react-store";


// Option type defines selectable options for form fields
type Option<T> = { label: string; value: T };

type RegistrationFormInputsProps = {
    isRegistration: boolean;
};

const RegistrationFormInputs = withForm({
    defaultValues: {
        firstName: "",
        lastName: "",
        email: "",
        institution: 0,
        academicStatus: 0,
        residenceCountry: 0,
        citizenshipCountryIds: [] as number[],
    },
    props: {
        isRegistration: false,
    } as RegistrationFormInputsProps,
    render: function Render({ form, isRegistration }) {
        // Fetching countries and academic status via atoms
        const academicStatuses = useAtomValue(academicStatusesAtom);
        const countries = useAtomValue(countriesAtom);

        // Mapping API response to Option
        const countryOptions: Option<number>[] = countries.map((country) => ({
            value: country.countryId,
            label: country.name,
        }));

        const academicStatusOptions: Option<number>[] = academicStatuses.map(
            (status) => ({
                value: status.academicStatusId,
                label: status.name,
            }),
        );
        // Redirect to register page if domain is ineligible for registration
        const navigate = useNavigate();

        // Fetching domain via atom
        const [domain] = useAtom(domainAtom);

        // Creating notifications via atoms
        const pushNotification = useSetAtom(pushNotificationAtom);
        const notifications = useAtomValue(notificationsAtom);

        // Fetching email via atom
        const originalEmail = useAtomValue(emailAtom) // orginal email in text box before change
        const email = useAtomValue(emailAtom); // current email on record (can be same as orginal)
        const currentEmail = useStore(
            (form as any).store,
            (state: any) => state.values?.email ?? "",
        ); // current email in text box (can be same as orginal or new pending email), used for if user types to show change. 
        const [emailForLookup, setEmailForLookup] = React.useState(email)
        const setPendingEmail = useSetAtom(pendingEmailAtom) // allows update to email in text box
        const pendingEmail = useAtomValue(pendingEmailAtom) // if user supplies a new email, this is the pending email before verification
        React.useEffect(() => {
            if (!pendingEmail) {
              setEmailForLookup(email)
            }
          }, [pendingEmail, email])


        const effectiveEmail = pendingEmail || emailForLookup // if pending email exists use for domain look up
        const emailDomain = effectiveEmail?.split("@")[1]?.toLowerCase() ?? null; // domain from email for domain look up

        React.useEffect(() => {
            if (pendingEmail) {
                (form as any).setFieldValue?.("institution", 0)
            }
        }, [pendingEmail, form])

        // Domain option generating via id 
        const domainOptions: Option<number>[] =
            domain?.organizations?.map((org) => ({
                value: org.organizationId,
                label:
                    org.organizationName ??
                    org.organizationAbbrev ??
                    `Organization ${org.organizationId}`,
            })) ?? [];

        React.useEffect(() => {
            // Don't evaluate eligibility/redirect until the user has typed a real domain
            if (!emailDomain) return;

            // When the domain atom is still loading, avoid firing notifications/redirects
            if (domain === undefined) return;

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

                if (isRegistration) {
                    navigate({ to: "/register", replace: true });
                }
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

                if (isRegistration) {
                    navigate({ to: "/register", replace: true });
                }
                return;
            }
        }, [domain, pushNotification, navigate, emailDomain, isRegistration, notifications]);


        return (

            <FieldGroup>
                <form.AppField name="firstName">
                    {(field) => (
                        <field.TextField label="First Name" placeholder="" required />
                    )}
                </form.AppField>
                <form.AppField
                    name="lastName"
                    children={(field) => (
                        <field.TextField label="Last Name" placeholder="" required />
                    )}
                />
                <form.AppField
                    name="email"
                    children={(field) => (
                        <div
                            onBlur={(e) => {
                                const next = e.relatedTarget as Node | null;
                                // Only run when focus leaves the whole wrapper.
                                if (next && e.currentTarget.contains(next)) return;

                                const nextPending = currentEmail === originalEmail ? "" : currentEmail
                                setPendingEmail(nextPending)
                                setEmailForLookup(nextPending || email)
                            }}
                        >
                            <field.TextField
                                label="Email Address"
                                placeholder="University or work email address"
                                required
                                disabled={isRegistration}
                            />
                        </div>
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
                                onChange={(v: number | null) => field.setValue(v ?? 0)}
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
                                onChange={(v: number | null) => field.setValue(v ?? 0)}
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
                                onChange={(v: number | null) => field.setValue(v ?? 0)}
                                placeholder="Select your country of residence"
                                options={countryOptions}
                                required
                            />
                        );
                    }}
                />
                <form.AppField
                    name="citizenshipCountryIds"
                    children={(field) => {
                        const value: number[] = field.state.value;
                        return (
                            <field.DropdownSelectField<number>
                                label="Country of Citizenship"
                                name="citizenshipCountryIds"
                                value={value}
                                onChange={(v: number[] | null) => field.setValue(v ?? [])}
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
