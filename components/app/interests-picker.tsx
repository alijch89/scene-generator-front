'use client';

import { useState } from 'react';
import { MAX_INTERESTS, SUGGESTED_INTERESTS } from '@/lib/interests';
import { cn } from '@/lib/utils';

/**
 * Selected interests carry a ✕, suggestions a +. Same control in the add
 * drawer and on the child's علاقه‌ها tab.
 */
export function InterestsPicker({
  value,
  onChange,
  disabled,
}: {
  value: string[];
  onChange: (next: string[]) => void;
  disabled?: boolean;
}) {
  const [draft, setDraft] = useState('');
  const suggestions = SUGGESTED_INTERESTS.filter((s) => !value.includes(s));

  const add = (interest: string) => {
    const clean = interest.trim();
    if (!clean || value.includes(clean) || value.length >= MAX_INTERESTS) return;
    onChange([...value, clean]);
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap gap-2">
        {value.map((interest) => (
          <button
            key={interest}
            type="button"
            disabled={disabled}
            onClick={() => onChange(value.filter((i) => i !== interest))}
            aria-label={`حذف ${interest}`}
            className="rounded-full bg-brand px-3.5 py-2 text-[13px] font-semibold text-brand-fg"
          >
            {interest} ✕
          </button>
        ))}
        {suggestions.map((interest) => (
          <button
            key={interest}
            type="button"
            disabled={disabled || value.length >= MAX_INTERESTS}
            onClick={() => add(interest)}
            aria-label={`افزودن ${interest}`}
            className={cn(
              'rounded-full border border-border bg-elev px-3.5 py-2 text-[13px]',
              value.length >= MAX_INTERESTS && 'opacity-50',
            )}
          >
            + {interest}
          </button>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={draft}
          disabled={disabled || value.length >= MAX_INTERESTS}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={(event) => {
            // Enter must not submit the surrounding form.
            if (event.key !== 'Enter') return;
            event.preventDefault();
            add(draft);
            setDraft('');
          }}
          placeholder="علاقهٔ دیگری بنویسید"
          maxLength={30}
          className="flex-1 rounded-[13px] border border-border bg-surface px-3.5 py-2.5 text-[13.5px] text-ink"
        />
        <button
          type="button"
          disabled={disabled || !draft.trim()}
          onClick={() => {
            add(draft);
            setDraft('');
          }}
          className="rounded-[13px] border border-border bg-elev px-4 text-[13px] font-semibold disabled:opacity-50"
        >
          افزودن
        </button>
      </div>
    </div>
  );
}
