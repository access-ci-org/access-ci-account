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
import { useAtomValue } from "jotai";
import { degreesAtom } from "@/helpers/state";

// Option type defines selectable options for form fields
type Option = { label: string; value: string };

// ROLE_OPTIONS defines selectable user roles
const ROLE_OPTIONS: Option[] = [
  { label: "Researcher", value: "researcher" },
  { label: "Educator", value: "educator" },
  { label: "Graduate Student", value: "grad_student" },
  { label: "Resource Provider", value: "resource_provider" },
  { label: "Cyberinfrastructure (CI) Community Member", value: "ci_member" },
];

// TIMEZONE_OPTIONS defines selectable time zones
const TIMEZONE_OPTIONS: Option[] = [
  { label: "Eastern Daylight Time (GMT-4) – Washington", value: "EDT" },
  { label: "Central Daylight Time (GMT-5) – Chicago", value: "CDT" },
  { label: "Mountain Daylight Time (GMT-6) – Denver", value: "MDT" },
  { label: "Mountain Standard Time (GMT-7) – Phoenix", value: "MST" },
  { label: "Pacific Daylight Time (GMT-7) – Los Angeles", value: "PDT" },
  { label: "Alaska Daylight Time (GMT-8) – Anchorage", value: "AKDT" },
  { label: "Hawaii–Aleutian Standard Time (GMT-10) – Honolulu", value: "HST" },
];

const ProfileForm = withForm({
  defaultValues: {
    // Registration Form existing fields
    firstName: "",
    lastName: "",
    email: "",
    institution: 0,
    academicStatus: 0,
    residenceCountry: 0,
    citizenshipCountryIds: [] as number[],

    // Profile-Form existing fields
    role: [] as string[],
    degree: "",
    degreeField: "",
    timeZone: "",
  },
  render: function Render({ form }) {
    const degrees = useAtomValue(degreesAtom);
    // Mapping API response to Option
    const degreeOptions: Option[] = degrees.map((degree) => ({
      value: degree.degreeId.toString(),
      label: degree.name,
    }));

    return (
      <form
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
      >
        <Card className="w-full my-5 border-none rounded-none shadow-none bg-transparent bg-[var(--teal-050)]">
          <CardHeader>
            <CardTitle>Edit Profile</CardTitle>
            <CardDescription>Edit your ACCESS profile.</CardDescription>
          </CardHeader>
          <CardContent>
            <FieldGroup>
              {/* Importing Complete Registration Form fields */}
              <RegistrationFormInputs form={form as any} />

              {/* Role field captures the user's role with a single-select checkbox */}
              <form.AppField
                name="role"
                children={(field) => {
                  return (
                    <field.MultiSelectCheckboxGroup
                      label="Which user person role at ACCESS best describes you:"
                      name="role"
                      values={field.state.value ?? []}
                      onChange={(v) => field.setValue(v)}
                      options={ROLE_OPTIONS}
                    />
                  );
                }}
              />

              {/* Degree field captures the user's degree level with a dropdown select */}
              <form.AppField
                name="degree"
                children={(field) => {
                  const value = field.state.value; // Ensures that value holds a string
                  return (
                    <field.DropdownSelectField
                      label="Degree"
                      name="degree"
                      value={value}
                      onChange={(v: string | null) => field.setValue(v ?? "")}
                      placeholder="Select degree level"
                      options={degreeOptions}
                    />
                  );
                }}
              />

              {/* Degree field text input captures the user's degree field of study */}
              <form.AppField
                name="degreeField"
                children={(field) => (
                  <field.TextField
                    label="Degree Field"
                    placeholder="Enter your degree field"
                  />
                )}
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
                <form.SubmitButton label="Continue" />
              </form.AppForm>
            </Field>
          </CardFooter>
        </Card>
      </form>
    );
  },
});

export default ProfileForm;
