import { withForm } from "@/hooks/form"
import {
  Card,
  CardHeader,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card"

import React from "react"

import { useAtomValue } from "jotai"
import { termsAndConditionsLoadableAtom } from "@/helpers/state"
import DOMPurify from "dompurify"



const AcceptAupForm = withForm({
  defaultValues: {
    accepted: false,
  },

  render: function Render({ form }) {
  const termsLoadable = useAtomValue(termsAndConditionsLoadableAtom)

  // ✅ Derive terms in a way that doesn't change hook calls
  const terms = termsLoadable.state === "hasData" ? termsLoadable.data : null

  // ✅ Hook ALWAYS runs (same order every render)
  const sanitized = React.useMemo(() => {
    return DOMPurify.sanitize(terms?.body ?? "", { USE_PROFILES: { html: true } })
  }, [terms?.body])

  // ✅ Now it's safe to early-return
  if (termsLoadable.state === "loading") {
    return <p>Loading terms and conditions...</p>
  }

  if (termsLoadable.state === "hasError") {
    return <p className="text-red-600">Failed to load terms.</p>
  }

  // hasData
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
          <div className="h-64 overflow-y-auto border p-4 text-sm bg-white border-[var(--teal-700)]">
            {!terms ? (
              <p>No terms and conditions found.</p>
            ) : (
              <div
                className="
                  space-y-3
                  [&_p]:mb-3
                  [&_ol]:list-decimal
                  [&_ol]:pl-6
                  [&_li]:mb-2
                  [&_a]:text-[var(--teal-700)]
                  [&_a]:underline
                  [&_a]:underline-offset-2
                "
                dangerouslySetInnerHTML={{ __html: sanitized }}
              />
            )}
          </div>

          <form.AppField name="accepted">
            {(field) => (
              <field.CheckboxField
                label="I agree to abide by the ACCESS terms of service."
                required
              />
            )}
          </form.AppField>

          {/* ...rest unchanged... */}
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
