/**
 * @file wizard-form.tsx
 * @description Drives the four-step story wizard, its draft state, and the handoff to payment.
 */

'use client';

import { useReducer, useState } from 'react';
import { Alert } from '@/components/form';
import { ApiError, api } from '@/lib/api';
import { faDigits } from '@/lib/fa';
import { photoError } from '@/lib/upload';
import type {
  ChildDto,
  ChildRelationDto,
  CreatedStory,
  StoryLength,
} from '@/lib/types';
import { cn } from '@/lib/utils';
import { CustomizeStep } from './steps/customize-step';
import { HeroStep } from './steps/hero-step';
import { PreviewStep } from './steps/preview-step';
import { ThemeStep } from './steps/theme-step';
import {
  HINTS,
  STEPS,
  initialDraft,
  isBlocked,
  topicOf,
  wizardReducer,
} from './wizard-state';

/**
 * Manages all four wizard steps and redirects to the returned payment URL.
 *
 * This file used to be the whole wizard: 1,218 lines and about twenty
 * `useState` calls, several of which had to be updated together — choosing a
 * child also re-suggested an age range and cleared the supporting characters,
 * a length preset also set the scene count, a style preset also set the
 * art-direction phrase. Those couplings lived in click handlers, where the
 * next person to add another way of choosing a child had no reason to find
 * them. They live in {@link wizardReducer} now, and each step renders from
 * one draft object.
 */
export function WizardForm({
  childProfiles,
  relationsByChild = {},
  initialChildId,
  initialIdea,
  prices,
}: {
  childProfiles: ChildDto[];
  relationsByChild?: Record<string, ChildRelationDto[]>;
  initialChildId?: string;
  initialIdea?: string;
  prices: Record<StoryLength, number>;
}) {
  const [draft, dispatch] = useReducer(
    wizardReducer,
    { childProfiles, initialChildId, initialIdea },
    initialDraft,
  );
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const child = childProfiles.find((profile) => profile.id === draft.childId);
  const hero = child?.firstName ?? 'کودک شما';
  const topic = topicOf(draft);
  const blocked = isBlocked(draft);
  const savedRelations = relationsByChild[draft.childId] ?? [];

  /** Keeps a selected supporting-character photo only when it is uploadable. */
  function selectCharacterPhoto(index: number, file?: File) {
    if (!file) {
      dispatch({ type: 'character/update', index, patch: { photo: null } });
      return;
    }
    const problem = photoError(file);
    if (problem) {
      setError(problem);
      return;
    }
    setError(null);
    dispatch({ type: 'character/update', index, patch: { photo: file } });
  }

  /** Validates the final selection, creates the story/order, and starts payment. */
  async function submit() {
    setBusy(true);
    setError(null);
    try {
      const form = new FormData();
      form.append('childId', draft.childId);
      form.append('theme', draft.theme);
      if (draft.theme === 'OWN') form.append('ownIdea', draft.ownIdea.trim());
      form.append('length', draft.length);
      form.append('tone', draft.tone);
      form.append('style', draft.style);
      form.append('topic', topic);
      form.append('story_considerations', draft.storyConsiderations.trim());
      form.append('mode', 'video');
      form.append('art_style', draft.artStyle.trim());
      form.append('desired_moral', draft.desiredMoral.trim());
      form.append('n_scenes', String(draft.nScenes));
      form.append('age_range', draft.ageRange.trim());
      draft.characters.forEach((character, index) => {
        const slot = index + 1;
        form.append(`additional_character_${slot}_name`, character.name.trim());
        form.append(
          `additional_character_${slot}_relation`,
          character.relation.trim(),
        );
        if (character.savedRelationId) {
          form.append(
            `additional_character_${slot}_relation_id`,
            character.savedRelationId,
          );
        }
        if (character.photo) {
          form.append(`additional_character_${slot}_photo`, character.photo);
        }
      });

      const created = await api.post<CreatedStory>('/stories', form);
      // Straight to the gateway — nothing is generated until it confirms.
      window.location.href = created.payUrl;
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : 'ساخت قصه ممکن نشد. دوباره تلاش کنید.',
      );
      setBusy(false);
    }
  }

  return (
    <div className="pb-28 sm:pb-24">
      {/* step rail */}
      <nav
        aria-label="مراحل ساخت قصه"
        className="mb-7 flex flex-wrap items-center gap-2 rounded-full border border-border bg-elev px-3 py-1.5"
      >
        {STEPS.map((label, i) => (
          <span key={label} className="flex items-center gap-2">
            {i > 0 ? (
              <span aria-hidden className="h-0.75 w-5.5 rounded-sm bg-border" />
            ) : null}
            <span
              aria-current={draft.step === i + 1 ? 'step' : undefined}
              className={cn(
                'text-[12.5px] font-semibold',
                draft.step >= i + 1 ? 'text-ink' : 'text-muted',
              )}
            >
              {faDigits(i + 1)} {label}
            </span>
          </span>
        ))}
      </nav>

      {error ? (
        <Alert tone="error" icon="!">
          {error}
        </Alert>
      ) : null}

      <p className="mb-2 text-[13px] font-bold tracking-wide text-warm">
        گام {faDigits(draft.step)} از ۴
      </p>

      {draft.step === 1 ? (
        <HeroStep
          draft={draft}
          childProfiles={childProfiles}
          dispatch={dispatch}
        />
      ) : null}

      {draft.step === 2 ? (
        <ThemeStep draft={draft} hero={hero} dispatch={dispatch} />
      ) : null}

      {draft.step === 3 ? (
        <CustomizeStep
          draft={draft}
          hero={hero}
          prices={prices}
          savedRelations={savedRelations}
          dispatch={dispatch}
          onPhoto={selectCharacterPhoto}
        />
      ) : null}

      {draft.step === 4 ? (
        <PreviewStep
          draft={draft}
          child={child}
          hero={hero}
          topic={topic}
          prices={prices}
        />
      ) : null}

      {/* sticky footer, exactly as in the design */}
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-[color-mix(in_srgb,var(--sh-bg)_90%,transparent)] backdrop-blur-lg">
        <div className="mx-auto flex max-w-295 items-center gap-3.5 px-5 py-3.5">
          <button
            type="button"
            disabled={draft.step === 1 || busy}
            onClick={() => dispatch({ type: 'back' })}
            className="rounded-[15px] border border-border bg-surface px-5 py-3.25 text-[14.5px] font-semibold text-muted disabled:opacity-45"
          >
            → مرحلهٔ قبل
          </button>
          <p className="min-w-0 flex-1 truncate text-[13px] text-muted">
            {HINTS[draft.step - 1]}
          </p>
          <button
            type="button"
            disabled={blocked || busy}
            onClick={() =>
              draft.step === STEPS.length
                ? void submit()
                : dispatch({ type: 'next' })
            }
            className={cn(
              'rounded-[15px] bg-linear-to-br from-brand to-warm px-7.5 py-3.5',
              'text-[15.5px] font-bold text-brand-fg shadow-card',
              'transition-transform duration-200 hover:-translate-y-0.5',
              (blocked || busy) && 'opacity-60',
            )}
          >
            {busy
              ? 'در حال رفتن به پرداخت…'
              : draft.step === STEPS.length
                ? 'ادامه و پرداخت ✦'
                : 'ادامه'}
          </button>
        </div>
      </div>
    </div>
  );
}
