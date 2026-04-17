import { withForm } from "@/hooks/form";
import { FieldGroup } from "@/components/ui/field";
// Imports for API interaction
import {
  academicStatusOptionsAtom,
  countryOptionsAtom,
  domainAtom,
  emailAtom,
  organizationIdOptionsAtom,
  store,
} from "@/helpers/state";

type RegistrationFormInputsProps = {
  isRegistration: boolean;
  showAccessId: boolean;
};

const RegistrationFormInputs = withForm({
  defaultValues: {
    firstName: "",
    lastName: "",
    email: "",
    organizationId: 0,
    academicStatusId: 0,
    residenceCountryId: 0,
    citizenshipCountryIds: [] as number[],
    department: "",
    username: "",
  },
  props: {
    isRegistration: false,
    showAccessId: false,
  } as RegistrationFormInputsProps,
  render: function Render({ form, isRegistration, showAccessId }) {
    return (
      <FieldGroup>
        {showAccessId && (
          <form.AppField
            name="username"
            children={(field) => (
              <field.TextField
                label="ACCESS ID"
                placeholder="ACCESS ID"
                disabled
              />
            )}
          />
        )}

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
          validators={{
            onBlurAsync: async ({ value }) => {
              store.set(emailAtom, value);
              const domain = await store.get(domainAtom);
              // TODO: Check the domain and add the actual message if there is a problem.
              return {
                message: (
                  <>
                    Some <a href="#">link</a>.
                  </>
                ),
              };
            },
          }}
          children={(field) => (
            <field.TextField
              label="Email Address"
              placeholder="University or work email address"
              required
              disabled={isRegistration}
            />
          )}
        />

        <form.AppField
          name="organizationId"
          children={(field) => {
            const value = field.state.value; // Ensures that value holds a string
            return (
              <field.DropdownSelectField
                label="Institution"
                name="organizationId"
                value={value}
                onChange={(v: number | null) => field.setValue(v ?? 0)}
                placeholder="Select your institution"
                optionsAtom={organizationIdOptionsAtom}
                required
              />
            );
          }}
        />

        <form.AppField
          name="department"
          children={(field) => (
            <field.TextField
              label="Department"
              placeholder="Enter your department"
              required
            />
          )}
        />

        <form.AppField
          name="academicStatusId"
          children={(field) => {
            const value = field.state.value; // Ensures that value holds a string
            return (
              <field.DropdownSelectField
                label="Academic Status"
                name="academicStatusId"
                value={value}
                onChange={(v: number | null) => field.setValue(v ?? 0)}
                placeholder="Select your academic status"
                optionsAtom={academicStatusOptionsAtom}
                required
              />
            );
          }}
        />

        <form.AppField
          name="residenceCountryId"
          children={(field) => {
            const value = field.state.value; // Ensures that value holds a string
            return (
              <field.DropdownSelectField
                label="Country of Residence"
                name="residenceCountryId"
                value={value}
                onChange={(v: number | null) => field.setValue(v ?? 0)}
                placeholder="Select your country of residence"
                optionsAtom={countryOptionsAtom}
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
                optionsAtom={countryOptionsAtom}
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
