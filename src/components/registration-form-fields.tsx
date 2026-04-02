import { withForm } from "@/hooks/form";
import { FieldGroup } from "@/components/ui/field";
// Imports for API interaction
import { useAtom, useAtomValue } from "jotai";
import {
  countriesAtom,
  academicStatusesAtom,
  domainAtom,
} from "@/helpers/state";
import type { Option } from "@/helpers/types";

type RegistrationFormInputsProps = {
  isRegistration: boolean;
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
                options={domainOptions}
                required
              />
            );
          }}
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
                options={academicStatusOptions}
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
  },
});

export default RegistrationFormInputs;
