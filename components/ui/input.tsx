import * as React from "react";
import { cn } from "@/lib/utils";

/** Styled native input that preserves all standard HTML input semantics. */
function Input({
  className,
  type,
  dir = "rtl",
  ...props
}: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      dir={dir}
      data-slot="input"
      className={cn(
        "h-11 w-full min-w-0 rounded-md border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-base text-[var(--ink)] shadow-sm outline-none transition-[color,box-shadow] placeholder:text-[var(--ink-3)] focus-visible:border-[var(--primary)] focus-visible:ring-3 focus-visible:ring-[var(--primary)]/10 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        className,
      )}
      {...props}
    />
  );
}

export { Input };
