import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from "@/components/ui/select";
import { FieldLabel, FieldError, Field } from "@/components/ui/field";
import { useFieldContext } from "@/hooks/form-context";


// Option type defines selectable options for form fields
type Option = { label: string; value: string };

// Renders a labeled dropdown select with validation styling and error handling
export default function LabeledSelect({
    label,
    name,
    value,
    onChange,
    placeholder,
    options,
}: {
    label: string;
    name: string;
    value: string;
    onChange: (v: string) => void;
    placeholder: string;
    options: Option[];
}) {
    const field = useFieldContext<string>();
    const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

    return (
        <Field className="space-y-2">
            <FieldLabel className={isInvalid ? "text-red-600" : undefined}>{label}</FieldLabel>
            <Select value={value} onValueChange={onChange}>
                <SelectTrigger className={isInvalid ? 'border-red-600 focus:ring-red-600' : undefined}>
                    <SelectValue placeholder={placeholder} />
                </SelectTrigger>
                <SelectContent>
                    {options.map((o) => (
                        <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                    ))}
                </SelectContent>
            </Select>
            <input type="hidden" name={name} value={value} />
            {isInvalid && <FieldError errors={field.state.meta.errors} />}
        </Field>
    );
}
