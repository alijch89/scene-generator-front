import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";

export function AuthShell({
  eyebrow,
  title,
  description,
  children,
  footer,
}: {
  eyebrow: string;
  title: string;
  description: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  return (
    <main className="auth-page">
      <section className="brand-panel">
        <Link href="/" className="brand">
          <span className="brand-mark">S</span>
          <span>Scene Studio</span>
        </Link>
        <div className="brand-copy">
          <p className="eyebrow">Create without friction</p>
          <h2>Stories begin with a safe place to imagine.</h2>
          <p>
            Your workspace, projects, and creative identity stay protected
            behind backend-owned sessions.
          </p>
        </div>
        <p className="security-note">
          <span aria-hidden>◆</span> Credentials never enter browser storage
        </p>
      </section>
      <section className="form-panel">
        <Card className="form-card border-0 bg-transparent py-0 shadow-none">
          <CardContent className="px-0">
            <p className="eyebrow">{eyebrow}</p>
            <h1>{title}</h1>
            <p className="lede">{description}</p>
            {children}
            {footer && <div className="form-footer">{footer}</div>}
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
