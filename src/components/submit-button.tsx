import { useFormContext } from "@/hooks/form-context";

import { Button } from "./ui/button";

export default function SubmitButton({ label }: { label: string }) {
  const form = useFormContext();
  return (
    <form.Subscribe selector={(state) => state.isSubmitting}>
      {(isSubmitting) => (
        <Button 
          type="submit" 
          disabled={isSubmitting}
          className="
            bg-[var(--teal-700)] text-white rounded-none border border-[var(--teal-700)]
            min-w-[144px]
            py-4 px-6
            text-[24px] font-archivo font-bold uppercase tracking-wide
            flex items-center justify-center
            disabled:opacity-50 disabled:cursor-not-allowed
            hover:bg-white hover:text-[var(--teal-700)] hover:border-[var(--teal-700)]
          "
          >
          {label}
        </Button>
      )}
    </form.Subscribe>
  );
}
