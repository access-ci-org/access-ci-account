import * as React from "react"
import Select from "react-select"
import { cn } from "@/lib/utils"

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

export function SelectCard({
  title = "Select Option",
  options,
  value: propValue,
  defaultValue,
  onChange,
  isClearable = true,
  isSearchable = true,
  isDisabled = false,
  isLoading = false,
  isRtl = false,
  className,
}: SelectCardProps) {
  const [internalValue, setInternalValue] = React.useState(defaultValue)
  const value = propValue ?? internalValue

  const handleChange = (val: any) => {
    if (onChange) onChange(val ?? undefined)
    else setInternalValue(val ?? undefined)
  }

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      {title && <label className="text-sm font-medium text-foreground">{title}</label>}
      <Select
        classNamePrefix="select"
        value={value}
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
            borderColor: "hsl(var(--border))",
            boxShadow: "none",
            "&:hover": { borderColor: "hsl(var(--primary))" },
          }),
        }}
      />

      {value && (
        <div className="text-sm text-muted-foreground">
          Selected: <span className="font-medium text-foreground">{value.label}</span>
        </div>
      )}
    </div>
  )
}