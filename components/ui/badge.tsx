import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/** Variant-aware badge class generator, exported for composition. */
const badgeVariants = cva(
  "inline-flex w-fit items-center rounded-full px-2.5 py-1 text-xs font-semibold",
  {
    variants: {
      variant: {
        default: "bg-[var(--primary-soft)] text-[var(--primary)]",
        outline: "border border-[var(--border)] text-[var(--ink)]",
      },
    },
    defaultVariants: { variant: "default" },
  },
);

/** Inline badge primitive with default and outline appearances. */
function Badge({
  className,
  variant,
  ...props
}: React.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return (
    <span
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  );
}

export { Badge, badgeVariants };
