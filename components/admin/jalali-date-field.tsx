'use client';

import { useEffect, useId, useRef, useState } from 'react';
import { faDigits } from '@/lib/fa';
import {
  faJalaliLabel,
  JALALI_MONTHS,
  JALALI_WEEKDAYS,
  jalaliMonthLength,
  jalaliMonthOffset,
  parseIsoDate,
  toGregorian,
  toIsoDate,
  toJalali,
  todayCivil,
  type CivilDate,
} from '@/lib/jalali';
import { cn } from '@/lib/utils';

/**
 * The panel's date filter, on the calendar its operators actually use.
 *
 * `<input type="date">` renders the browser's own picker, which is Gregorian
 * — an administrator reading a Jalali audit table had to convert ۱۳ شهریور
 * in their head before they could filter by it. This is the same control on
 * the right calendar, with the year and the month as dropdowns rather than as
 * twelve clicks of a chevron.
 *
 * The value that leaves is still `YYYY-MM-DD` Gregorian, in a hidden input:
 * the URL, the API, and every link the page builds are unchanged, and the
 * calendar stays a rendering decision rather than a wire format.
 */
export function JalaliDateField({
  name,
  label,
  defaultValue = '',
  placeholder = 'انتخاب تاریخ',
  className,
}: {
  /** Query parameter this field submits, e.g. `from`. */
  name: string;
  /** Accessible name; there is no visible label in the filter bar. */
  label: string;
  /** `YYYY-MM-DD`, as it came back from the URL. */
  defaultValue?: string;
  placeholder?: string;
  className?: string;
}) {
  const [value, setValue] = useState(() =>
    parseIsoDate(defaultValue) ? defaultValue : '',
  );
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const dialogId = useId();

  const selected = parseIsoDate(value);

  // Closes on a click anywhere else and on Escape, the two things anyone
  // tries before looking for a close button.
  useEffect(() => {
    if (!open) return;

    const onPointerDown = (event: PointerEvent) => {
      if (!root.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      setOpen(false);
      trigger.current?.focus();
    };

    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  /** Writes one day and closes, so choosing a date is a single click. */
  const choose = (date: CivilDate) => {
    setValue(toIsoDate(date));
    setOpen(false);
    trigger.current?.focus();
  };

  return (
    <div ref={root} className={cn('relative', className)}>
      {/* What the form actually submits; the calendar above it is chrome. */}
      <input type="hidden" name={name} value={value} />

      <div className="flex items-stretch rounded-lg border border-border bg-surface">
        <button
          ref={trigger}
          type="button"
          onClick={() => setOpen((was) => !was)}
          aria-label={label}
          aria-haspopup="dialog"
          aria-expanded={open}
          aria-controls={open ? dialogId : undefined}
          className={cn(
            'flex items-center gap-1.5 px-2.75 py-2 text-[12.5px] whitespace-nowrap',
            selected ? 'text-ink' : 'text-muted',
          )}
        >
          <span aria-hidden>▾</span>
          <span>{selected ? faJalaliLabel(selected) : placeholder}</span>
        </button>

        {/* Its own button, beside the trigger rather than inside it: a filter
            nobody can clear is a filter an operator reloads the page to
            escape, and one control nested in another is reachable by neither
            the keyboard nor a screen reader. */}
        {selected ? (
          <button
            type="button"
            onClick={() => setValue('')}
            aria-label={`پاک کردن ${label}`}
            className="px-2 text-[12.5px] text-muted hover:text-ink"
          >
            ✕
          </button>
        ) : null}
      </div>

      {open ? (
        <Calendar
          id={dialogId}
          label={label}
          selected={selected}
          onChoose={choose}
          onClear={() => {
            setValue('');
            setOpen(false);
            trigger.current?.focus();
          }}
        />
      ) : null}
    </div>
  );
}

/** How far back and forward the «سال» dropdown reaches from the current year. */
const YEARS_BACK = 15;
const YEARS_FORWARD = 1;

/**
 * The month grid, with سال and ماه as dropdowns.
 *
 * Rendered only while the field is open, which is also what keeps «today»
 * out of the server's render: the panel is server-rendered, and a year
 * boundary between the two would otherwise be a hydration mismatch.
 */
function Calendar({
  id,
  label,
  selected,
  onChoose,
  onClear,
}: {
  id: string;
  label: string;
  /** The chosen day, as a Gregorian civil date, or null. */
  selected: CivilDate | null;
  onChoose: (date: CivilDate) => void;
  onClear: () => void;
}) {
  const today = todayCivil();
  const todayJalali = toJalali(today);
  // Opens on the chosen month, or on this one when nothing is chosen yet.
  const [view, setView] = useState(() =>
    selected ? toJalali(selected) : todayJalali,
  );

  const selectedJalali = selected ? toJalali(selected) : null;
  const length = jalaliMonthLength(view.year, view.month);
  const offset = jalaliMonthOffset(view.year, view.month);

  // A year outside the dropdown's window is still reachable — an operator can
  // arrive at one through a shared link, and the control must not silently
  // move them somewhere else.
  const first = Math.min(todayJalali.year - YEARS_BACK, view.year);
  const last = Math.max(todayJalali.year + YEARS_FORWARD, view.year);
  const years = Array.from({ length: last - first + 1 }, (_, i) => last - i);

  /** Steps one month, rolling the year over at فروردین and اسفند. */
  const step = (delta: number) => {
    const month = view.month + delta;
    if (month < 1) setView({ year: view.year - 1, month: 12, day: 1 });
    else if (month > 12) setView({ year: view.year + 1, month: 1, day: 1 });
    else setView({ ...view, month });
  };

  const control =
    'rounded-lg border border-border bg-surface px-2 py-1.5 text-[12px] text-ink';

  return (
    <div
      id={id}
      role="dialog"
      aria-label={label}
      className="absolute top-[calc(100%+6px)] right-0 z-30 w-64 rounded-xl border border-border bg-surface p-3 shadow-card"
    >
      <div className="mb-2.5 flex items-center gap-1.5">
        {/* First child, so RTL puts it on the right — where «قبل» belongs.
            The arrows are U+2190/U+2192, which bidi does not mirror, so they
            point where they are drawn rather than where the run flips them. */}
        <button
          type="button"
          onClick={() => step(-1)}
          aria-label="ماه قبل"
          className={cn(control, 'px-2.25 font-semibold')}
        >
          <span aria-hidden>→</span>
        </button>

        <select
          value={view.month}
          onChange={(e) => setView({ ...view, month: Number(e.target.value) })}
          aria-label="ماه"
          className={cn(control, 'flex-1')}
        >
          {JALALI_MONTHS.map((month, i) => (
            <option key={month} value={i + 1}>
              {month}
            </option>
          ))}
        </select>

        <select
          value={view.year}
          onChange={(e) => setView({ ...view, year: Number(e.target.value) })}
          aria-label="سال"
          className={control}
        >
          {years.map((year) => (
            <option key={year} value={year}>
              {faDigits(year)}
            </option>
          ))}
        </select>

        <button
          type="button"
          onClick={() => step(1)}
          aria-label="ماه بعد"
          className={cn(control, 'px-2.25 font-semibold')}
        >
          <span aria-hidden>←</span>
        </button>
      </div>

      <div
        aria-hidden
        className="mb-1 grid grid-cols-7 gap-0.5 text-center text-[10.5px] text-muted"
      >
        {JALALI_WEEKDAYS.map((day, i) => (
          <span key={i} className="py-1">
            {day}
          </span>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-0.5">
        {/* The blanks before ۱, so the first of the month lands in its column. */}
        {Array.from({ length: offset }, (_, i) => (
          <span key={`pad-${i}`} />
        ))}

        {Array.from({ length }, (_, i) => {
          const day = i + 1;
          const isSelected =
            selectedJalali?.year === view.year &&
            selectedJalali.month === view.month &&
            selectedJalali.day === day;
          const isToday =
            todayJalali.year === view.year &&
            todayJalali.month === view.month &&
            todayJalali.day === day;

          return (
            <button
              key={day}
              type="button"
              onClick={() =>
                onChoose(toGregorian({ year: view.year, month: view.month, day }))
              }
              aria-pressed={isSelected}
              className={cn(
                'rounded-md py-1.5 text-[12px] text-ink',
                'hover:bg-elev',
                isToday && 'font-bold text-brand',
                isSelected && 'bg-brand font-bold text-brand-fg hover:bg-brand',
              )}
            >
              {faDigits(day)}
            </button>
          );
        })}
      </div>

      <div className="mt-2.5 flex gap-1.5 border-t border-border pt-2.5">
        <button
          type="button"
          onClick={() => onChoose(today)}
          className={cn(control, 'flex-1 font-semibold')}
        >
          امروز
        </button>
        <button
          type="button"
          onClick={onClear}
          className={cn(control, 'flex-1 font-semibold text-muted')}
        >
          پاک کردن
        </button>
      </div>
    </div>
  );
}
/**
 * @file jalali-date-field.tsx
 * @description Provides the admin filter bar's Jalali date picker with year and month selection.
 */
