import { withForm } from "@/hooks/form";
import { FieldGroup } from "@/components/ui/field";


// Option type defines selectable options for form fields
type Option = { label: string; value: string };

// ROLE_OPTIONS defines selectable user roles
const INSTITUTION_OPTIONS: Option[] = [
    { value: "university_of_michigan", label: "University of Michigan" },
    { value: "university_of_slip_rock", label: "Slippery Rock University" },
    { value: "university_of_indiana", label: "IUP" },
];

const COUNTRY_OPTIONS: Option[] = [
    { value: "us", label: "United States" },
    { value: "ca", label: "Canada" },
    { value: "mx", label: "Mexico" },
];
const ACADEMIC_STATUS_OPTIONS: Option[] = [
    { value: "undergraduate_student", label: "Undergraduate Student" },
    { value: "graduate_student", label: "Graduate Student" },
    { value: "faculty", label: "Faculty" },
    { value: "staff", label: "Staff" },
    { value: "other", label: "Other" },
];
const CITIZENSHIP_COUNTRY_OPTIONS: Option[] = COUNTRY_OPTIONS;

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
                                options={ACADEMIC_STATUS_OPTIONS}
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
                                options={COUNTRY_OPTIONS}
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
                                options={CITIZENSHIP_COUNTRY_OPTIONS}
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