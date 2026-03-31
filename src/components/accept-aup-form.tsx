import * as React from "react";
import { withForm } from "@/hooks/form";
import {
  Card,
  CardHeader,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

import TermsAndConditionsBox from "@/components/terms-and-conditions-box";

const AcceptAupForm = withForm({
  defaultValues: { accepted: false },
  onSubmit: async () => {}, // route handles submission

  render: function Render({ form }) {
    return (
      <form.AppForm>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit(); //this triggers the route's useAppForm onSubmit
          }}
        >
          <Card className="w-full my-5 border-none rounded-none shadow-none bg-transparent bg-[var(--teal-050)]">
            <CardHeader className="text-lg font-bold font-archivo text-[24px]">
              Acceptable Use Policy
              <CardDescription className="font-normal">
                Please review and accept the ACCESS Acceptable Use Policy to
                continue.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              <React.Suspense
                fallback={<p>Loading Acceptable Use Policy...</p>}
              >
                <TermsAndConditionsBox />
              </React.Suspense>

              <form.AppField name="accepted">
                {(field) => (
                  <field.CheckboxField
                    label="I agree to abide by the ACCESS Acceptable Use Policy."
                    required
                  />
                )}
              </form.AppField>
            </CardContent>

            <CardFooter className="justify-start">
              <form.SubmitButton label="Continue" />
            </CardFooter>
          </Card>
        </form>
      </form.AppForm>
    );
  },
});

export default AcceptAupForm;
