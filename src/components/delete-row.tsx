// Row logic that creates a delete button for each row
import { useAppForm } from "@/hooks/form";
import DeleteForm from "./delete-form";

import { pushNotificationAtom } from "@/helpers/notification";
import { useSetAtom } from "jotai";

type RowProps = {
    id: number;
    onDelete: (id: number) => Promise<unknown>;
    label?: string;
};

// Creates a form component for one row
function DeleteRow({ id, onDelete }: RowProps) {
    const setNotification = useSetAtom(pushNotificationAtom)
    const form = useAppForm({
        defaultValues: {
            id, // sets id value for this row
        },
        onSubmit: async ({ value }) => { // delete button functionality
            if (!value.id) { // checking for valid id
                setNotification({ variant: "error", message: "SSH key does not exist." })
                return;
            }
            try {
                await onDelete(value.id);
                setNotification({ variant: "success", message: "SSH key deleted successfully." })
            } catch (error) {
                setNotification({ variant: "error", message: "Unable to delete SSH key." })
            }
        },
    });

    return (
        <div className="flex justify-end">
            {/* Pass the form too reuse component */}
            <DeleteForm form={form} />
        </div>
    );
}

export default DeleteRow;