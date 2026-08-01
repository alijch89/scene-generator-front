import { AppShell } from "@/components/app-shell";

/** Wraps authenticated studio pages with responsive navigation and identity UI. */
export default function StudioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AppShell>{children}</AppShell>;
}
