import { withForm } from "@/hooks/form";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field, FieldGroup } from "@/components/ui/field";
import PasswordFormInputs from "./password-form-fields";

const PasswordChangeForm = withForm({
  defaultValues: {
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
              <PasswordFormInputs form={form} />
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