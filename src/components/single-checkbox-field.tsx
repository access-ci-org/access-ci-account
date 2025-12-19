import { Checkbox } from "@/components/ui/checkbox";
import { useFieldContext } from "@/hooks/form-context";
import { FieldLabel, FieldError } from "@/components/ui/field";

export default function CheckboxField({
  label,
  required,
}: {
  label: string;
  required?: boolean;
}) {
  const field = useFieldContext<boolean>();
  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

  return (
    <div className="space-y-1">
      <label className="flex items-start gap-3">
        <Checkbox
          checked={Boolean(field.state.value)}
          onCheckedChange={(checked) =>
            field.setValue(Boolean(checked))
          }
          aria-invalid={isInvalid}
          className = "border-[var(--teal-700)] bg-white"
        />

        <FieldLabel required={required}>
          {label}
        </FieldLabel>
      </label>

      {isInvalid && (
        <FieldError errors={field.state.meta.errors} />
      )}
    </div>
  );
}
