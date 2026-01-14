import { withForm } from "@/hooks/form";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field, FieldGroup, FieldDescription } from "@/components/ui/field";

const PasswordChangeForm = withForm({
  defaultValues: {
    currentPassword: "",
    newPassword: "",
    repeatedNewPassword: ""

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

              {/* New Password field captures user's new password*/}
              <form.AppField
                name="newPassword"
                children={(field) => (
                  <div className="flex flex-col">
                    <field.PasswordTextField
                      label="New Password"
                      placeholder="Please enter your new password."
                      required
                    />
                    <FieldDescription className="!mt-2 !text-xs leading-snug text-muted-foreground">
                      Your new password must be between 12 and 64 characters in length, and
                      include characters from three of the following: lowercase letters,
                      uppercase letters, numbers, and symbols. If you do not know your current
                      password, you can reset your password by email.
                    </FieldDescription>
                  </div>
                )}
              />

              {/* Repeat New Password field captures user's new password, again, confirming */}
              <form.AppField
                name="repeatedNewPassword"
                children={(field) => (
                  <field.PasswordTextField
                    label="Confirm Password"
                    placeholder="Please enter your new password."
                    required
                  />
                )}
              />

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
