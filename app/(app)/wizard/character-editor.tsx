/**
 * @file character-editor.tsx
 * @description Lets a parent pick up to four saved characters for a story and points to the profile where they are made.
 */

'use client';

import Link from 'next/link';
import { faDigits } from '@/lib/fa';
import { relationMissing, relationPhotoUrl } from '@/lib/relations';
import type { ChildRelationDto } from '@/lib/types';
import { cn } from '@/lib/utils';
import { characterProblem, type CharacterDraft } from './wizard-state';

/** Compact selectable examples that still leave the associated field editable. */
export function Suggestions({
  values,
  selected,
  onSelect,
}: {
  values: readonly string[];
  selected: string;
  onSelect: (value: string) => void;
}) {
  return (
    <div className="mb-3 flex flex-wrap gap-2">
      {values.map((value) => (
        <button
          key={value}
          type="button"
          aria-pressed={selected === value}
          onClick={() => onSelect(value)}
          className={cn(
            "rounded-full border border-border bg-elev px-3 py-2 text-[12.5px]",
            selected === value && "border-brand bg-surface text-brand",
          )}
        >
          {value}
        </button>
      ))}
    </div>
  );
}

/**
 * Picks supporting characters from the ones saved on the child's profile.
 *
 * A character is made — name, relation and photo together — on the profile, so
 * nothing half-filled can be started here. A saved person who is missing
 * something cannot be picked, and says what is missing.
 */
export function CharacterEditor({
  characters,
  savedRelations,
  childId,
  valid,
  onReuse,
  onRemove,
}: {
  characters: CharacterDraft[];
  savedRelations: ChildRelationDto[];
  childId: string;
  valid: boolean;
  onReuse: (relation: ChildRelationDto) => void;
  onRemove: (index: number) => void;
}) {
  const manage = `/children/${childId}?tab=characters`;

  return (
    <fieldset className="rounded-[20px] border border-border bg-surface p-[18px_20px_20px] shadow-card">
      <legend className="px-1.5 text-[14.5px] font-bold">
        شخصیت‌های جانبی و نزدیکان (اختیاری)
      </legend>
      <p className="mb-4 text-[12.5px] leading-[1.8] text-muted">
        تا چهار نفر از شخصیت‌های ذخیره‌شدهٔ این کودک را انتخاب کنید. هر شخصیت
        باید نام، نسبت و عکس داشته باشد؛ آن‌ها را در پروفایل کودک می‌سازید و
        ویرایش می‌کنید.
      </p>

      {savedRelations.length ? (
        <div className="mb-4 rounded-[14px] border border-border bg-elev p-3.5">
          <p className="mb-2.5 text-[12.5px] font-bold text-warm">
            شخصیت‌های ذخیره‌شده
          </p>
          <div className="flex flex-wrap gap-2">
            {savedRelations.map((relation) => {
              const selected = characters.some(
                (character) => character.savedRelationId === relation.id,
              );
              const missing = relationMissing(relation);
              const incomplete = missing.length > 0;
              return (
                <button
                  key={relation.id}
                  type="button"
                  disabled={selected || incomplete || characters.length >= 4}
                  title={
                    incomplete
                      ? `ناقص است (${missing.join('، ')}) — در پروفایل کودک کاملش کنید`
                      : undefined
                  }
                  onClick={() => onReuse(relation)}
                  className="flex items-center gap-2 rounded-full border border-border bg-surface py-1.5 ps-2 pe-3 text-[12.5px] disabled:cursor-not-allowed disabled:opacity-45"
                >
                  {relation.hasPhoto ? (
                    // Private, credentialed API image; next/image cannot proxy it.
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={relationPhotoUrl(childId, relation.id, relation.updatedAt)}
                      alt=""
                      crossOrigin="use-credentials"
                      className="size-7 rounded-full border border-border object-cover"
                    />
                  ) : (
                    <span
                      aria-hidden
                      className="grid size-7 place-items-center rounded-full bg-elev font-bold text-brand"
                    >
                      {relation.name.slice(0, 1)}
                    </span>
                  )}
                  <span>
                    {relation.name}
                    {relation.relation ? ` · ${relation.relation}` : ""}
                  </span>
                  <span aria-hidden>
                    {incomplete ? "ناقص" : selected ? "✓" : "+"}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      ) : (
        <p className="mb-4 rounded-[12px] border border-dashed border-border px-4 py-4 text-[12.5px] leading-[1.8] text-muted">
          هنوز شخصیتی برای این کودک ذخیره نشده است.
        </p>
      )}

      <Link
        href={manage}
        className="mb-4 inline-block rounded-[12px] border border-brand bg-elev px-4 py-2.5 text-[13px] font-semibold text-brand hover:no-underline"
      >
        افزودن یا ویرایش شخصیت‌ها در پروفایل کودک ←
      </Link>

      <div className="grid gap-3 sm:grid-cols-2">
        {characters.map((character, index) => {
          const problem = characterProblem(character);
          return (
            <section
              key={character.savedRelationId ?? index}
              className="rounded-[16px] border border-border bg-elev p-4"
            >
              <strong className="mb-3 block text-[13.5px]">
                شخصیت {faDigits(index + 1)}
              </strong>
              <div className="flex items-center gap-3">
                {character.savedRelationId && character.hasSavedPhoto ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={relationPhotoUrl(
                      childId,
                      character.savedRelationId,
                      character.photoVersion,
                    )}
                    alt={`عکس ${character.name}`}
                    crossOrigin="use-credentials"
                    className="size-20 flex-none rounded-xl border border-border object-cover"
                  />
                ) : (
                  <span className="grid size-20 flex-none place-items-center rounded-xl bg-surface text-[24px] text-muted">
                    ؟
                  </span>
                )}
                <div className="min-w-0">
                  <p className="truncate text-[14px] font-bold">
                    {character.name}
                  </p>
                  <p className="truncate text-[12.5px] text-muted">
                    {character.relation}
                  </p>
                </div>
              </div>
              {problem ? (
                <p className="mt-3 text-[12px] leading-[1.8] text-error">
                  {problem}
                </p>
              ) : null}
              <button
                type="button"
                onClick={() => onRemove(index)}
                className="mt-3 text-[12px] font-semibold text-error"
              >
                حذف از این قصه
              </button>
            </section>
          );
        })}
      </div>
      {!characters.length ? (
        <p className="rounded-[12px] border border-dashed border-border px-4 py-5 text-center text-[12.5px] text-muted">
          هنوز شخصیتی برای این قصه انتخاب نشده است.
        </p>
      ) : null}
      {!valid ? (
        <p className="mt-3 text-[12.5px] text-error">
          یکی از شخصیت‌ها ناقص است؛ آن را کامل یا حذف کنید.
        </p>
      ) : null}
    </fieldset>
  );
}
