import { useFormContext } from "@/hooks/form-context";

import { Button } from "./ui/button";
import { LoaderCircle } from "lucide-react";

export default function SubmitButton({ label, className, variant }: { label: string; className?: string; variant?: "default" | "destructive" }) {
  const form = useFormContext();
  return (
    <form.Subscribe selector={(state) => state.isSubmitting}>
      {(isSubmitting) => (
        <Button type="submit" disabled={isSubmitting} className={className} variant={variant}>
          {isSubmitting && <LoaderCircle className="animate-spin" />} {label}
        </Button>
      )}
    </form.Subscribe>
  );
}
