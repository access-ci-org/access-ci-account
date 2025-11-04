import * as React from "react"
import Select from "react-select"
import type { Props as ReactSelectProps } from "react-select"
import { cn } from "@/lib/utils"


export type SelectProps<Option = any> = ReactSelectProps<Option, false> & {
  label?: string
  error?: string
  className?: string
}

function SelectContainer({
  className,
  ...props
}: React.ComponentProps<"div"> & { "data-invalid"?: boolean }) {
  return (
    <div
      data-slot="select-container"
      {...props}
      className={cn(
        "flex flex-col gap-2 text-foreground",
        props["data-invalid"] && "border border-destructive rounded-md p-1",
        className
      )}
    />
  )
}


function SelectLabel({
  className,
  ...props
}: React.ComponentProps<"label">) {
  return (
    <label
      data-slot="select-label"
      className={cn("text-sm font-medium", className)}
      {...props}
    />
  )
}


function SelectError({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  if (!children) return null

  return (
    <div
      role="alert"
      data-slot="select-error"
      className={cn("text-destructive text-sm font-normal", className)}
      {...props}
    >
      {children}
    </div>
  )
}

function SelectField<Option>({
  label,
  error,
  className,
  ...props
}: SelectProps<Option>) {
  return (
    <SelectContainer className={className}>
      {label && <SelectLabel>{label}</SelectLabel>}

      <Select<Option, false>
        classNamePrefix="select"  // 👈 important
        classNames={{
          control: (state) =>
            cn(
              "rounded-md border border-input bg-background text-foreground shadow-sm focus:border-ring focus:ring-1 focus:ring-ring",
              state.isDisabled && "opacity-50 cursor-not-allowed"
            ),
          menu: () =>
            "z-50 mt-1 bg-popover border border-border rounded-md shadow-md",
          option: (state) =>
            cn(
              "px-3 py-1.5 text-sm cursor-pointer text-foreground",
              state.isSelected && "bg-primary text-primary-foreground",
              !state.isSelected &&
                "hover:bg-accent hover:text-accent-foreground"
            ),
          placeholder: () => "text-muted-foreground",
        }}
        styles={{
          singleValue: (base) => ({
            ...base,
            color: "hsl(var(--foreground))",
          }),
          input: (base) => ({
            ...base,
            color: "hsl(var(--foreground))",
          }),
          placeholder: (base) => ({
            ...base,
            color: "hsl(var(--muted-foreground))",
          }),
        }}
        {...props}
      />

      {error && <SelectError>{error}</SelectError>}
    </SelectContainer>
  )
}



export {
  SelectField,
  SelectContainer,
  SelectLabel,
  SelectError,
}
