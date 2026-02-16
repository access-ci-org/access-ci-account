import { useFormContext } from "@/hooks/form-context"
import { Button } from "./ui/button"
import { LoaderCircle } from "lucide-react"

type SubmitButtonProps = {
  label: string
  submittingLabel?: string
}

export default function SubmitButton({
  label,
  submittingLabel = "Loading...",
}: SubmitButtonProps) {
  const form = useFormContext()

  return (
    <form.Subscribe selector={(state) => state.isSubmitting}>
      {(isSubmitting) => (
        <Button
          type="submit"
          disabled={isSubmitting}
          className="
            bg-[var(--teal-700)] text-white rounded-none border border-[var(--teal-700)]
            min-w-[144px]
            py-4 px-6
            text-[24px] font-archivo font-bold uppercase tracking-wide
            flex items-center justify-center gap-2
            disabled:opacity-50 disabled:cursor-not-allowed
            hover:bg-white hover:text-[var(--teal-700)] hover:border-[var(--teal-700)]
          "
        >
          {isSubmitting ? (
            <>
              <LoaderCircle className="h-5 w-5 animate-spin" />
              {submittingLabel}
            </>
          ) : (
            label
          )}
        </Button>
      )}
    </form.Subscribe>
  )
}
