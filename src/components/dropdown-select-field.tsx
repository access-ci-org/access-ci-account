import Select from "react-select";
import { useFieldContext } from "@/hooks/form-context";
import { FieldLabel, FieldError } from "@/components/ui/field";
import type React from "react";
import { cn } from "@/lib/utils";

export type Option = { label: string; value: string };

export default function DropdownSelectField({
    name,
    label,
    options,
    value,
    onChange,
    placeholder,
    required,
}: {
    name: string;
    label?: React.ReactNode;
    options: Option[];
    value?: string;
    defaultValue?: string;
    onChange?: (value: string | null) => void;
    placeholder?: string;
    required?: boolean;
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
            <FieldLabel required={required} className={`mb-3 ${isInvalid ? "text-red-600" : ""}`} >{label}</FieldLabel>
            <Select
                options={options}
                isSearchable
                name={field.name}
                placeholder={placeholder}
                value={selectedOption}
                onChange={handleChange}
                inputId={name}
                instanceId={name}
                // Styles for dropdown box, overrides current React-Select styles
                classNames={{
                    control: ({ isFocused, isDisabled }) =>
                        cn(
                        "flex w-full items-center rounded-md border bg-transparent px-3 py-2 text-sm shadow-xs outline-none",
                        "transition-colors placeholder:text-muted-foreground",
                        "focus-visible:ring-2 focus-visible:ring-ring focus-visible:border-ring",
                        isFocused && "ring-1 ring-ring",
                        isDisabled && "opacity-50 cursor-not-allowed",
                        isInvalid ? "border-red-500" : "border-input"
                        ),
                    menu: () =>
                        cn(
                        "z-50 mt-1 rounded-md border bg-popover text-popover-foreground shadow-md"
                        ),
                    option: ({ isFocused, isSelected }) =>
                        cn(
                        "cursor-pointer px-3 py-2 text-sm transition-colors",
                        // 👇 updated to be softer and theme-friendly
                        isSelected
                            ? "bg-primary/10 text-primary font-medium"
                            : isFocused
                            ? "bg-accent text-accent-foreground"
                            : "text-foreground"
                        ),
                    placeholder: () => "text-muted-foreground",
                    singleValue: () => "text-foreground",
                }}
                unstyled  // important: lets Tailwind handle styles instead of default React-Select styles
            />
            {isInvalid && <FieldError errors={field.state.meta.errors} className="mt-3" />}
        </div>
    );
}