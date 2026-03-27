// Row logic that creates a delete button for each row
import { useAppForm } from "@/hooks/form";
import ButtonForm from "./button-form";

type RowProps = {
  onSubmit: () => Promise<unknown>;
  label: string;
  variant: "default" | "destructive" | undefined;
};

// Creates a form component for one row
function ButtonRow({ label, variant, onSubmit }: RowProps) {
  const form = useAppForm({
    defaultValues: {},
    onSubmit,
  });

  return (
    <div className="flex justify-end">
      {/* Pass the form too reuse component */}
      <ButtonForm form={form} label={label} variant={variant} />
    </div>
  );
}

export default ButtonRow;
