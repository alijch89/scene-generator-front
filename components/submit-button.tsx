import { Button } from "@/components/ui/button";
import { LoaderCircle } from "lucide-react";

/** Submit button that disables duplicate submission and announces pending state. */
export function SubmitButton({
  pending,
  children,
}: {
  pending: boolean;
  children: React.ReactNode;
}) {
  return (
    <Button className="min-h-13 w-full" type="submit" disabled={pending}>
      {pending ? (
        <LoaderCircle className="animate-spin" aria-hidden="true" />
      ) : null}
      {pending ? "Please wait…" : children}
    </Button>
  );
}
