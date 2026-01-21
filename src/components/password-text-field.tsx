import { useFieldContext } from "@/hooks/form-context";

import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import type React from "react";
import { useState } from "react";
import { Eye, EyeOff } from 'lucide-react';

export default function PasswordTextField({
    label,
    placeholder,
    required = false,
}: {
    label: React.ReactNode;
    placeholder: string;
    required?: boolean;
}) {
    const field = useFieldContext<string>();
    const [showPassword, setShowPassword] = useState(false);

    const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
    return (
        <Field data-invalid={isInvalid}>
            <FieldLabel required={required} htmlFor={field.name}>{label}</FieldLabel>
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
                    className="pr-10"
                />
                <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xl text-gray-500 hover:text-gray-700 focus:outline-none"
                >
                    {showPassword ? <EyeOff /> : <Eye />}
                </button>
            </div>
            <div className="text-destructive text-small text-decoration-none leading-tight inline-block">
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
            </div>
        </Field>
    );
}

