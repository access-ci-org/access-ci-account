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
                  
                  const error = (field.state as any).error?.message;
                  return (
                    <SelectCard
                      title="Organization or Institution"
                      options={options}
                      value={selectedOption} // {value, label} | undefined
                      onChange={(val) => {
                        field.setValue(val?.value ?? "");
                        
                      }}
                      error={error}
                    />
                  );
                }}
              />
              <form.AppField
                name="academic_status"
                children={(field) => {
                  const options = [
                    { value: "Graduate", label: "Graduate" },
                    { value: "good_standing", label: "Good Standing" },
                    { value: "post_graduate", label: "Post Graduate" },
                  ];

                  // Map string value from form to {value, label} object
                  const selectedOption = options.find((o) => o.value === field.state.value) ?? undefined;

                  return (
                    <SelectCard
                      title="Academic Status"
                      options={options}
                      value={selectedOption} // {value, label} | undefined
                      onChange={(val) => field.setValue(val?.value ?? "")}
                    />
                  );
                }}
              />
              <form.AppField
                name="residence_country"
                children={(field) => {
                  const options = [
                    { value: "united_states", label: "United States" },
                    { value: "england", label: "England" },
                    { value: "mexico", label: "Mexico" },
                  ];

                  // Map string value from form to {value, label} object
                  const selectedOption = options.find((o) => o.value === field.state.value) ?? undefined;

                  return (
                    <SelectCard
                      title="Country of Residence"
                      options={options}
                      value={selectedOption} // {value, label} | undefined
                      onChange={(val) => field.setValue(val?.value ?? "")}
                    />
                  );
                }}
              />
              <form.AppField
                name="citizenship_country"
                children={(field) => {
                  const options = [
                    { value: "united_states", label: "United States" },
                    { value: "england", label: "England" },
                    { value: "mexico", label: "Mexico" },
                  ];

                  // Map string value from form to {value, label} object
                  const selectedOption = options.find((o) => o.value === field.state.value) ?? undefined;

                  return (
                    <SelectCard
                      title="Country of Citizenship"
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
