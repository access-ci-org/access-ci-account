import DeleteForm from "./delete-form";
import { useAppForm } from "@/hooks/form";

type DeleteRowFormProps = {
    id: number;
    label?: string;
    onDelete: (id: number) => Promise<void> // here we can interchange the delete atoms 
};

function DeleteRowForm({ id, label, onDelete}: DeleteRowFormProps){
    const form = useAppForm({
        defaultValues: {
            id
        },
        onSubmit: async () => {
            console.log("Delete button been clicked");
            await onDelete(id);
        },
    });

    return <DeleteForm form={form} label={label} />;
}

export default DeleteRowForm;
