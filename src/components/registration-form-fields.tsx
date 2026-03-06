import { withForm } from "@/hooks/form";
import { FieldGroup } from "@/components/ui/field";
import React from "react";

// Imports for API interaction
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { countriesAtom, academicStatusesAtom, domainAtom, emailAtom, pendingEmailAtom } from "@/helpers/state";

// Navigation Imports
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

        // Fetching domain via atom
        const [domain] = useAtom(domainAtom);

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
