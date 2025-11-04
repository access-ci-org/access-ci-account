import { cn } from "@/lib/utils"
import { Field, FieldLabel } from "@/components/ui/field"
import { useFieldContext } from "@/hooks/form-context"
import {
  SelectField as BaseSelectField, // 👈 rename here
} from "@/components/ui/select"
import type { ActionMeta, SingleValue } from "react-select"

export type SelectFieldProps = {
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
 * A form-aware Select field that integrates with the Field context
 * and reuses the base Select component for consistent styling.
 */
export function SelectField({
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
}: SelectFieldProps) {
  // Pull field context from the surrounding form
  const field = useFieldContext<string>()

  // Map the form's string value to a matching { value, label } object
  const selectedOption =
    options.find((opt) => opt.value === field.state.value) ?? undefined

  // Handle select change — single-value only
  const handleChange = (
    newValue: SingleValue<{ value: string; label: string }>,
    _actionMeta: ActionMeta<{ value: string; label: string }>
  ) => {
    onChange?.(newValue ?? undefined)
    field.setValue(newValue?.value ?? "")
  }

  // Validation
  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
  const errorMessage = field.state.meta.errors?.[0]?.message

  return (
    <Field
      data-invalid={isInvalid}
      className={cn("flex flex-col gap-2", className)}
    >
      {title && <FieldLabel htmlFor={field.name}>{title}</FieldLabel>}

      {/* 👇 use the renamed BaseSelectField */}
      <BaseSelectField
        id={field.name}
        error={isInvalid ? errorMessage : undefined}
        options={options}
        value={selectedOption}
        defaultValue={defaultValue}
        onChange={handleChange}
        isClearable={isClearable}
        isSearchable={isSearchable}
        isDisabled={isDisabled}
        isLoading={isLoading}
        isRtl={isRtl}
      />
    </Field>
  )
}
