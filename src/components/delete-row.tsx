// Row logic that creates a delete button for each row
import { useAppForm } from "@/hooks/form";
import DeleteForm from "./delete-form";

type RowProps = {
  id: number;
  onDelete: (id: number) => Promise<unknown>;
  label?: string;
};

// Creates a form component for one row
function DeleteRow({ id, onDelete }: RowProps) {
  const form = useAppForm({
    defaultValues: {
      id, // sets id value for this row
    },
    onSubmit: async ({ value }) => { // delete button functionality
      if (!value.id) return; // checking for valid id
      await onDelete(value.id);
    },
  });

  return (
    <div className="flex justify-end">
    {/* Pass the form too reuse component */ }
      <DeleteForm form={form} /> 
    </div>
  );
}

export default DeleteRow;