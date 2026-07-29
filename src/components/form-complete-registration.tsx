import { useAtomValue } from "jotai";
import {
  passwordDefaultValues,
  registrationDefaultValues,
} from "@/helpers/defaults";
import { passwordFields, registrationFields } from "@/helpers/fields";
import { withForm } from "@/hooks/form";
import {
  bypassIdpAtom,
  domainAtom,
  shouldShowPasswordFields,
} from "@/helpers/state";

import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Field } from "@/components/ui/field";
import { FieldGroupRegistration } from "@/components/field-group-registration";
import { FieldGroupPassword } from "@/components/field-group-password";

const FormCompleteRegistration = withForm({
  defaultValues: {
    ...registrationDefaultValues,
    ...passwordDefaultValues,
  },
  render: function Render({ form }) {
    const domain = useAtomValue(domainAtom);
    const bypassIdp = useAtomValue(bypassIdpAtom);
    const showPasswordFields = shouldShowPasswordFields(domain, bypassIdp);

    return (
      <form
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
      >
        <Card className="w-full">
          <CardContent>
            <FieldGroupRegistration
              form={form}
              fields={registrationFields}
              emailDisabled={true}
            />
            {showPasswordFields && (
              <FieldGroupPassword form={form} fields={passwordFields} />
            )}
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

export default FormCompleteRegistration;
