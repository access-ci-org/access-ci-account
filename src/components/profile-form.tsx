import { withForm } from "@/hooks/form";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field, FieldGroup } from "@/components/ui/field";

// Import Registration Form to include in Profile Form Edit/View
import RegistrationFormInputs from "./registration-form-fields";
import AcademicDegreesSection from "./multi-degree-field";
import { useAtomValue } from "jotai";
import { degreesAtom } from "@/helpers/state";
import { profileFormDefault } from "@/helpers/defaults";
import type { Option } from "@/helpers/types";

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

const ProfileForm = withForm({
  defaultValues: profileFormDefault,
  render: function Render({ form }) {
    const degrees = useAtomValue(degreesAtom);
    // Mapping API response to Option
    const degreeOptions: Option<number>[] = degrees.map((degree) => ({
      value: degree.degreeId,
      label: degree.name,
    }));

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
              {/* Importing Complete Registration Form fields */}
              <RegistrationFormInputs
                form={form as any}
                isRegistration={false}
              />

              {/* Role field captures the user's role with a single-select checkbox */}
              {/* This field is hidden until a storage backend is implemented. */}
              <div className="hidden">
                <form.AppField
                  name="role"
                  children={(field) => {
                    return (
                      <field.MultiSelectCheckboxGroup
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

              <AcademicDegreesSection
                form={form}
                degreeOptions={degreeOptions}
              />

              {/* Time zone field captures the user's time zone with a dropdown select */}
              <form.AppField
                name="timeZone"
                children={(field) => {
                  const value = field.state.value || ""; // Ensures that value holds a string
                  return (
                    <field.DropdownSelectField
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

export default ProfileForm;
