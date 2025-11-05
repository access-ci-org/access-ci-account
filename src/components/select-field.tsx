import { cn } from "@/lib/utils"
import { Field, FieldLabel } from "@/components/ui/field"
import { useFieldContext } from "@/hooks/form-context"
import { SelectField as BaseSelectField } from "@/components/ui/select"
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
  const field = useFieldContext<string>()
  const selectedOption =
    options.find((opt) => opt.value === field.state.value) ?? undefined

  const handleChange = (
    newValue: SingleValue<{ value: string; label: string }>,
    _actionMeta: ActionMeta<{ value: string; label: string }>
  ) => {
    onChange?.(newValue ?? undefined)
    field.setValue(newValue?.value ?? "")
  }

  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
  const errorMessage = field.state.meta.errors?.[0]?.message

  return (
    <Field
      data-invalid={isInvalid}
      className={cn("flex flex-col gap-2", className)}
    >
      {title && <FieldLabel htmlFor={field.name}>{title}</FieldLabel>}

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
        className="text-sm md:text-base leading-snug"
        styles={{
          control: (base, state) => ({
            ...base,
            fontSize: "1rem",
            "@media (min-width: 768px)": {
              fontSize: "0.875rem",
            },
            borderColor: isInvalid
              ? "rgb(220, 38, 38)"
              : state.isFocused
              ? "#d1d5db"
              : "#e5e7eb",
            boxShadow: state.isFocused
              ? "0 0 0 2px rgba(182, 182, 182, 0.5)"
              : "none",
            "&:hover": {
              borderColor: isInvalid
                ? "rgb(220, 38, 38)"
                : state.isFocused
                ? "#d1d5db"
                : "#d1d5db",
              boxShadow: state.isFocused
                ? "0 0 0 2px rgba(182, 182, 182, 0.5)"
                : "none",
            },
            transition: "border-color 0.15s ease, box-shadow 0.15s ease",
          }),
        }}
      />
    </Field>
  )
}
