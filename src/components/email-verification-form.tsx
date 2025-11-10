import { withForm } from "@/hooks/form";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { FieldGroup } from "@/components/ui/field";

const VerifyEmailForm = withForm({
  defaultValues: {
    otp_code: "",
  },
  render: function Render({ form }) {
    return (
      <form
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
        className="w-full flex justify-center px-3 sm:px-0"
      >
        <Card
          className="
            w-full 
            max-w-[90%] sm:max-w-[26rem] md:max-w-[30rem] lg:max-w-[32rem]
            rounded-2xl border border-gray-200 shadow-md 
            mt-6 sm:mt-8
          "
        >
          <CardContent
            className="
              flex flex-col items-center text-center 
              px-4 sm:px-6 md:px-8 
              pt-8 pb-6 sm:pb-8 
              space-y-6
            "
          >
            <FieldGroup className="w-full flex flex-col items-center space-y-6">
              <form.AppField
                name="otp_code"
                children={(field) => (
                  <field.OTPField
                    name="otp_code"
                    label="Enter the 6-digit code"
                    length={6}
                    placeholder="Check your email for the verification code"
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
