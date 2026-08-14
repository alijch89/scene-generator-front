import type { OrderStatus } from './types';

/** Visual-semantic tones supported by shared status badges. */
export type StatusTone = 'success' | 'error' | 'warning' | 'neutral';

/**
 * One order status, said two ways. The parent's صورت‌حساب talks about what
 * happened to them («پرداخت شد»); the admin's پرداخت‌ها talks about what the
 * transaction did («موفق»). Same row, different reader.
 *
 * Every entry carries a glyph as well as a tone — the design's rule is that
 * status is never conveyed by colour alone.
 */
export const ORDER_STATUS: Record<
  OrderStatus,
  { icon: string; parent: string; admin: string; tone: StatusTone }
> = {
  PAID: { icon: '✓', parent: 'پرداخت شد', admin: 'موفق', tone: 'success' },
  PENDING: {
    icon: '⏳',
    parent: 'در انتظار پرداخت',
    admin: 'در انتظار',
    tone: 'warning',
  },
  FAILED: { icon: '✕', parent: 'ناموفق', admin: 'ناموفق', tone: 'error' },
  CANCELLED: { icon: '↺', parent: 'لغو شد', admin: 'لغو شده', tone: 'neutral' },
};

/**
 * What the row's action offers. Only a paid order has an invoice; every other
 * state is an unfinished purchase, so it points back at the payment page.
 */
/** Returns the action label associated with an order state, when one exists. */
export const orderAction = (status: OrderStatus) =>
  status === 'PAID'
    ? { label: 'دریافت فاکتور', kind: 'invoice' as const }
    : {
        label: status === 'PENDING' ? 'ادامهٔ پرداخت' : 'پرداخت دوباره',
        kind: 'pay' as const,
      };

/** The audit events the callback writes, in the words an admin reads them. */
export const PAYMENT_EVENT_LABEL: Record<string, string> = {
  'payment.paid': 'پرداخت تأیید شد',
  'payment.failed': 'بانک پرداخت را رد کرد',
  'payment.cancelled': 'پرداخت لغو شد',
};
/**
 * @file orders.ts
 * @description Maps payment states and events to parent-facing labels, tones, and actions.
 */
