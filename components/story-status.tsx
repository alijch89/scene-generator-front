import { cn } from "@/lib/utils";
import type { StoryStatus } from "@/lib/types";

const styles: Record<StoryStatus, string> = {
  Draft: "bg-stone-200 text-stone-700",
  Queued: "bg-amber-100 text-amber-800",
  Processing: "bg-blue-100 text-blue-800",
  Completed: "bg-emerald-100 text-emerald-800",
  Failed: "bg-red-100 text-red-800",
  Cancelled: "bg-stone-200 text-stone-700",
  Expired: "bg-orange-100 text-orange-800",
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
      {status}
    </span>
  );
}
