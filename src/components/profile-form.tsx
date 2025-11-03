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
              <form.AppField
                name="email"
                children={(field) => (
                  <field.TextField
                    label="Email Address"
                    placeholder="University or work email address"
                  />
                )}
              />

              <form.AppField
                name="role"
                children={(field) => {
                  // Role Options
                  const roleOptions = [
                    { label: "Researcher", value: "researcher" },
                    { label: "Educator", value: "educator" },
                    { label: "Graduate Student", value: "grad_student" },
                    { label: "Resource Provider", value: "resource_provider" },
                    { label: "Cyberinfrastructure (CI) Community Member", value: "ci_member" },
                  ];

                  const value = field.state.value || ""; // Ensures that value holds a string
                  const roleMeta = form.getFieldMeta("role"); // Message is extracted from form's metadeta
                  const roleError = roleMeta?.errors?.[0]?.message; // Current validation error for role

                  // Renders Checkboxes & Options 
                  return (
                    <fieldset className="space-y-2">
                      <FieldLabel className={`font-medium ${roleError ? "text-red-600" : ""}`}>
                        Which user person role at ACCESS best describes you:
                      </FieldLabel>
                      <div className="flex flex-wrap items-center gap-4">
                        {/* Loops through array and displays options */}
                        {roleOptions.map(({ label, value: optionValue }) => {
                          const id = `role-${optionValue}`;
                          const checked = value === optionValue;
                          return (
                            <label key={optionValue} className="inline-flex items-center gap-2 text-sm" htmlFor={id}>
                              {/* Renders Checkbox UI element */}
                              <Checkbox
                                id={id}
                                checked={checked}
                                onCheckedChange={(nextChecked) => {
                                  field.setValue(nextChecked ? optionValue : "");
                                }}
                              />
                              {/* Shows options from roleOptions */}
                              <span>{label}</span>
                            </label>
                          );
                        })}
                        <input type="hidden" name="role" value={value} />
                      </div>
                      {roleError && (<p className="text-destructive !text-sm font-normal ">{roleError}</p>)}
                    </fieldset>
                  );
                }}
              />


              <form.AppField
                name="degree"
                children={(field) => {
                  const value = field.state.value || "";// Ensures that value holds a string
                  const degreeMeta = form.getFieldMeta("degree"); // Message is extracted from form's metadeta
                  const degreeError = degreeMeta?.errors?.[0]?.message; // Current validation error for degree

                  // Renders Dropdown & Options
                  return (
                    <Field className="space-y-2">
                      <FieldLabel className={`font-medium ${degreeError ? "text-red-600" : ""}`}>Degree</FieldLabel>
                      <Select
                        value={value}
                        onValueChange={(v) => field.setValue(v)}

                      >
                        <SelectTrigger aria-invalid={!!degreeError}>
                          <SelectValue placeholder="Select degree level" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="bachelors">Bachelors</SelectItem>
                          <SelectItem value="masters">Masters</SelectItem>
                          <SelectItem value="phd">Ph.D.</SelectItem>
                          <SelectItem value="grad_certificate">Graduate Certificate</SelectItem>
                        </SelectContent>
                      </Select>
                      {degreeError && (<p className="text-destructive !text-sm font-normal" role="alert">{degreeError}</p>)}
                      <input type="hidden" name="degree" value={value} />
                    </Field>
                  );
                }}
              />

              <form.AppField
                name="degreeField"
                children={(field) => (
                  <field.TextField
                    label="Degree Field"
                    placeholder="Enter your degree field"
                  />
                )}
              />

              <form.AppField
                name="timeZone"
                children={(field) => {
                  const value = field.state.value || ""; // Ensures that value holds a string
                  const tzMeta = form.getFieldMeta("timeZone"); // Message is extracted from form's metadeta
                  const tzError = tzMeta?.errors?.[0]?.message; // Current validation error for timeZone

                  // Renders Dropdown & Options
                  return (
                    <Field className="space-y-2">
                      <FieldLabel className={`font-medium ${tzError ? "text-red-600" : ""}`}>
                        Time Zone
                      </FieldLabel>
                      <Select
                        value={value}
                        onValueChange={(v) => field.setValue(v)}
                      >
                        <SelectTrigger aria-invalid={!!tzError}>
                          <SelectValue placeholder="Select Time Zone" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="EDT">Eastern Daylight Time (GMT-4) – Washington</SelectItem>
                          <SelectItem value="CDT">Central Daylight Time (GMT-5) – Chicago</SelectItem>
                          <SelectItem value="MDT">Mountain Daylight Time (GMT-6) – Denver</SelectItem>
                          <SelectItem value="MST">Mountain Standard Time (GMT-7) – Phoenix</SelectItem>
                          <SelectItem value="PDT">Pacific Daylight Time (GMT-7) – Los Angeles</SelectItem>
                          <SelectItem value="AKDT">Alaska Daylight Time (GMT-8) – Anchorage</SelectItem>
                          <SelectItem value="HST">Hawaii–Aleutian Standard Time (GMT-10) – Honolulu</SelectItem>
                        </SelectContent>
                      </Select>
                      {tzError && (<p className="text-destructive !text-sm font-normal" role="alert">{tzError}</p>)}
                      <input type="hidden" name="timeZone" value={value} />
                    </Field>
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
