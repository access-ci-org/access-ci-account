import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const alertVariants = cva(
  [
    "relative w-full rounded-md border px-6 py-5",
    "grid items-start gap-y-1.5",
    "grid-cols-[0_1fr] has-[>svg]:grid-cols-[calc(var(--spacing)*5)_1fr]",
    "has-[>svg]:gap-x-3",
    "[&>svg]:size-5 [&>svg]:translate-y-0.5 [&>svg]:text-current",
  ].join(" "),
  {
    variants: {
      variant: {
        default: [
          "border-transparent",
          "bg-sky-100 text-sky-900",
          "[&_[data-slot=alert-title]]:text-sky-900",
          "[&_[data-slot=alert-description]]:text-sky-800",
          "[&>svg]:text-sky-900",
        ].join(" "),
        info: [
          "border-transparent",
          "bg-sky-100 text-sky-900",
          "[&_[data-slot=alert-title]]:text-sky-900",
          "[&_[data-slot=alert-description]]:text-sky-800",
          "[&>svg]:text-sky-900",
        ].join(" "),
        destructive: [
          "border-transparent",
          "bg-red-50 text-red-900",
          "[&_[data-slot=alert-title]]:text-red-800",
          "[&_[data-slot=alert-description]]:text-red-700",
          "[&>svg]:text-red-800",
        ].join(" "),
        error: [
          "border-transparent",
          "bg-red-50 text-red-900",
          "[&_[data-slot=alert-title]]:text-red-800",
          "[&_[data-slot=alert-description]]:text-red-700",
          "[&>svg]:text-red-800",
        ].join(" "),
        success: [
          "border-transparent",
          "bg-green-100 text-green-900",
          "[&_[data-slot=alert-title]]:text-green-800",
          "[&_[data-slot=alert-description]]:text-green-700",
          "[&>svg]:text-green-800",
        ].join(" "),
        warning: [
          "border-transparent",
          "bg-yellow-50 text-yellow-900",
          "[&_[data-slot=alert-title]]:text-yellow-800",
          "[&_[data-slot=alert-description]]:text-yellow-700",
          "[&>svg]:text-yellow-800",
        ].join(" "),
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
        "col-start-2 text-[1.125rem] leading-7 font-semibold",
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
        "col-start-2 text-base leading-8 [&_p]:leading-8 [&_ul]:list-disc [&_ul]:pl-6 [&_li]:mb-1",
        className,
      )}
      {...props}
    />
  );
}

export { Alert, AlertTitle, AlertDescription };