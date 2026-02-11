import * as React from "react"
import { withForm } from "@/hooks/form"
import { useAtomValue, useSetAtom } from "jotai"
import {
  Card,
  CardHeader,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card"

import { registrationDataAtom } from "@/helpers/registration-data"
import { usernameAtom } from "@/helpers/state"
import { useNavigate } from "@tanstack/react-router"

import TermsAndConditionsBox from "@/components/terms-and-conditions-box"

const AcceptAupForm = withForm({
  defaultValues: { accepted: false },

  render: function Render({ form }) {
    return (
      <form
        onSubmit={(e) => {
          e.preventDefault()
          form.handleSubmit()
        }}
      >
        <Card className="w-full my-5 border-none rounded-none shadow-none bg-transparent bg-[var(--teal-050)]">
          <CardHeader className="text-lg font-bold font-archivo text-[24px]">
            Acceptable Use Policy
            <CardDescription className="font-normal">
              Please review and accept the ACCESS terms of service to continue.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <React.Suspense fallback={<p>Loading terms and conditions...</p>}>
              <TermsAndConditionsBox />
            </React.Suspense>

            <form.AppField name="accepted">
              {(field) => (
                <field.CheckboxField
                  label="I agree to abide by the ACCESS terms of service."
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
    )
  },
})

export default AcceptAupForm

