import { cn } from "@/lib/utils";
import type { StoryStatus } from "@/lib/types";

const styles: Record<StoryStatus, string> = {
  Draft: "bg-[var(--surface-3)] text-[var(--ink-2)]",
  Queued: "bg-[var(--warning-soft)] text-[var(--warning)]",
  Processing: "bg-[var(--primary-soft)] text-[var(--primary)]",
  Completed: "bg-[var(--success-soft)] text-[var(--success)]",
  Failed: "bg-[var(--error-soft)] text-[var(--error)]",
  Cancelled: "bg-[var(--surface-3)] text-[var(--ink-2)]",
  Expired: "bg-[var(--accent-soft)] text-[var(--accent-ink)]",
};

const labels: Record<StoryStatus, string> = {
  Draft: "پیش‌نویس",
  Queued: "در صف",
  Processing: "در حال ساخت",
  Completed: "آماده",
  Failed: "ناموفق",
  Cancelled: "لغوشده",
  Expired: "منقضی",
};

export function StoryStatusBadge({
  status,
  className,
}: {
  status: StoryStatus;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold",
        styles[status],
        className,
      )}
    >
      {(status === "Queued" || status === "Processing") && (
        <span className="size-1.5 animate-pulse rounded-full bg-current" />
      )}
      {labels[status]}
    </span>
  );
}
