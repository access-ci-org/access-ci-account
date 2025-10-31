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
import {  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,} from "@/components/ui/select";

const ProfileForm = withForm({
  defaultValues: {
    email: "",
    role: [] as string[],
    degree: [] as string[],
    degreeField: "",
    timeZone: [] as string[],
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
                name= "role"
                children={() => {
                  // Role Options
                  const roleOptions = [
                    "Researcher",
                    "Educator",
                    "Graduate Student",
                    "Resource Provider",
                    "Cyberinfrastructure (CI) Community Member",
                  ];
          
                  // Renders Checkboxes & Options 
                  return (
                    <fieldset className="space-y-2">
                      <legend className="text-sm mb-4">
                        Which user person role at ACCESS best describes you:
                      </legend>
                      <div className="flex flex-wrap items-center gap-4">
                      {/* Loops through array and displays options */}
                        {roleOptions.map((option) => (
                          <label key={option} className="inline-flex items-center gap-2 text-sm">
                            {/* Renders Checkbox UI element */}
                            <Checkbox/>
                            {/* Shows options from roleOptions */}
                            <span>{option}</span>
                          </label>
                        ))}
                      </div>
                    </fieldset>
                  );
                }}
              />


              <form.AppField
                name="degree"
                children={() => {
                  // Degree Options
                  const degreeOptions = [
                    "Bachelors",
                    "Masters",
                    "Ph.D.",
                    "Graduate Certificate",
                  ];

                  // Renders Dropdown & Options
                  return (
                    <Field className="space-y-2">
                      <FieldLabel className="font-medium">Degree</FieldLabel>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select degree level" />
                        </SelectTrigger>
                        <SelectContent>
                          {degreeOptions.map((option) => (
                            <SelectItem key={option} value={option}>
                              {option}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
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
              children={() => {
                // Time Zone Options
                const timeZoneOptions = [
                  "Eastern Daylight Time, Washington,  (GMT-4)",
                  "Centeral Daylight Time, Chicago, (GMT-5)",
                  "Mountain Daylight Time, Denver, (GMT-6)",
                  "Mountain Standard Time, Phoenix, (GMT-7)",
                  "Pacific Daylight Time, Los Angeles, (GMT-7)",
                  "Alaska Daylight Time, Anchorage,  (GMT-8)",
                  "Hawaii-Aleutian Standard Time, Honolulu, (GMT-10)",
                ];

                // Renders Dropdown & Options
                return (
                  <Field className="space-y-2">
                    <FieldLabel className="font-medium">Time Zone</FieldLabel>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Time Zone" />
                      </SelectTrigger>
                      <SelectContent>
                        {timeZoneOptions.map((option) => (
                          <SelectItem key={option} value={option}>
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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
