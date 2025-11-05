import Select from "react-select";
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
            <FieldLabel className={`mb-3 ${isInvalid ? "text-red-600" : ""}`} >{label}</FieldLabel>
            <Select 
                options={options}
                isSearchable
                name={field.name}
                placeholder={placeholder}
                value={selectedOption}
                onChange={handleChange}
                inputId={name}
                instanceId={name}
                styles={{
                    control: (base, state) => ({
                        ...base,
                        fontSize: "1rem",
                        "@media (min-width: 768px)": {
                          fontSize: "0.875rem",
                        },
                        borderColor: isInvalid
                          ? "rgb(220, 38, 38)"
                          : state.isFocused
                          ? "rgb(229, 229, 229)"
                          : base.borderColor,
                        boxShadow: isInvalid && state.isFocused
                          ? "0 0 0 2px rgba(220, 38, 38, 0.3)"
                          : state.isFocused
                          ? "0 0 0 2px rgba(162, 162, 162, 0.5)"
                          : "none",
                        "&:hover": {
                          borderColor: isInvalid
                            ? "rgb(220, 38, 38)"
                            : "rgb(182, 182, 182)",
                        },
                      }),
                  }}
                />
            {isInvalid && <FieldError errors={field.state.meta.errors} className="mt-3"/>}
        </div>
    );
}