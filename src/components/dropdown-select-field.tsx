import React from "react";
import Select from "react-select";
import type { SingleValue } from "react-select";
import { useFieldContext } from "@/hooks/form-context";
import { FieldLabel, FieldError } from "@/components/ui/field";

export type Option = { label: string; value: string };

export default function LabeledSelect({
    name,
    label,
    options,
    value,
    onChange,
    placeholder,
}: {
    name: string;
    label?: string;
    options: Option[];
    value?: string;
    defaultValue?: string;
    onChange?: (value: string | null) => void;
    placeholder?: string;
}) {

    // Returns null if no matching option is found or if the value is undefined. 
    const toOption = (val?: string): Option | null => {
        if (!val) return null;
        // Find the option in the options array where the option's value matches the input val.
        // If no matching option is found, return null.
        return options.find(o => o.value === val) ?? null;
    };

    // Current selection from the value
    const selectedOption = toOption(value);

    // Called when user makes a selection
    // 'next' represents the selected option object or null if selection is cleared.
    const handleChange = (next: Option | null) => {
        onChange?.(next ? next.value : null);
      };

    const field = useFieldContext<string>();
    const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

    return (
        <div>
            <FieldLabel className={isInvalid ? "text-red-600" : undefined}>{label}</FieldLabel>
            <Select
                options={options}
                isSearchable
                placeholder={placeholder}
                value={selectedOption}
                onChange={handleChange}
                inputId={name}
                instanceId={name}
                styles={{
                    control: (base) => ({
                      // 'base' contains the default styles provided by react-select for the control element.
                      // 'state' contains information about the current state of the control (e.g., focused).
                      ...base, // Spread the default styles so we don't lose them.

                      // If the field is invalid, use a red color.
                      // If neither, keep the default border color.
                      borderColor: isInvalid
                        ? "rgb(220, 38, 38)" // red-600 for invalid state
                          : base.borderColor,
                    }),
                  }}
                />
            {isInvalid && <FieldError errors={field.state.meta.errors} />}
        </div>
    );
}