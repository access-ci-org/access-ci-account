// Row logic that creates a delete button for each row
import { useAppForm } from "@/hooks/form";

import FormButton from "@/components/form-button";

type RowProps = {
  disabled?: boolean;
  label: string;
  onSubmit: () => Promise<unknown>;
  variant: "default" | "destructive" | undefined;
};

// Creates a form component for one row
function ButtonRow({ disabled = false, label, variant, onSubmit }: RowProps) {
  const form = useAppForm({
    defaultValues: {},
    onSubmit,
  });

  return (
    <div className="flex justify-end">
      {/* Pass the form too reuse component */}
      <FormButton
        disabled={disabled}
        form={form}
        label={label}
        variant={variant}
      />
    </div>
  );
}

export default ButtonRow;
