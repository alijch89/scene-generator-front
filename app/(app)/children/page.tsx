import type { Metadata } from 'next';
import Link from 'next/link';
import { AddChildButton } from '@/components/app/child-form';
import { DeleteChildButton } from '@/components/app/child-actions';
import {
  Card,
  ChildAvatar,
  EmptyState,
  InterestChip,
  PageTitle,
  childMeta,
} from '@/components/app/ui';
import { sapi } from '@/lib/dal';
import { faDigits } from '@/lib/fa';
import type { ChildDto } from '@/lib/types';

export const metadata: Metadata = { title: 'کودکان' };

/** Server page that loads and displays all child profiles owned by the parent. */
export default async function ChildrenPage() {
  const children = await sapi.get<ChildDto[]>('/children');

  return (
    <section className="animate-[pageIn_.4s_ease_both]">
      <PageTitle
        title="کودکان"
        meta={
          children.length > 0
            ? `${faDigits(children.length)} پرونده`
            : undefined
        }
        action={
          <AddChildButton className="rounded-[14px] bg-linear-to-br from-brand to-warm px-5 py-3 text-[14px] font-bold text-brand-fg shadow-card">
            + افزودن کودک
          </AddChildButton>
        }
      />

      {children.length === 0 ? (
        <EmptyState
          icon="✦"
          title="هنوز پرونده‌ای ساخته نشده."
          action={
            <AddChildButton className="rounded-[15px] bg-linear-to-br from-brand to-warm px-6 py-3.5 text-[15px] font-bold text-brand-fg">
              اولین پرونده را بسازید
            </AddChildButton>
          }
        >
          قصه‌ها به نام و سن کودک ساخته می‌شوند. نام، سن و یک عکس کافی است.
        </EmptyState>
      ) : (
        <div className="grid gap-4 sm:grid-cols-[repeat(auto-fill,minmax(250px,1fr))]">
          {children.map((child) => (
            <Card key={child.id} className="p-[18px]">
              <div className="mb-4 flex items-center gap-3.5">
                <ChildAvatar child={child} size={64} />
                <span>
                  <strong className="block text-[17px]">
                    {child.firstName}
                  </strong>
                  <span className="text-[13px] text-muted">
                    {childMeta(child)}
                  </span>
                </span>
              </div>

              {child.interests.length > 0 ? (
                <div className="mb-4 flex flex-wrap gap-1.5">
                  {child.interests.map((interest) => (
                    <InterestChip key={interest}>{interest}</InterestChip>
                  ))}
                </div>
              ) : null}

              <div className="flex flex-wrap gap-2">
                <Link
                  href={`/children/${child.id}`}
                  className="flex-1 rounded-xl border border-border bg-elev p-2.5 text-center text-[12.5px] font-semibold text-ink hover:no-underline"
                >
                  پرونده
                </Link>
                <Link
                  href={`/wizard?child=${child.id}`}
                  className="flex-1 rounded-xl bg-brand p-2.5 text-center text-[12.5px] font-bold text-brand-fg hover:no-underline"
                >
                  ساخت قصه
                </Link>
                <DeleteChildButton child={child} />
              </div>
            </Card>
          ))}

          <AddChildButton className="flex flex-col items-center gap-2.5 rounded-[22px] border-2 border-dashed border-border p-6 text-muted">
            <span className="grid size-13 place-items-center rounded-full bg-elev text-[24px]">
              +
            </span>
            <strong className="text-[15px] text-ink">پروندهٔ کودک تازه</strong>
            <span className="text-[12.5px]">نام، سن و یک عکس</span>
          </AddChildButton>
        </div>
      )}
    </section>
  );
}
/**
 * @file page.tsx
 * @description Renders the parent's child-profile collection and add-child entry point.
 */
