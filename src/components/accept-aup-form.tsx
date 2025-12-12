import { withForm } from "@/hooks/form"
import {
  Card,
  CardHeader,
  CardTitle,
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
        <Card className="w-full max-w-lg">
            <div className="min-h-screen bg-[var(--teal-050)] py-12">
                <CardHeader>
                    <CardTitle>Acceptable Use Policy</CardTitle>
                    <CardDescription>
                    Please review and accept the ACCESS terms of service to continue.
                    </CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                    {/* Scrollable AUP text */}
                    <div className="h-64 overflow-y-auto border rounded-md p-4 text-sm">
                    {/* fetched terms text goes here */}
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
                </CardContent>

                <CardFooter className="justify-end">
                    <form.AppForm>
                    <form.SubmitButton label="Continue" />
                    </form.AppForm>
                </CardFooter>
            </div>
        </Card>
      </form>
    )
  },
})

export default AcceptAupForm
