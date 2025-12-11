import { withForm } from "@/hooks/form";
// Imports for API interaction
import { useAtom } from "jotai";
import { countriesAtom, academicStatusesAtom } from "@/helpers/state";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field, FieldGroup } from "@/components/ui/field";

// Option type defines selectable options for form fields
type Option = { label: string; value: string };

// ROLE_OPTIONS defines selectable user roles
const INSTITUTION_OPTIONS: Option[] = [
  { value: "university_of_michigan", label: "University of Michigan" },
  { value: "university_of_slip_rock", label: "Slippery Rock University" },
  { value: "university_of_indiana", label: "IUP" },
];


const CompleteRegistrationForm = withForm({
  defaultValues: {
    first_name: "",
    last_name: "",
    email: "",
    institution: "",
    academic_status: "",
    residence_country: "",
    citizenship_country: "",
  },
  render: function Render({ form }) {
    // Fetching countries and academic status via atoms
    const [countries] = useAtom(countriesAtom);
    const [academicStatuses] = useAtom(academicStatusesAtom);

    // Mapping API response to Option
    const countryOptions: Option[] =
      countries.map((country) => ({
        value: country.countryId.toString(),
        label: country.countryName,
      }));

    const academicStatusOptions: Option[] =
      academicStatuses.map((status) => ({
        value: status.academicStatusId.toString(),
        label: status.name,
      }));


    return (
      <form
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
      >
        <Card className="w-full sm:max-w-md my-5">
          <CardHeader>
            <CardTitle>Complete Registration</CardTitle>
            <CardDescription>
              Please tell us about yourself to complete your registration.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <FieldGroup>
              <form.AppField
                name="first_name"
                children={(field) => (
                  <field.TextField
                    label="First Name"
                    placeholder="e.g., John"
                    required
                  />
                )}
              />
              <form.AppField
                name="last_name"
                children={(field) => (
                  <field.TextField
                    label="Last Name"
                    placeholder="e.g., Doe"
                    required
                  />
                )}
              />
              <form.AppField
                name="email"
                children={(field) => (
                  <field.TextField
                    label="Email Address"
                    placeholder="University or work email address"
                    required
                  />
                )}
              />
              <form.AppField
                name="institution"
                children={(field) => {
                  const value = field.state.value; // Ensures that value holds a string
                  return (
                    <field.DropdownSelectField
                      label="Institution"
                      name="institution"
                      value={value}
                      onChange={(v) => field.setValue(v ?? "")}
                      placeholder="Select your institution"
                      options={INSTITUTION_OPTIONS}
                      required
                    />
                  );
                }}
              />
              <form.AppField
                name="academic_status"
                children={(field) => {
                  const value = field.state.value; // Ensures that value holds a string
                  return (
                    <field.DropdownSelectField
                      label="Academic Status"
                      name="academic_status"
                      value={value}
                      onChange={(v) => field.setValue(v ?? "")}
                      placeholder="Select your academic status"
                      options={academicStatusOptions}
                      required
                    />
                  );
                }}
              />
              <form.AppField
                name="residence_country"
                children={(field) => {
                  const value = field.state.value; // Ensures that value holds a string
                  return (
                    <field.DropdownSelectField
                      label="Country of Residence"
                      name="residence_country"
                      value={value}
                      onChange={(v) => field.setValue(v ?? "")}
                      placeholder="Select your country of residence"
                      options={countryOptions}
                      required
                    />
                  );
                }}
              />
              <form.AppField
                name="citizenship_country"
                children={(field) => {
                  const value = field.state.value; // Ensures that value holds a string
                  return (
                    <field.DropdownSelectField
                      label="Country of Citizenship"
                      name="citizenship_country"
                      value={value}
                      onChange={(v) => field.setValue(v ?? "")}
                      placeholder="Select your country of citizenship"
                      options={countryOptions}
                      required
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

export default CompleteRegistrationForm;
