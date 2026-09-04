import { getOrderStatus, ORDER_STATUS, orderAction } from './orders';

describe('order presentation rules', () => {
  it('keeps parent/admin labels and status tone aligned', () => {
    expect(ORDER_STATUS.PAID).toEqual({
      icon: '✓',
      parent: 'پرداخت شد',
      admin: 'موفق',
      tone: 'success',
    });
    expect(ORDER_STATUS.FAILED.tone).toBe('error');
    expect(ORDER_STATUS.PENDING.tone).toBe('warning');
    expect(ORDER_STATUS.REFUND_PENDING).toMatchObject({
      admin: 'در انتظار بازپرداخت',
      tone: 'warning',
    });
    expect(ORDER_STATUS.REFUNDED).toMatchObject({
      parent: 'وجه بازگردانده شد',
      tone: 'neutral',
    });
  });

  it.each([
    ['PAID', { kind: 'invoice', label: 'دریافت فاکتور' }],
    ['PENDING', { kind: 'pay', label: 'ادامهٔ پرداخت' }],
    ['FAILED', { kind: 'pay', label: 'پرداخت دوباره' }],
    ['CANCELLED', { kind: 'pay', label: 'پرداخت دوباره' }],
  ] as const)('chooses the correct action for %s', (status, action) => {
    expect(orderAction(status)).toEqual(action);
  });

  it.each(['REFUND_PENDING', 'REFUNDED'] as const)(
    'does not offer another charge while an order is %s',
    (status) => {
      expect(orderAction(status)).toBeNull();
    },
  );

  it('falls back safely when the backend adds an unknown status', () => {
    expect(getOrderStatus('NEW_GATEWAY_STATE')).toEqual({
      icon: '?',
      parent: 'وضعیت ناشناخته',
      admin: 'ناشناخته (NEW_GATEWAY_STATE)',
      tone: 'neutral',
    });
  });
});
