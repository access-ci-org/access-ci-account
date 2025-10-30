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

import { SelectCard } from "@/components/ui/select-card"

const CompleteRegistrationForm = withForm({
  defaultValues: {
    first_name: "",
    last_name: "",
    email: "",
    institution: "",
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
                    label="First Name"
                    placeholder="e.g., John"
                  />
                )}
              />
              <form.AppField
                name="last_name"
                children={(field) => (
                  <field.TextField
                    label="Last Name"
                    placeholder="e.g., Doe"
                  />
                )}
              />
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
                name="institution"
                children={(field) => {
                  const options = [
                    { value: "university_of_michigan", label: "University of Michigan" },
                    { value: "university_of_slip_rock", label: "Slippery Rock University" },
                    { value: "university_of_indiana", label: "IUP" },
                  ];

                  // Map string value from form to {value, label} object
                  const selectedOption = options.find((o) => o.value === field.state.value) ?? undefined;

                  return (
                    <SelectCard
                      title="Organization or Institution"
                      options={options}
                      value={selectedOption} // {value, label} | undefined
                      onChange={(val) => field.setValue(val?.value ?? "")}
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
