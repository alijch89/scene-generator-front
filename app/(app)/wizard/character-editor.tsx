/**
 * @file character-editor.tsx
 * @description Renders the four optional supporting-character slots, their saved-relation picker, and local photo previews.
 */

'use client';

import { useEffect, useState } from 'react';
import { API_URL } from '@/lib/api';
import { faDigits } from '@/lib/fa';
import type { ChildRelationDto } from '@/lib/types';
import { cn } from '@/lib/utils';
import { RELATION_EXAMPLES, type CharacterDraft } from './wizard-state';

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

/** Reads the selected local file directly so the preview does not depend on blob URLs. */
function CharacterPhotoPreview({ file, name }: { file: File; name: string }) {
  const [source, setSource] = useState("");

  useEffect(() => {
    let active = true;
    const reader = new FileReader();

    reader.addEventListener("load", () => {
      if (active && typeof reader.result === "string") {
        setSource(reader.result);
      }
    });
    reader.readAsDataURL(file);

    return () => {
      active = false;
      if (reader.readyState === FileReader.LOADING) reader.abort();
    };
  }, [file]);

  if (!source) {
    return (
      <span className="grid size-20 flex-none animate-pulse place-items-center rounded-xl border border-border bg-elev text-[11px] text-muted">
        آماده‌سازی…
      </span>
    );
  }

  return (
    <span
      role="img"
      aria-label={`پیش‌نمایش عکس ${name || "شخصیت"}`}
      style={{ backgroundImage: `url("${source}")` }}
      className="size-20 flex-none rounded-xl border border-border bg-cover bg-center bg-no-repeat"
    />
  );
}

/** Always-visible editor for the four supporting-character multipart slots. */
export function CharacterEditor({
  characters,
  savedRelations,
  childId,
  valid,
  onAdd,
  onReuse,
  onUpdate,
  onRemove,
  onPhoto,
}: {
  characters: CharacterDraft[];
  savedRelations: ChildRelationDto[];
  childId: string;
  valid: boolean;
  onAdd: () => void;
  onReuse: (relation: ChildRelationDto) => void;
  onUpdate: (index: number, patch: Partial<CharacterDraft>) => void;
  onRemove: (index: number) => void;
  onPhoto: (index: number, file?: File) => void;
}) {
  return (
    <fieldset className="rounded-[20px] border border-border bg-surface p-[18px_20px_20px] shadow-card">
      <legend className="px-1.5 text-[14.5px] font-bold">
        شخصیت‌های جانبی و نزدیکان (اختیاری)
      </legend>
      <p className="mb-4 text-[12.5px] leading-[1.8] text-muted">
        تا چهار نفر را با نام، نسبت با کودک و عکس معرفی کنید. نسبت‌های پیشنهادی
        قابل انتخاب‌اند و می‌توانید عبارت خودتان را هم بنویسید. شخصیت تازه برای
        قصه‌های بعدی ذخیره می‌شود.
      </p>
      {savedRelations.length ? (
        <div className="mb-4 rounded-[14px] border border-border bg-elev p-3.5">
          <p className="mb-2.5 text-[12.5px] font-bold text-warm">
            استفاده از شخصیت‌های ذخیره‌شده
          </p>
          <div className="flex flex-wrap gap-2">
            {savedRelations.map((relation) => {
              const selected = characters.some(
                (character) => character.savedRelationId === relation.id,
              );
              return (
                <button
                  key={relation.id}
                  type="button"
                  disabled={selected || characters.length >= 4}
                  onClick={() => onReuse(relation)}
                  className="flex items-center gap-2 rounded-full border border-border bg-surface py-1.5 ps-2 pe-3 text-[12.5px] disabled:cursor-not-allowed disabled:opacity-45"
                >
                  {relation.hasPhoto ? (
                    // Private, credentialed API image; next/image cannot proxy it.
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={`${API_URL}/children/${childId}/relations/${relation.id}/photo`}
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
                  <span aria-hidden>{selected ? "✓" : "+"}</span>
                </button>
              );
            })}
          </div>
        </div>
      ) : null}
      <button
        type="button"
        disabled={characters.length >= 4}
        onClick={onAdd}
        className="mb-4 rounded-[12px] border border-brand bg-elev px-4 py-2.5 text-[13px] font-semibold text-brand disabled:cursor-not-allowed disabled:opacity-45"
      >
        + افزودن شخصیت
      </button>
      <div className="grid gap-3 sm:grid-cols-2">
        {characters.map((character, index) => (
          <section
            key={index}
            className="rounded-[16px] border border-border bg-elev p-4"
          >
            <strong className="mb-3 block text-[13.5px]">
              شخصیت {faDigits(index + 1)}
            </strong>
            {character.savedRelationId ? (
              <span className="mb-3 inline-block rounded-full bg-surface px-2.5 py-1 text-[11.5px] font-semibold text-brand">
                انتخاب‌شده از نزدیکان ذخیره‌شده
              </span>
            ) : null}
            <div className="flex flex-col gap-3">
              <label className="flex flex-col gap-1.5 text-[12px] text-muted">
                نام
                <input
                  maxLength={40}
                  disabled={Boolean(character.savedRelationId)}
                  value={character.name}
                  onChange={(event) =>
                    onUpdate(index, { name: event.target.value })
                  }
                  placeholder={["سارا", "مجید", "سعید", "پریسا"][index]}
                  className="rounded-[11px] border border-border bg-surface px-3 py-2.5 text-[13.5px] text-ink"
                />
              </label>
              <div className="flex flex-col gap-1.5 text-[12px] text-muted">
                نسبت با کودک
                <select
                  aria-label={`نسبت پیشنهادی شخصیت ${index + 1}`}
                  disabled={Boolean(character.savedRelationId)}
                  value={
                    RELATION_EXAMPLES.includes(character.relation)
                      ? character.relation
                      : ""
                  }
                  onChange={(event) =>
                    onUpdate(index, { relation: event.target.value })
                  }
                  className="rounded-[11px] border border-border bg-surface px-3 py-2.5 text-[13.5px] text-ink"
                >
                  <option value="">انتخاب نسبت پیشنهادی</option>
                  {RELATION_EXAMPLES.map((relation) => (
                    <option key={relation} value={relation}>
                      {relation}
                    </option>
                  ))}
                </select>
                <input
                  aria-label={`نسبت دلخواه شخصیت ${index + 1}`}
                  maxLength={40}
                  disabled={Boolean(character.savedRelationId)}
                  value={character.relation}
                  onChange={(event) =>
                    onUpdate(index, { relation: event.target.value })
                  }
                  placeholder="یا نسبت دلخواه را بنویسید"
                  className="rounded-[11px] border border-border bg-surface px-3 py-2.5 text-[13.5px] text-ink"
                />
              </div>
              <label className="flex cursor-pointer flex-col gap-1.5 text-[12px] text-muted">
                عکس شخصیت
                <span className="flex min-h-24 items-center gap-3 rounded-[11px] border border-dashed border-border bg-surface px-3 py-2.5 text-[12.5px] text-ink">
                  {character.photo ? (
                    <CharacterPhotoPreview
                      key={`${character.photo.name}-${character.photo.size}-${character.photo.lastModified}`}
                      file={character.photo}
                      name={character.name}
                    />
                  ) : character.savedRelationId && character.hasSavedPhoto ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={`${API_URL}/children/${childId}/relations/${character.savedRelationId}/photo`}
                      alt={`عکس ${character.name}`}
                      crossOrigin="use-credentials"
                      className="size-20 flex-none rounded-xl border border-border object-cover"
                    />
                  ) : (
                    <span className="grid size-20 flex-none place-items-center rounded-xl bg-elev text-[24px] text-muted">
                      +
                    </span>
                  )}
                  <span className="min-w-0 break-all">
                    {character.photo
                      ? `${character.photo.name} · برای تغییر عکس کلیک کنید`
                      : character.savedRelationId && character.hasSavedPhoto
                        ? "عکس ذخیره‌شده"
                        : character.savedRelationId
                          ? "بدون عکس"
                          : "انتخاب عکس JPG، PNG یا WebP"}
                  </span>
                </span>
                <input
                  type="file"
                  disabled={Boolean(character.savedRelationId)}
                  accept="image/jpeg,image/png,image/webp"
                  className="sr-only"
                  onChange={(event) => onPhoto(index, event.target.files?.[0])}
                />
              </label>
              {character.photo ? (
                <button
                  type="button"
                  onClick={() => onUpdate(index, { photo: null })}
                  className="self-start text-[12px] text-error"
                >
                  حذف عکس
                </button>
              ) : null}
              <button
                type="button"
                onClick={() => onRemove(index)}
                className="self-start text-[12px] font-semibold text-error"
              >
                حذف این شخصیت
              </button>
            </div>
          </section>
        ))}
      </div>
      {!characters.length ? (
        <p className="rounded-[12px] border border-dashed border-border px-4 py-5 text-center text-[12.5px] text-muted">
          هنوز شخصیت جانبی اضافه نشده است. روی «افزودن شخصیت» بزنید.
        </p>
      ) : null}
      {!valid ? (
        <p className="mt-3 text-[12.5px] text-error">
          برای شخصیتی که نسبت یا عکس دارد، نام را هم وارد کنید.
        </p>
      ) : null}
    </fieldset>
  );
}
