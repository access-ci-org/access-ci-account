import { withForm } from "@/hooks/form";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { FieldGroup } from "@/components/ui/field";

const VerifyEmailForm = withForm({
  defaultValues: {
    otp: "",
  },
  render: function Render({ form }) {
    return (
      <form
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
        className="w-full flex justify-start px-3 sm:px-0"
      >
        <Card>
          <CardContent
            className="
              flex flex-col items-center text-center
              px-2 sm:px-4 md:px-6
              pt-8 pb-6 sm:pb-8
              space-y-6
            "
          >
            <FieldGroup className="w-full flex flex-col items-center space-y-6">
              <form.AppField
                name="otp"
                children={(field) => (
                  <field.OTPField
                    name="otp"
                    label="Enter the 6-digit code"
                    length={6}
                    placeholder="Check your email for the verification code."
                  />
                )}
              />
            </FieldGroup>
          </CardContent>

          <CardFooter className="flex justify-center items-center w-full pb-6 sm:pb-8 pt-0">
            <form.AppForm>
              <div className="w-44 sm:w-48 md:w-56 flex justify-center">
                <form.SubmitButton label="Continue" />
              </div>
            </form.AppForm>
          </CardFooter>
        </Card>
      </form>
    );
  },
});

export default VerifyEmailForm;
