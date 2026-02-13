import { withForm } from "@/hooks/form";
import { FieldGroup } from "@/components/ui/field";
// Imports for API interaction
import { useAtomValue } from "jotai";
import { countriesAtom, academicStatusesAtom } from "@/helpers/state";

// Option type defines selectable options for form fields
type Option<T> = { label: string; value: T };

// ROLE_OPTIONS defines selectable user roles
const INSTITUTION_OPTIONS: Option<number>[] = [
  { value: 1, label: "University of Michigan" },
  { value: 2, label: "Slippery Rock University" },
  { value: 3, label: "IUP" },
];

const RegistrationFormInputs = withForm({
  defaultValues: {
    firstName: "",
    lastName: "",
    email: "",
    institution: 0,
    academicStatus: 0,
    residenceCountry: 0,
    citizenshipCountry: 0,
  },
  render: function Render({ form }) {
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
                onChange={(v) => field.setValue(v ?? 0)}
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
                onChange={(v) => field.setValue(v ?? 0)}
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
                onChange={(v) => field.setValue(v ?? 0)}
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
                onChange={(v) => field.setValue(v ?? 0)}
                placeholder="Select your country of citizenship"
                options={countryOptions}
                required
              />
            );
          }}
        />
      </FieldGroup>
    );
  },
});

export default RegistrationFormInputs;
