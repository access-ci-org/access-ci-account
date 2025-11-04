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
                children={(field) => (
                  <field.SelectField
                    title = "Organization or Institution"
                    options = {[
                      { value: "university_of_michigan", label: "University of Michigan" },
                      { value: "university_of_slip_rock", label: "Slippery Rock University" },
                      { value: "university_of_indiana", label: "IUP" },
                    ]}
                  />
                )}
              />
              <form.AppField
                name="academic_status"
                children={(field) => (
                  <field.SelectField
                    title = "Academic Status"
                    options = {[
                      { value: "Graduate", label: "Graduate" },
                      { value: "good_standing", label: "Good Standing" },
                      { value: "post_graduate", label: "Post Graduate" },
                    ]}
                  />
                )}
              />
              <form.AppField
                name="residence_country"
                children={(field) => (
                  <field.SelectField
                    title="Country of Residence"
                    options={[
                      { value: "united_states", label: "United States" },
                      { value: "england", label: "England" },
                      { value: "mexico", label: "Mexico" },
                    ]}
                  />
                )}
              />
              <form.AppField
                name="citizenship_country"
                children={(field) => (
                  <field.SelectField
                    title="Country of Citizenship"
                    options={[
                      { value: "united_states", label: "United States" },
                      { value: "england", label: "England" },
                      { value: "mexico", label: "Mexico" },
                    ]}
                  />
                )}
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
