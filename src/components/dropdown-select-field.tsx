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
    defaultValue,
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
    // Helper function to convert a string value to the corresponding Option object from the options list.
    // Returns null if no matching option is found or if the value is undefined.
    const toOption = (val?: string): Option | null => {
        if (!val) return null;
        return options.find(o => o.value === val) ?? null;
    };

    // Initialize component state with the selected option based on the `value` or `defaultValue` prop.
    // This state controls the currently selected option in the dropdown.
    const [selected, setSelected] = React.useState<Option | null>(
        toOption(value ?? defaultValue)
    );

    // Event handler called when the user selects an option.
    // Updates local state and calls the optional onChange callback with the selected value or null.
    const handleChange = (next: SingleValue<Option>) => {
        setSelected(next ?? null);
        onChange?.(next ? next.value : null);
    };


    const field = useFieldContext<string[]>();
    const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

    return (
        <div>
            <FieldLabel className={isInvalid ? "text-red-600" : undefined}>{label}</FieldLabel>
            <Select
                options={options}
                isSearchable
                placeholder={placeholder}
                value={selected}
                onChange={handleChange}
                className={isInvalid ? 'border-red-600 focus:ring-red-600' : undefined}
            />
            {isInvalid && <FieldError errors={field.state.meta.errors} />}
        </div>
    );
}