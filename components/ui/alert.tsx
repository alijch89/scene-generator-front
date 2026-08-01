import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const alertVariants = cva(
  "relative w-full rounded-md border px-4 py-3 text-sm",
  {
    variants: {
      variant: {
        default: "border-[var(--border)] bg-[var(--surface)] text-[var(--ink)]",
        destructive:
          "border-[var(--error)]/30 bg-[var(--error-soft)] text-[var(--error)]",
        success:
          "border-[var(--success)]/30 bg-[var(--success-soft)] text-[var(--success)]",
      },
    },
    defaultVariants: { variant: "default" },
  },
);

function Alert({
  className,
  variant,
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof alertVariants>) {
  return (
    <div
      role="alert"
      data-slot="alert"
      className={cn(alertVariants({ variant }), className)}
      {...props}
    />
  );
}

export { Alert };
