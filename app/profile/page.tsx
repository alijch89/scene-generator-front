"use client";

import { useAuth } from "@/components/auth-provider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { LoaderCircle } from "lucide-react";
import Link from "next/link";

export default function ProfilePage() {
  const { user, loading, logout } = useAuth();
  if (loading) {
    return (
      <main className="profile-page centered">
        <LoaderCircle
          className="size-8 animate-spin text-[var(--sage)]"
          aria-label="Loading profile"
        />
      </main>
    );
  }
  if (!user) {
    return (
      <main className="profile-page centered">
        <div className="empty-state">
          <h1>Your session has ended</h1>
          <Button asChild size="lg">
            <Link href="/login">Sign in again</Link>
          </Button>
        </div>
      </main>
    );
  }
  const initials = (user.displayName || user.phoneNumber)
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  return (
    <main className="profile-page">
      <nav className="profile-nav">
        <Link href="/" className="brand">
          <span className="brand-mark">S</span>
          <span>Scene Studio</span>
        </Link>
        <Button variant="ghost" onClick={() => void logout()}>
          Sign out
        </Button>
      </nav>
      <section className="profile-wrap">
        <header className="profile-header">
          <div className="avatar">{initials}</div>
          <div>
            <p className="eyebrow">Your account</p>
            <h1>{user.displayName || "Storyteller"}</h1>
            <p>{user.phoneNumber}</p>
          </div>
        </header>
        <div className="profile-grid">
          <Card className="profile-card block gap-0 py-7 shadow-none">
            <span className="card-icon">◎</span>
            <h2>Identity</h2>
            <dl>
              <div>
                <dt>Mobile</dt>
                <dd>{user.phoneNumber}</dd>
              </div>
              <div>
                <dt>Recovery email</dt>
                <dd>{user.email || "Not configured"}</dd>
              </div>
            </dl>
          </Card>
          <Card className="profile-card block gap-0 py-7 shadow-none">
            <span className="card-icon">◇</span>
            <h2>Access</h2>
            <div className="badge-row">
              {user.roles.map((role) => (
                <Badge key={role}>
                  {role}
                </Badge>
              ))}
            </div>
            <p className="muted">
              {user.permissions.length} active permission
              {user.permissions.length === 1 ? "" : "s"}
            </p>
          </Card>
          <Card className="profile-card security-card block gap-0 py-7 shadow-none">
            <span className="card-icon">⌁</span>
            <h2>Security</h2>
            <p>Update your password or close sessions on every device.</p>
            <div className="card-actions">
              <Button asChild size="sm">
                <Link href="/change-password">Change password</Link>
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => void logout(true)}
              >
                Sign out everywhere
              </Button>
            </div>
          </Card>
        </div>
      </section>
    </main>
  );
}
