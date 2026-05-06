import { withForm } from "@/hooks/form";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field } from "@/components/ui/field";
import { FieldGroupPassword } from "./field-group-password";
import { passwordFields } from "@/helpers/fields";

const FormPasswordChange = withForm({
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
            <CardTitle>Change your Password</CardTitle>
          </CardHeader>
          <CardContent>
            <FieldGroupPassword form={form} fields={passwordFields} />
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

export default FormPasswordChange;
