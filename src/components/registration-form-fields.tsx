import { withForm } from "@/hooks/form";
import { FieldGroup } from "@/components/ui/field";
// Imports for API interaction
import { useAtom } from "jotai";
import { countriesAtom, academicStatusesAtom, domainAtom} from "@/helpers/state";

// Navigation Imports
import { useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";


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

        useEffect(() => {
            if (domain === null) {
                navigate({
                    to: "/register",
                    search: { 
                        error: "ineligible_domain",
                        message: "The email domain you entered is ineligible for ACCESS registration. Please use another email address, or open a help ticket here."
                    },
                    replace: true,
                });
            }
        }, [domain, navigate]);
    
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
            domain?.organizations?.map((org: any) => ({
            value: org.organizationId.toString(),
            label: org.organizationName,
            })) ?? [];
    
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
                                options={domainOptions.length > 0 ? domainOptions : [{ label: "No eligible institutions found", value: "No eligible institutions found, please open a help ticket here: "}]}
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