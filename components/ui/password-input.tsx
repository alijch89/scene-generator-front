"use client";

import { Eye, EyeOff } from "lucide-react";
import * as React from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

/** Password field with an accessible control for revealing the entered value. */
function PasswordInput({
  className,
  ...props
}: Omit<React.ComponentProps<typeof Input>, "type">) {
  const [visible, setVisible] = React.useState(false);
  const label = visible ? "پنهان کردن رمز عبور" : "نمایش رمز عبور";

  return (
    <div className="relative">
      <Input
        type={visible ? "text" : "password"}
        className={cn("pl-11", className)}
        {...props}
      />
      <button
        type="button"
        className="absolute inset-y-0 left-1.5 my-auto flex size-8 items-center justify-center rounded-md text-[var(--ink-3)] transition-colors hover:bg-[var(--surface-2)] hover:text-[var(--ink)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)]/30"
        aria-label={label}
        aria-pressed={visible}
        title={label}
        onClick={() => setVisible((current) => !current)}
      >
        {visible ? (
          <EyeOff className="size-4.5" aria-hidden="true" />
        ) : (
          <Eye className="size-4.5" aria-hidden="true" />
        )}
      </button>
    </div>
  );
}

export { PasswordInput };
