import { withFieldGroup } from "@/hooks/form";
import {
  academicStatusOptionsAtom,
  countryOptionsAtom,
  domainAtom,
  emailAtom,
  organizationIdOptionsAtom,
  store,
} from "@/helpers/state";
import { registrationDefaultValues } from "@/helpers/defaults";
import type { DomainResponse } from "@/helpers/types";

import { FieldGroup } from "@/components/ui/field";
import DomainValidationResponse from "@/components/domain-validation-response";
import HelpTicketLink from "@/components/help-ticket-link";
import OrganizationRequestLink from "@/components/organization-request-link";

type FieldGroupRegistrationProps = {
  domain?: DomainResponse | null;
  emailDisabled?: boolean;
};

export const FieldGroupRegistration = withFieldGroup({
  defaultValues: registrationDefaultValues,
  props: {} as FieldGroupRegistrationProps,
  render: function Render({ group, emailDisabled = false, domain = null }) {
    return (
      <FieldGroup>
        <group.AppField
          name="firstName"
          children={(field) => (
            <field.FieldText label="First Name" placeholder="" required />
          )}
        />

        <group.AppField
          name="lastName"
          children={(field) => (
            <field.FieldText label="Last Name" placeholder="" required />
          )}
        />

        <group.AppField
          name="email"
          validators={{
            onBlurAsync: async ({ value }: { value: string }) => {
              store.set(emailAtom, value);
              const newDomain = await store.get(domainAtom);
              const message = DomainValidationResponse({ domain: newDomain });
              if (message) {
                return { message };
              }
            },
            onMount: () => {
              if (domain) {
                const message = DomainValidationResponse({ domain });
                if (message) {
                  return { message };
                }
              }
            },
          }}
          children={(field) => (
            <field.FieldText
              label="Email Address"
              placeholder="University or work email address"
              required
              disabled={emailDisabled}
            />
          )}
        />

        <group.AppField
          name="organizationId"
          children={(field) => {
            const value = field.state.value; // Ensures that value holds a string
            return (
              <>
                <field.FieldSelect
                  label="Institution"
                  name="organizationId"
                  value={value}
                  onChange={(v: number | null) => field.setValue(v ?? 0)}
                  placeholder="Select your institution"
                  optionsAtom={organizationIdOptionsAtom}
                  required
                  description={
                    <>
                      If your organization is not listed, please{" "}
                      <OrganizationRequestLink /> to have your organization
                      added to ACCESS. If you have trouble with the form, please{" "}
                      <HelpTicketLink />.
                    </>
                  }
                />
              </>
            );
          }}
        />

        <group.AppField
          name="department"
          children={(field) => (
            <field.FieldText
              label="Department"
              placeholder="Enter your department"
              required
            />
          )}
        />

        <group.AppField
          name="academicStatusId"
          children={(field) => {
            const value = field.state.value; // Ensures that value holds a string
            return (
              <field.FieldSelect
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

        <group.AppField
          name="residenceCountryId"
          children={(field) => {
            const value = field.state.value; // Ensures that value holds a string
            return (
              <field.FieldSelect
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

        <group.AppField
          name="citizenshipCountryIds"
          children={(field) => {
            const value: number[] = field.state.value;
            return (
              <field.FieldSelect<number>
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
