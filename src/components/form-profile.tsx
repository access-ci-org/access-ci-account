import { withForm } from "@/hooks/form";
import type { DomainResponse, Option } from "@/helpers/types";
import { profileDefaultValues } from "@/helpers/defaults";
import { registrationFields } from "@/helpers/fields";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field, FieldGroup } from "@/components/ui/field";
import FieldsetDegrees from "@/components/fieldset-degrees";
import FieldsetBackupEmails from "@/components/fieldset-backup-emails";
import { FieldGroupRegistration } from "@/components/field-group-registration";

// ROLE_OPTIONS defines selectable user roles
const ROLE_OPTIONS: Option<string>[] = [
  { label: "Researcher", value: "researcher" },
  { label: "Educator", value: "educator" },
  { label: "Graduate Student", value: "grad_student" },
  { label: "Resource Provider", value: "resource_provider" },
  { label: "Cyberinfrastructure (CI) Community Member", value: "ci_member" },
];

// TIMEZONE_OPTIONS defines selectable time zones
const TIMEZONE_OPTIONS: Option<string>[] = Intl.supportedValuesOf(
  "timeZone",
).map((tz) => ({ label: tz, value: tz }));

type FormProfileProps = {
  domain?: DomainResponse | null;
};

const FormProfile = withForm({
  defaultValues: profileDefaultValues,
  props: {} as FormProfileProps,
  render: function Render({ form, domain = null }) {
    return (
      <form
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
      >
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Edit Profile</CardTitle>
            <CardDescription>Edit your ACCESS profile.</CardDescription>
          </CardHeader>
          <CardContent>
            <FieldGroup>
              <form.AppField
                name="username"
                children={(field) => (
                  <field.FieldText
                    label="ACCESS ID"
                    placeholder="ACCESS ID"
                    disabled
                  />
                )}
              />
            </FieldGroup>

            <FieldGroupRegistration
              form={form}
              fields={registrationFields}
              domain={domain}
            />

            <FieldGroup>
              {/* Role field captures the user's role with a single-select checkbox */}
              {/* This field is hidden until a storage backend is implemented. */}
              <div className="hidden">
                <form.AppField
                  name="role"
                  children={(field) => {
                    return (
                      <field.FieldCheckboxes
                        label="What is your role in ACCESS?"
                        name="role"
                        values={field.state.value ?? []}
                        onChange={(v) => field.setValue(v)}
                        options={ROLE_OPTIONS}
                      />
                    );
                  }}
                />
              </div>

              <FieldsetDegrees form={form} />

              {/* Time zone field captures the user's time zone with a dropdown select */}
              <form.AppField
                name="timeZone"
                children={(field) => {
                  const value = field.state.value || ""; // Ensures that value holds a string
                  return (
                    <field.FieldSelect
                      label="Time Zone"
                      name="timeZone"
                      value={value}
                      onChange={(v: string | null) => field.setValue(v ?? "")}
                      placeholder="Select Time Zone"
                      options={TIMEZONE_OPTIONS}
                    />
                  );
                }}
              />
            </FieldGroup>

            {/* Backup email management — profile only, outside the shared
                FieldGroupRegistration so it never appears on registration. */}
            <FieldsetBackupEmails form={form} />
          </CardContent>
          <CardFooter>
            <Field orientation="horizontal">
              <form.AppForm>
                <form.SubmitButton label="Save Profile" />
              </form.AppForm>
            </Field>
          </CardFooter>
        </Card>
      </form>
    );
  },
});

export default FormProfile;
