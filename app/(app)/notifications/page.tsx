import type { Metadata } from 'next';
import { MarkAllReadButton } from '@/components/app/notification-actions';
import { EmptyState, PageTitle } from '@/components/app/ui';
import { sapi } from '@/lib/dal';
import { faDate } from '@/lib/fa';
import type { NotificationDto } from '@/lib/types';
import { cn } from '@/lib/utils';

export const metadata: Metadata = { title: 'اعلان‌ها' };

/** Icon and tint per notification type, so state is never colour alone. */
const ICON: Record<string, { glyph: string; tone: string }> = {
  story_ready: { glyph: '✦', tone: 'text-gold' },
  generation_failed: { glyph: '✕', tone: 'text-error' },
  payment: { glyph: '✓', tone: 'text-success' },
  product_news: { glyph: '✧', tone: 'text-brand' },
};

/** Server page that retrieves and renders the parent's newest notifications. */
export default async function NotificationsPage() {
  const { items, unread } = await sapi.get<{
    items: NotificationDto[];
    unread: number;
  }>('/notifications');

  return (
    <section className="max-w-180 animate-[pageIn_.4s_ease_both]">
      <PageTitle
        title="اعلان‌ها"
        action={unread > 0 ? <MarkAllReadButton /> : undefined}
      />

      {items.length === 0 ? (
        <EmptyState icon="✧" title="اعلان تازه‌ای نیست.">
          وقتی قصه‌ای آماده شود یا پرداختی ثبت شود، اینجا خبر می‌دهیم.
        </EmptyState>
      ) : (
        <div className="flex flex-col gap-3">
          {items.map((item) => {
            const icon = ICON[item.type] ?? ICON.product_news;
            return (
              <article
                key={item.id}
                className={cn(
                  'flex gap-3.5 rounded-[18px] border bg-surface px-4.5 py-4',
                  item.readAt === null
                    ? 'border-brand shadow-card'
                    : 'border-border',
                )}
              >
                <span
                  aria-hidden
                  className={cn(
                    'grid size-10 flex-none place-items-center rounded-xl bg-elev',
                    icon.tone,
                  )}
                >
                  {icon.glyph}
                </span>
                <div className="flex-1">
                  <strong className="mb-1 block text-[14.5px]">
                    {item.title}
                    {item.readAt === null ? (
                      <span className="ms-2 align-middle text-[11px] font-normal text-brand">
                        خوانده‌نشده
                      </span>
                    ) : null}
                  </strong>
                  <p className="text-[13px] leading-[1.8] text-muted">
                    {item.body}
                  </p>
                </div>
                <span className="whitespace-nowrap text-[12px] text-muted">
                  {faDate(item.createdAt)}
                </span>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
/**
 * @file page.tsx
 * @description Renders parent notifications, unread semantics, and the mark-all-read action.
 */
