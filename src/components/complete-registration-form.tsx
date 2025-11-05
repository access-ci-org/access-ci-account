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

// Option type defines selectable options for form fields
type Option = { label: string; value: string };

// ROLE_OPTIONS defines selectable user roles
const INSTITUTION_OPTIONS: Option[] = [
  { value: "university_of_michigan", label: "University of Michigan" },
  { value: "university_of_slip_rock", label: "Slippery Rock University" },
  { value: "university_of_indiana", label: "IUP" },
];

const COUNTRY_OPTIONS: Option[] = [
  { value: "us", label: "United States" },
  { value: "ca", label: "Canada" },
  { value: "mx", label: "Mexico" },
];
const ACADEMIC_STATUS_OPTIONS: Option[] = [
  { value: "undergraduate_student", label: "Undergraduate Student" },
  { value: "graduate_student", label: "Graduate Student" },
  { value: "faculty", label: "Faculty" },
  { value: "staff", label: "Staff" },
  { value: "other", label: "Other" },
];
const CITIZENSHIP_COUNTRY_OPTIONS: Option[] = COUNTRY_OPTIONS;


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
                    label= {
                      <>
                        First Name <span className="text-red-500 ml-0.5">*</span>
                      </>
                    }
                    placeholder="e.g., John"
                  />
                )}
              />
              <form.AppField
                name="last_name"
                children={(field) => (
                  <field.TextField
                    label= {
                      <>
                        Last Name <span className="text-red-500 ml-0.5">*</span>
                      </>
                    }
                    placeholder="e.g., Doe"
                  />
                )}
              />
              <form.AppField
                name="email"
                children={(field) => (
                  <field.TextField
                    label= {
                      <>
                        Email Address <span className="text-red-500 ml-0.5">*</span>
                      </>
                    }
                    placeholder="University or work email address"
                  />
                )}
              />
              <form.AppField
                name="institution"
                children={(field) => {
                  const value = field.state.value; // Ensures that value holds a string
                  return (
                    <field.LabeledSelect
                      label= {
                        <>
                          Institution <span className="text-red-500 ml-0.5">*</span>
                        </>
                      }
                      name="institution"
                      value={value}
                      onChange={(v) => field.setValue(v ?? "")}
                      placeholder="Select your institution"
                      options={INSTITUTION_OPTIONS}
                    />
                  );
                }}
              />
              <form.AppField
                name="academic_status"
                children={(field) => {
                  const value = field.state.value; // Ensures that value holds a string
                  return (
                    <field.LabeledSelect
                      label= {
                        <>
                          Academic Status <span className="text-red-500 ml-0.5">*</span>
                        </>
                      }
                      name="academic_status"
                      value={value}
                      onChange={(v) => field.setValue(v ?? "")}
                      placeholder="Select your academic status"
                      options={ACADEMIC_STATUS_OPTIONS}
                    />
                  );
                }}
              />
              <form.AppField
                name="residence_country"
                children={(field) => {
                  const value = field.state.value; // Ensures that value holds a string
                  return (
                    <field.LabeledSelect
                      label= {
                        <>
                          Country of Residence <span className="text-red-500 ml-0.5">*</span>
                        </>
                      }
                      name="residence_country"
                      value={value}
                      onChange={(v) => field.setValue(v ?? "")}
                      placeholder="Select your country of residence"
                      options={COUNTRY_OPTIONS}
                    />
                  );
                }}
              />
              <form.AppField
                name="citizenship_country"
                children={(field) => {
                  const value = field.state.value; // Ensures that value holds a string
                  return (
                    <field.LabeledSelect
                      label= {
                        <>
                          Country of Citizenship <span className="text-red-500 ml-0.5">*</span>
                        </>
                      }
                      name="citizenship_country"
                      value={value}
                      onChange={(v) => field.setValue(v ?? "")}
                      placeholder="Select your country of citizenship"
                      options={CITIZENSHIP_COUNTRY_OPTIONS}
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
