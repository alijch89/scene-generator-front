import type { OrderStatus } from './types';

/** Visual-semantic tones supported by shared status badges. */
export type StatusTone = 'success' | 'error' | 'warning' | 'neutral';

/** Presentation shared by every place that renders an order status. */
export interface OrderStatusPresentation {
  icon: string;
  parent: string;
  admin: string;
  tone: StatusTone;
}

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
  OrderStatusPresentation
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
  REFUND_PENDING: {
    icon: '↺',
    parent: 'در انتظار بازگشت وجه',
    admin: 'در انتظار بازپرداخت',
    tone: 'warning',
  },
  REFUNDED: {
    icon: '↩',
    parent: 'وجه بازگردانده شد',
    admin: 'بازپرداخت‌شده',
    tone: 'neutral',
  },
};

/**
 * Resolves API data defensively. Hand-written response types cannot prevent a
 * newer backend enum value from reaching an older frontend at runtime.
 */
export function getOrderStatus(status: string): OrderStatusPresentation {
  return (
    ORDER_STATUS[status as OrderStatus] ?? {
      icon: '?',
      parent: 'وضعیت ناشناخته',
      admin: `ناشناخته (${status})`,
      tone: 'neutral',
    }
  );
}

/**
 * What the row's action offers. A paid order has an invoice, retryable states
 * point back at payment, and refund states deliberately offer no new charge.
 */
/** Returns the action label associated with an order state, when one exists. */
export const orderAction = (status: OrderStatus) => {
  if (status === 'PAID')
    return { label: 'دریافت فاکتور', kind: 'invoice' as const };
  if (status === 'PENDING')
    return { label: 'ادامهٔ پرداخت', kind: 'pay' as const };
  if (status === 'FAILED' || status === 'CANCELLED')
    return { label: 'پرداخت دوباره', kind: 'pay' as const };
  return null;
};

/** The audit events the callback writes, in the words an admin reads them. */
export const PAYMENT_EVENT_LABEL: Record<string, string> = {
  'payment.paid': 'پرداخت تأیید شد',
  'payment.failed': 'بانک پرداخت را رد کرد',
  'payment.cancelled': 'پرداخت لغو شد',
  'payment.refund_pending': 'سفارش در انتظار بازپرداخت قرار گرفت',
  'payment.refund_failed': 'بازپرداخت توسط درگاه انجام نشد',
  'payment.refunded': 'وجه بازگردانده شد',
  'admin.payment.refunded': 'بازپرداخت توسط مدیر ثبت شد',
};
/**
 * @file orders.ts
 * @description Maps payment states and events to parent-facing labels, tones, and actions.
 */
