import * as React from "react";
import { cn } from "@/lib/utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "h-11 w-full min-w-0 rounded-md border border-[var(--line)] bg-white/60 px-3 py-2 text-base text-[var(--ink)] shadow-sm outline-none transition-[color,box-shadow] placeholder:text-[var(--muted)] focus-visible:border-[var(--sage)] focus-visible:ring-3 focus-visible:ring-[var(--sage)]/10 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        className,
      )}
      {...props}
    />
  );
}

export { Input };
