import * as React from "react";
import { cn } from "@/lib/utils";

/** Surface container primitive with shared border, spacing, and shadow styles. */
function Card({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card"
      className={cn(
        "flex flex-col gap-6 rounded-xl border border-[var(--border)] bg-[var(--surface)] py-6 text-[var(--ink)] shadow-sm",
        className,
      )}
      {...props}
    />
  );
}

/** Standard horizontal content padding for use inside a `Card`. */
function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-content"
      className={cn("px-6", className)}
      {...props}
    />
  );
}

export { Card, CardContent };
