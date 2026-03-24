import { useFormContext } from "@/hooks/form-context";
import { useState } from "react";

import { Button } from "./ui/button";
import { LoaderCircle } from "lucide-react";

export default function DeleteButton({
    label,
    fieldName,
    value,
}: {
    label: string;
    fieldName: string;
    value: number;
}) {
    const form = useFormContext() as any;

    const [isDeleting, setIsDeleting] = useState(false);

    return (
        <Button
            type="button"
            variant="destructive"
            disabled={isDeleting}
            onClick={async () => {
                setIsDeleting(true);
                form.setFieldValue(fieldName, value);
                await form.handleSubmit();
                setIsDeleting(false);
            }}
        >
            {isDeleting && <LoaderCircle className="animate-spin mr-2" />}
            {label}
        </Button>
    );
}