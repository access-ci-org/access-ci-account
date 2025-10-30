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
        <Card className="w-full sm:max-w-md my-5">
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
                children={(field) => (
                  <field.TextField
                    label="Which user persona at ACCESS best describes you:"
                    placeholder=""
                  />
                )}
              />

              <form.AppField
                name="degree"
                children={(field) => (
                  <field.TextField
                    label="Degree"
                    placeholder=""
                  />
                )}
              />
              
              <form.AppField
                name="degreeField"
                children={(field) => (
                  <field.TextField
                    label="Degree Field"
                    placeholder=""
                  />
                )}
              />

              <form.AppField
                name="timeZone"
                children={(field) => (
                  <field.TextField
                    label="Time Zone"
                    placeholder=""
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

export default ProfileForm;
