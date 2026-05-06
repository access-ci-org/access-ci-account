import { useFieldContext } from "@/hooks/form-context";
import type React from "react";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";

import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";

export default function FieldPassword({
  className = "",
  description = "",
  label,
  placeholder,
  required = false,
}: {
  className?: string;
  description?: React.ReactNode;
  label: React.ReactNode;
  placeholder: string;
  required?: boolean;
}) {
  const field = useFieldContext<string>();
  const [showPassword, setShowPassword] = useState(false);

  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
  return (
    <Field data-invalid={isInvalid}>
      <FieldLabel required={required} htmlFor={field.name}>
        {label}
      </FieldLabel>
      <div className="relative">
        <Input
          id={field.name}
          name={field.name}
          value={field.state.value}
          onBlur={field.handleBlur}
          onChange={(e) => field.handleChange(e.target.value)}
          aria-invalid={isInvalid}
          placeholder={placeholder}
          autoComplete="off"
          type={showPassword ? "text" : "password"}
          className={cn(
            "bg-white border-[var(--teal-700)] rounded-none shadow-none",
            className,
          )}
        />
        <button
          type="button"
          onClick={() => setShowPassword((prev) => !prev)}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xl text-gray-500 hover:text-gray-700 focus:outline-none"
        >
          {showPassword ? <EyeOff /> : <Eye />}
        </button>
      </div>
      {isInvalid && <FieldError errors={field.state.meta.errors} />}
      {description && <FieldDescription>{description}</FieldDescription>}
    </Field>
  );
}
