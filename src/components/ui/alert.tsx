import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const alertVariants = cva(
  [
    "relative w-full rounded-none border-0 px-6 py-5",
    "grid items-start gap-y-1",
    "grid-cols-[0_1fr] has-[>svg]:grid-cols-[calc(var(--spacing)*5)_1fr]",
    "has-[>svg]:gap-x-3",
    "[&>svg]:size-5 [&>svg]:translate-y-0.5 [&>svg]:text-current",
  ].join(" "),
  {
    variants: {
      variant: {
        default:
          "bg-[var(--alert-info-bg)] text-[var(--alert-info-text)]",
        info:
          "bg-[var(--alert-info-bg)] text-[var(--alert-info-text)]",
        success:
          "bg-[var(--alert-success-bg)] text-[var(--alert-success-text)]",
        warning:
          "bg-[var(--alert-error-bg)] text-[var(--alert-error-text)]",
        error:
          "bg-[var(--alert-error-bg)] text-[var(--alert-error-text)]",
        destructive:
          "bg-[var(--alert-error-bg)] text-[var(--alert-error-text)]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

function Alert({
  className,
  variant,
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof alertVariants>) {
  return (
    <div
      data-slot="alert"
      role="alert"
      className={cn(alertVariants({ variant }), className)}
      {...props}
    />
  );
}

function AlertTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-title"
      className={cn(
        "col-start-2 text-base leading-7 font-bold text-current",
        className,
      )}
      {...props}
    />
  );
}

function AlertDescription({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-description"
      className={cn(
        "col-start-2 text-base leading-7 font-normal text-current [&_p]:leading-7 [&_ul]:list-disc [&_ul]:pl-6",
        className,
      )}
      {...props}
    />
  );
}

export { Alert, AlertTitle, AlertDescription };