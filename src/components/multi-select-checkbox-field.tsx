import { Checkbox } from "@/components/ui/checkbox";
import { useFieldContext } from "@/hooks/form-context";
import { FieldLabel, FieldError } from "@/components/ui/field";

// Option type defines selectable options for form fields
type Option = { label: string; value: string };

// Renders a group of checkboxes that supports selecting MULTIPLE options
export default function MultiSelectCheckboxGroup({
    label,
    name,
    values,
    onChange,
    options,
}: {
    label: string;
    name: string;
    values?: string[] | string; // multiple selections; optional so we can default to []
    onChange: (v: string[]) => void; // return full selected array
    options: Option[];
}) {

    const field = useFieldContext<string[]>();
    const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
    // Use safe default empty array if values prop is undefined to avoid errors
    const selected = Array.isArray(values)
      ? values.filter(Boolean)
      : typeof values === "string"
        ? (values ? [values] : [])
        : [];

    return (
        <fieldset className="space-y-2">
            <FieldLabel className={isInvalid ? "text-red-600" : undefined}>{label}</FieldLabel>
            <div className="flex flex-wrap items-center gap-4">
                {options.map(({ label: optLabel, value: optValue }) => {
                    const id = `${name}-${optValue}`;
                    // Determine if the current option is selected
                    const checked = selected.includes(optValue);
                    return (
                        <label key={optValue} className="inline-flex items-center gap-2 text-sm" htmlFor={id}>
                            <Checkbox
                                id={id}
                                checked={checked}
                                // Handle toggle logic: add or remove option from selected array
                                onCheckedChange={(next) => {
                                    const isChecked = Boolean(next);
                                    if (isChecked) {
                                        // Add option if not already selected
                                        if (!selected.includes(optValue)) onChange([...selected, optValue]);
                                    } else {
                                        // Remove option if unchecked
                                        onChange(selected.filter((v) => v !== optValue));
                                    }
                                }}
                            />
                            <span>{optLabel}</span>
                        </label>
                    );
                })}
                {/* Render hidden inputs for each selected value to submit with form */}
                {selected.map((v) => (
                  <input key={v} type="hidden" name={name} value={v} />
                ))}
            </div>
            {/* Show validation errors if invalid */}
            {isInvalid && <FieldError errors={field.state.meta.errors} />}
        </fieldset>
    );
}
