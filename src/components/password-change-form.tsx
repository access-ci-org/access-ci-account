import { withForm } from "@/hooks/form";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field, FieldGroup } from "@/components/ui/field";
import PasswordFormFields from "./password-form-fields";

const PasswordChangeForm = withForm({
  defaultValues: {
    currentPassword: "",
    password: "",
    confirmPassword: "",
  },
  render: function Render({ form }) {
    return (
      <form
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
      >
        <Card className="w-full mb-20">
          <CardHeader>
            <CardTitle>Change your Password </CardTitle>
          </CardHeader>
          <CardContent>
            <FieldGroup>
              {/* Password field captures the user's current password */}
              <form.AppField
                name="currentPassword"
                children={(field) => (
                  <field.PasswordTextField
                    label="Current Password"
                    placeholder="Please enter your current password."
                    required
                  />
                )}
              />

              <PasswordFormFields form={form} />

            </FieldGroup>
          </CardContent>
          <CardFooter>
            <Field orientation="horizontal">
              <form.AppForm>
                <form.SubmitButton label="Update Password" />
              </form.AppForm>
            </Field>
          </CardFooter>
        </Card>
      </form>
    );
  },
});

export default PasswordChangeForm;
