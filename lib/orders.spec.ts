import { ORDER_STATUS, orderAction } from './orders';

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
  });

  it.each([
    ['PAID', { kind: 'invoice', label: 'دریافت فاکتور' }],
    ['PENDING', { kind: 'pay', label: 'ادامهٔ پرداخت' }],
    ['FAILED', { kind: 'pay', label: 'پرداخت دوباره' }],
    ['CANCELLED', { kind: 'pay', label: 'پرداخت دوباره' }],
  ] as const)('chooses the correct action for %s', (status, action) => {
    expect(orderAction(status)).toEqual(action);
  });
});
