import { withForm} from "@/hooks/form";

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

// Option type defines selectable options for form fields
type Option = { label: string; value: string };

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
    institution: "",
    academicStatus: "",
    residenceCountry: "",
    citizenshipCountry: "",

    // Profile-Form existing fields
    role: [] as string[],
    degree: "",
    degreeField: "",
    timeZone: "",
  },
  render: function Render({ form }) {
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
                      onChange={(v) => field.setValue(v ?? "")}
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
                <form.SubmitButton label="Continue"/>
              </form.AppForm>
            </Field>
          </CardFooter>
        </Card>
      </form>
    );
  },
});

export default ProfileForm;
