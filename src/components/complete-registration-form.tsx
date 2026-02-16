import { withForm } from "@/hooks/form";

import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Field, FieldGroup } from "@/components/ui/field";

// Importing form input field for Registration Form
import RegistrationFormInputs from "./registration-form-fields";

const CompleteRegistrationForm = withForm({
  defaultValues: {
    firstName: "",
    lastName: "",
    email: "",
    institution: 0,
    academicStatus: 0,
    residenceCountry: 0,
    citizenshipCountryIds: [] as number[],
  },
  render: function Render({ form }) {
    return (
      <form
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
      >
        <Card className="w-full my-5 border-none rounded-none shadow-none bg-(--teal-050)]">
          <CardContent>
            <FieldGroup>
              <RegistrationFormInputs
                form={form as any}
                isRegistration={true}
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
