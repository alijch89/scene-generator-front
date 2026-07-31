import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check, CreditCard } from "lucide-react";

export default function BillingPage() {
  return (
    <div className="mx-auto max-w-5xl px-5 py-8 sm:px-8 lg:px-12 lg:py-11">
      <p className="eyebrow">Plan & usage</p>
      <h1 className="font-[var(--font-serif)] text-4xl">Billing</h1>
      <div className="mt-8 grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
        <Card className="gap-5 p-7 shadow-none">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-[var(--clay)]">
                Current plan
              </span>
              <h2 className="mt-2 font-[var(--font-serif)] text-3xl">
                Family Studio
              </h2>
            </div>
            <span className="font-[var(--font-serif)] text-3xl">
              $18<small className="font-[var(--font-sans)] text-sm text-[var(--muted)]">/mo</small>
            </span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-black/5">
            <div className="h-full w-2/5 rounded-full bg-[var(--sage)]" />
          </div>
          <p className="text-sm text-[var(--muted)]">
            4 of 10 story generations used this month
          </p>
          <div className="grid gap-2 text-sm">
            {["10 new stories each month", "Images and narration included", "Private family library"].map(
              (item) => (
                <span key={item} className="flex items-center gap-2">
                  <Check className="size-4 text-[var(--success)]" /> {item}
                </span>
              ),
            )}
          </div>
        </Card>
        <Card className="gap-4 p-7 shadow-none">
          <CreditCard className="size-6 text-[var(--clay)]" />
          <h2 className="font-[var(--font-serif)] text-2xl">Payment method</h2>
          <p className="text-sm text-[var(--muted)]">
            No payment method has been connected yet.
          </p>
          <Button variant="outline" disabled>
            Add payment method
          </Button>
          <small className="text-[var(--muted)]">
            Billing provider integration is ready for the platform billing module.
          </small>
        </Card>
      </div>
    </div>
  );
}
