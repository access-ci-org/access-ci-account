import { withForm } from "@/hooks/form"
import {
  Card,
  CardHeader,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card"


const AcceptAupForm = withForm({
  defaultValues: {
    accepted: false,
  },

  render: function Render({ form }) {
    return (
      <form
        onSubmit={(e) => {
          e.preventDefault()
          form.handleSubmit()
        }}
      >
        <Card className="w-full my-5 border-none rounded-none shadow-none bg-transparent bg-[var(--teal-050)]">
          <CardHeader className= "text-lg font-bold">
              Acceptable Use Policy
              <CardDescription className = "font-normal">
              Please review and accept the ACCESS terms of service to continue.
              </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
              {/* Scrollable AUP text */}
              <div className="h-64 overflow-y-auto border p-4 text-sm bg-white border-[var(--teal-700)]">
              
              </div>

              {/* Checkbox */}
              <form.AppField name="accepted">
                  {(field) => (
                      <field.CheckboxField
                      label="I agree to abide by the ACCESS terms of service."
                      required
                      />
                  )}
                  </form.AppField>
              <CardDescription className="text-sm text-black">
                When using ACCESS services or interacting with the ACCESS community, you must
                also adhere to the{" "}
                <a
                  href="https://access-ci.org/privacy-policy/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[var(--teal-700)] underline underline-offset-2 hover:opacity-80"
                >
                  Privacy Policy
                </a>{" "}
                and the{" "}
                <a
                  href="https://access-ci.org/code-of-conduct/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[var(--teal-700)] underline underline-offset-2 hover:opacity-80"
                >
                  Code of Conduct
                </a>
                .
              </CardDescription>
          </CardContent>

          <CardFooter className="justify-start">
              <form.AppForm>
              <form.SubmitButton label="Continue" />
              </form.AppForm>
          </CardFooter>
        </Card>
      </form>
    )
  },
})

export default AcceptAupForm
