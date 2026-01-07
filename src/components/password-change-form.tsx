import { withForm} from "@/hooks/form";

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
              <CardDescription>Your new password must be between 12 and 64 characters in length, and include characters from three of the following: lowercase letters, uppercase letters, numbers, and symbols.</CardDescription>
            </CardHeader>
            <CardContent>
              <FieldGroup>
                {/* Password field captures the user's current password */}
                <form.AppField
                  name="currentPassword"
                  children={(field) => (
                    <field.TextField
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
                    <field.TextField
                      label="New Password"
                      placeholder="Please enter your new password."
                      required
                    />
                  )}
                />


                {/* Repeat New Password field captures user's new password, again, confirming */}
                <form.AppField
                  name="newPassword"
                  children={(field) => (
                    <field.TextField
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
                  <form.SubmitButton label="Update Password"/>
                </form.AppForm>
              </Field>
            </CardFooter>
          </Card>
        </form>
      );
    },
  });
  
  export default ProfileForm;
  