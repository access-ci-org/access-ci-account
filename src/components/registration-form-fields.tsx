import { withForm } from "@/hooks/form";
import { FieldGroup } from "@/components/ui/field";
// Imports for API interaction
import { useAtom } from "jotai";
import { countriesAtom, academicStatusesAtom } from "@/helpers/state";

// Option type defines selectable options for form fields
type Option = { label: string; value: string };

// ROLE_OPTIONS defines selectable user roles
const INSTITUTION_OPTIONS: Option[] = [
    { value: "university_of_michigan", label: "University of Michigan" },
    { value: "university_of_slip_rock", label: "Slippery Rock University" },
    { value: "university_of_indiana", label: "IUP" },
];

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
        // Fetching countries and academic status via atoms
        const [countries] = useAtom(countriesAtom);
        const [academicStatuses] = useAtom(academicStatusesAtom);
    
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
                                options={INSTITUTION_OPTIONS}
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