import { useFieldContext } from "@/hooks/form-context";

import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import type React from "react";
import { cn } from "@/lib/utils";
import { Textarea } from "./ui/textarea";

export default function FieldText({
  className = "",
  description = "",
  disabled = false,
  fieldType = "input",
  label,
  placeholder,
  required = false,
  rows,
}: {
  className?: string;
  description?: React.ReactNode;
  disabled?: boolean;
  fieldType?: "input" | "textarea";
  label: React.ReactNode;
  placeholder: string;
  required?: boolean;
  rows?: number;
}) {
  const field = useFieldContext<string>();
  const hasMountError = !!field.state.meta.errorMap.onMount;
  const isInvalid =
    (field.state.meta.isTouched || hasMountError) && !field.state.meta.isValid;
  return (
    <Field data-invalid={isInvalid}>
      <FieldLabel required={required} htmlFor={field.name}>
        {label}
      </FieldLabel>
      {fieldType === "textarea" ? (
        <Textarea
          id={field.name}
          name={field.name}
          value={field.state.value}
          onBlur={field.handleBlur}
          onChange={(e) => field.handleChange(e.target.value)}
          aria-invalid={isInvalid}
          placeholder={placeholder}
          autoComplete="off"
          rows={rows}
          className={cn(
            "bg-white border-[var(--teal-700)] rounded-none shadow-none",
            className,
          )}
          disabled={disabled}
        />
      ) : (
        <Input
          id={field.name}
          name={field.name}
          value={field.state.value}
          onBlur={field.handleBlur}
          onChange={(e) => field.handleChange(e.target.value)}
          aria-invalid={isInvalid}
          placeholder={placeholder}
          autoComplete="off"
          className={cn(
            "bg-white border-[var(--teal-700)] rounded-none shadow-none",
            className,
          )}
          disabled={disabled}
        />
      )}
      {isInvalid && <FieldError errors={field.state.meta.errors} />}
      {description && <FieldDescription>{description}</FieldDescription>}
    </Field>
  );
}
