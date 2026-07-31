import { Alert } from "@/components/ui/alert";

export function ErrorMessage({ message }: { message: string | null }) {
  if (!message) return null;
  return (
    <Alert variant="destructive">
      {message}
    </Alert>
  );
}

export function SuccessMessage({ message }: { message: string | null }) {
  if (!message) return null;
  return (
    <Alert variant="success" role="status">
      {message}
    </Alert>
  );
}
