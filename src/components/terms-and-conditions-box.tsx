import * as React from "react"
import { useAtomValue } from "jotai"
import DOMPurify from "dompurify"
import { termsAndConditionsAtom } from "@/helpers/state"

export default function TermsAndConditionsBox() {
  const terms = useAtomValue(termsAndConditionsAtom)

  const sanitized = React.useMemo(() => {
    return DOMPurify.sanitize(terms?.body ?? "", { USE_PROFILES: { html: true } })
  }, [terms?.body])

  return (
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
  )
}