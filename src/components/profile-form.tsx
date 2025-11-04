import { withForm } from "@/hooks/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from "@/components/ui/select";

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

// DEGREE_OPTIONS defines selectable degree levels
const DEGREE_OPTIONS: Option[] = [
  { label: "Bachelors", value: "bachelors" },
  { label: "Masters", value: "masters" },
  { label: "Ph.D.", value: "phd" },
  { label: "Graduate Certificate", value: "grad_certificate" },
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

// Small helper component that displays validation error messages
function FormError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p className="text-destructive !text-sm font-normal" role="alert">{message}</p>
  );
}

// Renders a labeled dropdown select with validation styling and error handling
function LabeledSelect({
  label,
  name,
  value,
  onChange,
  placeholder,
  options,
  error,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  options: Option[];
  error?: string;
}) {
  return (
    <Field className="space-y-2">
      <FieldLabel className={`font-medium ${error ? "text-red-600" : ""}`}>{label}</FieldLabel>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger aria-invalid={!!error}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((o) => (
            <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      <FormError message={error} />
      <input type="hidden" name={name} value={value} />
    </Field>
  );
}

// Renders a group of checkboxes but allows only a single option to be selected at once
function SingleSelectCheckboxGroup({
  label,
  name,
  value,
  onChange,
  options,
  error,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (v: string) => void;
  options: Option[];
  error?: string;
}) {
  return (
    <fieldset className="space-y-2">
      <FieldLabel className={`font-medium ${error ? "text-red-600" : ""}`}>{label}</FieldLabel>
      <div className="flex flex-wrap items-center gap-4">
        {options.map(({ label: optLabel, value: optValue }) => {
          const id = `${name}-${optValue}`;
          const checked = value === optValue;
          return (
            <label key={optValue} className="inline-flex items-center gap-2 text-sm" htmlFor={id}>
              <Checkbox
                id={id}
                checked={checked}
                onCheckedChange={(nextChecked) => {
                  onChange(nextChecked ? optValue : "");
                }}
              />
              <span>{optLabel}</span>
            </label>
          );
        })}
        <input type="hidden" name={name} value={value} />
      </div>
      <FormError message={error} />
    </fieldset>
  );
}

const ProfileForm = withForm({
  defaultValues: {
    email: "",
    role: "",
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
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Edit Profile</CardTitle>
            <CardDescription>Edit your ACCESS profile.</CardDescription>
          </CardHeader>
          <CardContent>
            <FieldGroup>
              {/* Email field captures the user's email address */}
              <form.AppField
                name="email"
                children={(field) => (
                  <field.TextField
                    label="Email Address"
                    placeholder="University or work email address"
                  />
                )}
              />

              {/* Role field captures the user's role with a single-select checkbox */}
              <form.AppField
                name="role"
                children={(field) => {
                  const value = field.state.value || "";
                  const roleMeta = form.getFieldMeta("role");
                  const roleError = roleMeta?.errors?.[0]?.message;
                  return (
                    <SingleSelectCheckboxGroup
                      label="Which user person role at ACCESS best describes you:"
                      name="role"
                      value={value}
                      onChange={(v) => field.setValue(v)}
                      options={ROLE_OPTIONS}
                      error={roleError}
                    />
                  );
                }}
              />


              {/* Degree field captures the user's degree level with a dropdown select */}
              <form.AppField
                name="degree"
                children={(field) => {
                  const value = field.state.value || "";// Ensures that value holds a string
                  const degreeMeta = form.getFieldMeta("degree"); // Message is extracted from form's metadeta
                  const degreeError = degreeMeta?.errors?.[0]?.message; // Current validation error for degree

                  return (
                    <LabeledSelect
                      label="Degree"
                      name="degree"
                      value={value}
                      onChange={(v) => field.setValue(v)}
                      placeholder="Select degree level"
                      options={DEGREE_OPTIONS}
                      error={degreeError}
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
                  const tzMeta = form.getFieldMeta("timeZone"); // Message is extracted from form's metadeta
                  const tzError = tzMeta?.errors?.[0]?.message; // Current validation error for timeZone

                  return (
                    <LabeledSelect
                      label="Time Zone"
                      name="timeZone"
                      value={value}
                      onChange={(v) => field.setValue(v)}
                      placeholder="Select Time Zone"
                      options={TIMEZONE_OPTIONS}
                      error={tzError}
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
