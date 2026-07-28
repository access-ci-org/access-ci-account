import type React from "react";
import { useEffect } from "react";
import { useFieldContext } from "@/hooks/form-context";
import { cn } from "@/lib/utils";
import type { Option } from "@/helpers/types";
import type { Atom } from "jotai";

import AwaitAtom from "@/components/await-atom";
import {
  FieldLabel,
  FieldError,
  FieldDescription,
  Field,
} from "@/components/ui/field";
import Select, { type MultiValue } from "react-select";

type FieldSelectProps<T, IsMulti extends boolean = boolean> = {
  description?: React.ReactNode;
  label?: React.ReactNode;
  name: string;
  options?: Option<T>[];
  optionsAtom?: Atom<Promise<Option<T>[]>>;
  placeholder?: string;
  required?: boolean;
  isMulti?: boolean;
} & (IsMulti extends true
  ? {
      value?: T[];
      defaultValue?: T[];
      onChange?: (value: T[] | null) => void;
    }
  : {
      value?: T;
      defaultValue?: T;
      onChange?: (value: T | null) => void;
    });

// Inner control rendered once options have resolved. Separated out so it can use
// hooks (the AwaitAtom render callback cannot). The "reset value missing from
// options" behavior lives in an effect here rather than during render, avoiding
// the setState-in-render that historically zeroed select fields silently.
function SelectControl<T>({
  options,
  value,
  onChange,
  placeholder,
  name,
  fieldName,
  isInvalid,
  isMulti,
}: {
  options: Option<T>[];
  value?: T | T[];
  onChange?: (value: T | T[] | null) => void;
  placeholder?: string;
  name: string;
  fieldName: string;
  isInvalid: boolean;
  isMulti?: boolean;
}) {
  const multi = isMulti ?? Array.isArray(value);

  // Returns null if no matching option is found or if the value is undefined.
  const toOption = (val?: T | T[]): Option<T> | Option<T>[] | null => {
    if (!val) return null;
    if (Array.isArray(val)) return options.filter((o) => val.includes(o.value));
    return options.find((o) => o.value === val) ?? null;
  };

  const selectedOption = toOption(value);

  const handleChange = (next: Option<T> | MultiValue<Option<T>> | null) => {
    const newValue = next
      ? "value" in next
        ? next.value
        : next.map((item) => item.value)
      : null;
    onChange?.(newValue);
  };

  // Drop any current value(s) not present in the options, consistently for both
  // single and multi selects. Runs after render (not during) so it never
  // updates state mid-render.
  useEffect(() => {
    if (Array.isArray(value)) {
      const valid = value.filter((v) => options.some((o) => o.value === v));
      if (valid.length !== value.length) onChange?.(valid);
      return;
    }
    if (!value) return;
    if (!options.some((o) => o.value === value)) onChange?.(null);
  }, [value, options, onChange]);

  return (
    <Select
      options={options}
      isSearchable
      name={fieldName}
      placeholder={placeholder}
      value={selectedOption}
      isMulti={multi}
      onChange={handleChange}
      inputId={name}
      instanceId={name}
      // Styles for dropdown box, overrides current React-Select styles
      classNames={{
        control: ({ isFocused, isDisabled }) =>
          cn(
            "bg-white border rounded-none shadow focus:ring-2 focus:ring-input focus:border-input",
            "flex w-full items-center px-3 py-2 text-sm outline-none",
            "transition-colors placeholder:text-muted-foreground",
            "focus-visible:ring-2 focus-visible:ring-ring focus-visible:border-ring",
            isFocused && "border-ring ring-[3px] ring-ring/50",
            isDisabled && "opacity-50 cursor-not-allowed",
            isInvalid ? "border-red-500" : "border-[var(--teal-700)]",
          ),
        menu: () => cn("z-50 mt-1 border bg-white shadow-md"),
        option: ({ isFocused, isSelected }) =>
          cn(
            "cursor-pointer px-3 py-2 text-sm transition-colors",
            isSelected
              ? "bg-primary/10 text-primary font-medium"
              : isFocused
                ? "bg-accent text-accent-foreground"
                : "text-foreground",
          ),
        placeholder: () => "text-muted-foreground",
        singleValue: () => "text-foreground",
      }}
      unstyled // important: lets Tailwind handle styles instead of default React-Select styles ( Why inline styles was used before because unstyled was not set )
    />
  );
}

export default function FieldSelect<T>({
  description = "",
  label,
  name,
  onChange,
  options,
  optionsAtom,
  placeholder,
  required,
  value,
  isMulti,
}: FieldSelectProps<T, boolean>) {
  const field = useFieldContext<string>();
  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

  return (
    <Field>
      <FieldLabel
        required={required}
        className={`${isInvalid ? "text-red-600" : ""}`}
      >
        {label}
      </FieldLabel>
      <AwaitAtom
        atom={optionsAtom}
        defaultValue={options}
        render={(resolvedOptions) => (
          <SelectControl
            options={resolvedOptions}
            value={value}
            onChange={onChange as ((value: T | T[] | null) => void) | undefined}
            placeholder={placeholder}
            name={name}
            fieldName={field.name}
            isInvalid={isInvalid}
            isMulti={isMulti}
          />
        )}
      />

      {isInvalid && <FieldError errors={field.state.meta.errors} />}
      {description && <FieldDescription>{description}</FieldDescription>}
    </Field>
  );
}
