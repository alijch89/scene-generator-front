import { Button } from "@/components/ui/button";
import { LoaderCircle } from "lucide-react";

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
