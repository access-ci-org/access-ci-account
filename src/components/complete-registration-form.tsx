import { withForm } from "@/hooks/form";

import {
  Card,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Field, FieldGroup } from "@/components/ui/field";

// Importing form input field for Registration Form
import RegistrationFormInputs from "./registration-form-fields";

const CompleteRegistrationForm = withForm({
  defaultValues: {
    firstName: "",
    lastName: "",
    email: "",
    institution: "",
    academicStatus: "",
    residenceCountry: "",
    citizenshipCountry: "",
  },
  render: function Render({ form }) {
    return (
      <form
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
      >
        <Card className="w-full my-5 border-none rounded-none shadow-none bg-transparent bg-[var(--teal-050)]">
          <CardContent>
            <FieldGroup>
              <RegistrationFormInputs form={form as any} />
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
