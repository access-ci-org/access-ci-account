import { withForm } from "@/hooks/form";
import {
  Card,
  CardHeader,
  CardDescription,
  CardContent,
  CardFooter,
  CardTitle,
} from "@/components/ui/card";
import TermsAndConditionsBox from "@/components/terms-and-conditions-box";

const AcceptAupForm = withForm({
  defaultValues: { accepted: false },

  render: function Render({ form }) {
    return (
      <form
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Review Acceptable Use Profile</CardTitle>
            <CardDescription>
              Please review and accept the ACCESS acceptable use policy to
              continue.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <TermsAndConditionsBox />

            <form.AppField name="accepted">
              {(field) => (
                <field.CheckboxField
                  label="I agree to abide by the ACCESS acceptable use policy."
                  required
                />
              )}
            </form.AppField>

            {/* privacy policy / code of conduct text unchanged */}
          </CardContent>

          <CardFooter className="justify-start">
            <form.AppForm>
              <form.SubmitButton label="Continue" />
            </form.AppForm>
          </CardFooter>
        </Card>
      </form>
    );
  },
});

export default AcceptAupForm;
