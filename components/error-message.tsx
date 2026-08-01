import { Alert } from "@/components/ui/alert";

/** Renders a destructive alert only when an error message exists. */
export function ErrorMessage({ message }: { message: string | null }) {
  if (!message) return null;
  return (
    <Alert variant="destructive">
      {message}
    </Alert>
  );
}

/** Renders an announced success alert only when a message exists. */
export function SuccessMessage({ message }: { message: string | null }) {
  if (!message) return null;
  return (
    <Alert variant="success" role="status">
      {message}
    </Alert>
  );
}
