import Select from "react-select"
import { cn } from "@/lib/utils"
import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { useFieldContext } from "@/hooks/form-context"

export type SelectCardProps = {
  title?: string
  description?: string
  options: { value: string; label: string }[]
  value?: { value: string; label: string }
  defaultValue?: { value: string; label: string }
  onChange?: (val: { value: string; label: string } | undefined) => void
  isClearable?: boolean
  isSearchable?: boolean
  isDisabled?: boolean
  isLoading?: boolean
  isRtl?: boolean
  className?: string
}

/**
 * A Select dropdown field that pulls its value and validation state from the form context.
 */
export function SelectCard({
  title = "Select Option",
  options,
  defaultValue,
  onChange,
  isClearable = true,
  isSearchable = true,
  isDisabled = false,
  isLoading = false,
  isRtl = false,
  className,
}: SelectCardProps) {
  // Pull field context from the surrounding form
  const field = useFieldContext<string>()

  // Map string value from form to {value, label} object
  const selectedOption = options.find((o) => o.value === field.state.value) ?? undefined

  const handleChange = (val: any) => {
    if (onChange) onChange(val ?? undefined)

    // Sync with form field
    field.setValue(val?.value ?? "")
  }

  // Determine invalid state and pull first validation error if it exists
  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
  const errorMessage = field.state.meta.errors?.[0]?.message

  return (
    <Field data-invalid={isInvalid} className={cn("flex flex-col gap-2", className)}>
      {title && <FieldLabel htmlFor={field.name}>{title}</FieldLabel>}
      <div className="text-foreground">
        <Select
          id={field.name}
          classNamePrefix="select"
          value={selectedOption}
          defaultValue={defaultValue}
          onChange={handleChange}
          isClearable={isClearable}
          isSearchable={isSearchable}
          isDisabled={isDisabled}
          isLoading={isLoading}
          isRtl={isRtl}
          options={options}
          styles={{
            control: (base) => ({
              ...base,
              borderRadius: "0.5rem",
              borderWidth: "1px",
              borderStyle: "solid",
              borderColor: isInvalid
                ? "hsl(var(--destructive)) !important"
                : "hsl(var(--border)) !important",
              boxShadow: "none",
              "&:hover": {
                borderColor: isInvalid
                  ? "hsl(var(--destructive)) !important"
                  : "hsl(var(--primary))  !important",
              },
            }),
          }}
        />
      </div>
      {isInvalid && <FieldError>{errorMessage}</FieldError>}
    </Field>
  )
}
