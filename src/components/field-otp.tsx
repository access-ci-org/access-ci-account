import * as React from "react";
import { useFieldContext } from "@/hooks/form-context";
import { FieldLabel, FieldError } from "@/components/ui/field";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  InputOTPSeparator,
} from "@/components/ui/input-otp";

export default function FieldOtp({
  label,
  length = 6,
  placeholder,
}: {
  name: string;
  label?: React.ReactNode;
  length?: number;
  placeholder?: string;
}) {
  const field = useFieldContext<string>();
  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
  const value = field.state.value ?? "";

  // Keep only alphanumeric characters, capped at `length`. InputOTP owns the
  // input and focus handling; we drive the form field directly rather than
  // mirroring the value into local state.
  const handleChange = (next: string) => {
    field.handleChange(next.replace(/[^A-Za-z0-9]/g, "").slice(0, length));
  };

  return (
    <div className="flex flex-col items-center w-full">
      {label && (
        <FieldLabel className={`mb-3 ${isInvalid ? "text-red-600" : ""}`}>
          {label}
        </FieldLabel>
      )}

      <InputOTP
        maxLength={length}
        value={value}
        onChange={handleChange}
        aria-invalid={isInvalid}
        containerClassName="w-full flex justify-center overflow-hidden"
      >
        <InputOTPGroup className="w-full flex justify-center gap-1">
          {Array.from({ length }).map((_, i) => (
            <React.Fragment key={i}>
              <InputOTPSlot
                index={i}
                className="relative h-12 w-12 text-lg border border-gray-300 rounded-md flex items-center justify-center bg-white shadow-xs data-[active=true]:border-blue-500 data-[active=true]:ring-2 data-[active=true]:ring-blue-100"
              />

              {(i + 1) % 3 === 0 && i !== length - 1 && (
                <InputOTPSeparator className="mx-1.5 text-gray-300" />
              )}
            </React.Fragment>
          ))}
        </InputOTPGroup>
      </InputOTP>

      {placeholder && (
        <p className="text-sm text-muted-foreground mt-2 text-center">
          {placeholder}
        </p>
      )}

      {isInvalid && (
        <FieldError
          errors={field.state.meta.errors}
          className="mt-3 text-red-600"
        />
      )}
    </div>
  );
}
