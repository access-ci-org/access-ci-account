import * as React from "react";
import { useStore } from "@tanstack/react-form";
import { withForm } from "@/hooks/form";
import { useWarnBeforeUnload } from "@/hooks/use-warn-before-unload";
import {
  Card,
  CardHeader,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

import TermsAndConditionsBox from "@/components/terms-and-conditions-box";

const FormAcceptAup = withForm({
  defaultValues: { accepted: false },
  onSubmit: async () => {}, // route handles submission

  render: function Render({ form }) {
    // Creating the account can take a while. Leaving or reloading the page
    // part-way can leave a half-created account, so say so and warn.
    const isSubmitting = useStore(form.store, (s) => s.isSubmitting);
    useWarnBeforeUnload(isSubmitting);

    return (
      <form.AppForm>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit(); //this triggers the route's useAppForm onSubmit
          }}
        >
          <Card>
            <CardHeader className="sr-only">
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
                  <field.FieldCheckbox
                    label="I agree to abide by the ACCESS Acceptable Use Policy."
                    required
                  />
                )}
              </form.AppField>
            </CardContent>

            <CardFooter className="flex-col items-start gap-2">
              <form.SubmitButton label="Continue" />
              <p role="status" className="text-sm">
                {isSubmitting &&
                  "Creating your account. This can take up to 30 seconds. Please don't close or refresh this page."}
              </p>
            </CardFooter>
          </Card>
        </form>
      </form.AppForm>
    );
  },
});

export default FormAcceptAup;
