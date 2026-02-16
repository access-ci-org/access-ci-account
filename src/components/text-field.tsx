import { useFieldContext } from "@/hooks/form-context";

import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import type React from "react";

export default function TextField({
  label,
  placeholder,
  required = false,
  disabled = false,
}: {
  label: React.ReactNode;
  placeholder: string;
  required?: boolean;
  disabled?: boolean;
}) {
  const field = useFieldContext<string>();

  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
  return (
    <Field data-invalid={isInvalid}>
      <FieldLabel required={required} htmlFor={field.name}>
        {label}
      </FieldLabel>
      <Input
        id={field.name}
        name={field.name}
        value={field.state.value}
        onBlur={field.handleBlur}
        onChange={(e) => field.handleChange(e.target.value)}
        aria-invalid={isInvalid}
        placeholder={placeholder}
        autoComplete="off"
        className="bg-white border-[var(--teal-700)] rounded-none shadow-none"
        disabled={disabled}
      />
      {isInvalid && <FieldError errors={field.state.meta.errors} />}
    </Field>
  );
}
