/**
 * @file child-characters.tsx
 * @description Lists, adds, edits, and deletes a child's saved supporting characters, each kept whole with name, relation, and photo.
 */

'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Modal, ModalHeader } from '@/components/app/dialog';
import { PhotoPicker } from '@/components/app/photo-picker';
import { Alert, Field, Input, SubmitButton } from '@/components/form';
import { ApiError, api } from '@/lib/api';
import { faDigits } from '@/lib/fa';
import {
  MAX_RELATIONS_PER_CHILD,
  RELATION_EXAMPLES,
  relationMissing,
  relationPhotoUrl,
} from '@/lib/relations';
import type { ChildDto, ChildRelationDto } from '@/lib/types';
import { cn } from '@/lib/utils';

const errorText = (err: unknown) =>
  err instanceof ApiError || err instanceof Error
    ? err.message
    : 'ذخیره نشد. دوباره تلاش کنید.';

/**
 * One form for «شخصیت تازه» and «ویرایش شخصیت».
 *
 * A character is saved whole: name, relation and photo go in one request, and
 * the photo is required until the character has one. Editing can change any of
 * them; picking a new photo replaces the stored one.
 */
function CharacterForm({
  child,
  relation,
  onDone,
  onCancel,
}: {
  child: ChildDto;
  relation?: ChildRelationDto;
  onDone: () => void;
  onCancel: () => void;
}) {
  const router = useRouter();
  const [name, setName] = useState(relation?.name ?? '');
  const [kind, setKind] = useState(relation?.relation ?? '');
  const [photo, setPhoto] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const hasStoredPhoto = Boolean(relation?.hasPhoto);

  /** Saves the character; refuses to send one that would be incomplete. */
  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const missing = [
      !name.trim() && 'نام',
      !kind.trim() && 'نسبت',
      !photo && !hasStoredPhoto && 'عکس',
    ].filter(Boolean);
    if (missing.length) {
      setError(`شخصیت باید کامل باشد؛ ${missing.join('، ')} را وارد کنید.`);
      return;
    }

    setSaving(true);
    try {
      const form = new FormData();
      form.append('name', name.trim());
      form.append('relation', kind.trim());
      if (photo) form.append('photo', photo);

      if (relation) {
        await api.patch(`/children/${child.id}/relations/${relation.id}`, form);
      } else {
        await api.post(`/children/${child.id}/relations`, form);
      }
      router.refresh();
      onDone();
    } catch (err) {
      setError(errorText(err));
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      {error ? (
        <Alert tone="error" icon="✕">
          {error}
        </Alert>
      ) : null}

      <PhotoPicker
        title="عکس شخصیت"
        inputLabel="عکس شخصیت"
        required
        shape="rounded"
        currentSrc={
          relation?.hasPhoto
            ? relationPhotoUrl(child.id, relation.id, relation.updatedAt)
            : null
        }
        placeholder="+"
        onChange={setPhoto}
      />

      <Field label="نام">
        <Input
          value={name}
          onChange={(event) => setName(event.target.value)}
          maxLength={40}
          placeholder="سارا"
        />
      </Field>

      <div>
        <Field label="نسبت با کودک">
          <Input
            value={kind}
            onChange={(event) => setKind(event.target.value)}
            maxLength={40}
            placeholder="مادر"
          />
        </Field>
        <div className="mt-2.5 flex flex-wrap gap-2">
          {RELATION_EXAMPLES.map((value) => (
            <button
              key={value}
              type="button"
              aria-pressed={kind === value}
              onClick={() => setKind(value)}
              className={cn(
                'rounded-full border border-border bg-elev px-3 py-1.5 text-[12.5px]',
                kind === value && 'border-brand bg-surface text-brand',
              )}
            >
              {value}
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-3 rounded-2xl border border-border bg-elev px-4 py-3.5">
        <span aria-hidden className="text-success">
          🛡
        </span>
        <p className="text-[12.5px] leading-[1.85] text-muted">
          عکس شخصیت خصوصی است و فقط برای ساخت قصه‌های {child.firstName} به کار
          می‌رود. هر زمان بخواهید می‌توانید آن را عوض یا حذف کنید.
        </p>
      </div>

      <div className="flex gap-2.5">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 rounded-[15px] border border-border bg-elev p-3.5 text-[14px] font-bold"
        >
          انصراف
        </button>
        <SubmitButton
          loading={saving}
          loadingLabel="در حال ذخیره…"
          className="flex-2"
        >
          ذخیرهٔ شخصیت
        </SubmitButton>
      </div>
    </form>
  );
}

/** A button that opens {@link CharacterForm} in the right-anchored drawer. */
function CharacterDrawer({
  child,
  relation,
  trigger,
  className,
  disabled,
}: {
  child: ChildDto;
  relation?: ChildRelationDto;
  trigger: React.ReactNode;
  className?: string;
  disabled?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const title = relation ? `ویرایش ${relation.name}` : 'شخصیت تازه';

  return (
    <>
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen(true)}
        className={className}
      >
        {trigger}
      </button>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        label={title}
        variant="drawer"
      >
        <ModalHeader title={title} onClose={() => setOpen(false)} />
        {/* Remounts per open, so a cancelled draft never comes back. */}
        {open ? (
          <CharacterForm
            child={child}
            relation={relation}
            onDone={() => setOpen(false)}
            onCancel={() => setOpen(false)}
          />
        ) : null}
      </Modal>
    </>
  );
}

/** One saved character with its completeness, edit, and delete actions. */
function CharacterCard({
  child,
  relation,
}: {
  child: ChildDto;
  relation: ChildRelationDto;
}) {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const missing = relationMissing(relation);

  /** Deletes the character and its photo, then refreshes the list. */
  async function remove() {
    setBusy(true);
    setError(null);
    try {
      await api.delete(`/children/${child.id}/relations/${relation.id}`);
      router.refresh();
    } catch (err) {
      setError(errorText(err));
      setBusy(false);
    }
  }

  return (
    <article className="flex flex-col gap-3 rounded-[20px] border border-border bg-surface p-4 shadow-card">
      <div className="flex items-center gap-3.5">
        {relation.hasPhoto ? (
          // Private, credentialed API image; next/image cannot proxy it.
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={relationPhotoUrl(child.id, relation.id, relation.updatedAt)}
            alt={`عکس ${relation.name}`}
            crossOrigin="use-credentials"
            className="size-20 flex-none rounded-[16px] border border-border object-cover"
          />
        ) : (
          <span
            aria-hidden
            className="grid size-20 flex-none place-items-center rounded-[16px] bg-elev text-[24px] text-muted"
          >
            ؟
          </span>
        )}
        <div className="min-w-0">
          <h3 className="truncate text-[16px] font-bold">{relation.name}</h3>
          <p className="truncate text-[13px] text-muted">
            {relation.relation || 'نسبت ثبت نشده'}
          </p>
          <span
            className={cn(
              'mt-1.5 inline-block rounded-full px-2.5 py-0.5 text-[11.5px] font-semibold',
              missing.length
                ? 'bg-elev text-error'
                : 'bg-elev text-success',
            )}
          >
            {missing.length ? `ناقص: ${missing.join('، ')}` : 'کامل'}
          </span>
        </div>
      </div>

      {error ? (
        <p role="alert" className="text-[12.5px] text-error">
          {error}
        </p>
      ) : null}

      {confirming ? (
        <div className="flex flex-wrap items-center gap-2">
          <p className="basis-full text-[12.5px] leading-[1.8] text-muted">
            «{relation.name}» و عکسش حذف می‌شود. قصه‌هایی که ساخته‌ای می‌مانند.
          </p>
          <button
            type="button"
            disabled={busy}
            onClick={remove}
            className="rounded-[10px] bg-error px-3.5 py-2 text-[12.5px] font-bold text-white disabled:opacity-60"
          >
            {busy ? 'در حال حذف…' : 'بله، حذف کن'}
          </button>
          <button
            type="button"
            disabled={busy}
            onClick={() => setConfirming(false)}
            className="rounded-[10px] border border-border bg-elev px-3.5 py-2 text-[12.5px] font-semibold"
          >
            انصراف
          </button>
        </div>
      ) : (
        <div className="flex gap-2">
          <CharacterDrawer
            child={child}
            relation={relation}
            trigger="ویرایش"
            className="rounded-[10px] border border-border bg-elev px-3.5 py-2 text-[12.5px] font-semibold"
          />
          <button
            type="button"
            onClick={() => setConfirming(true)}
            className="rounded-[10px] border border-border bg-elev px-3.5 py-2 text-[12.5px] font-semibold text-error"
          >
            حذف
          </button>
        </div>
      )}
    </article>
  );
}

/** The «شخصیت‌ها» tab: everyone who can appear in this child's stories. */
export function ChildCharacters({
  child,
  relations,
}: {
  child: ChildDto;
  relations: ChildRelationDto[];
}) {
  const full = relations.length >= MAX_RELATIONS_PER_CHILD;

  return (
    <section>
      <div className="mb-5 flex flex-wrap items-center gap-3">
        <p className="min-w-0 flex-1 basis-80 text-[13.5px] leading-[1.9] text-muted">
          نزدیکان و دوستانی که می‌توانند در قصه‌های {child.firstName} باشند. هر
          شخصیت باید نام، نسبت و عکس داشته باشد؛ در مرحلهٔ «سفارشی‌سازی» ساخت
          قصه از همین فهرست انتخاب می‌شوند.
        </p>
        <CharacterDrawer
          child={child}
          disabled={full}
          trigger="+ افزودن شخصیت"
          className="rounded-[14px] border border-brand bg-elev px-4 py-3 text-[14px] font-semibold text-brand disabled:cursor-not-allowed disabled:opacity-45"
        />
      </div>

      {full ? (
        <p className="mb-4 text-[12.5px] text-muted">
          برای هر کودک حداکثر {faDigits(MAX_RELATIONS_PER_CHILD)} شخصیت ذخیره
          می‌شود؛ برای افزودن شخصیت تازه یکی را حذف کنید.
        </p>
      ) : null}

      {relations.length ? (
        <div className="grid gap-3.5 sm:grid-cols-[repeat(auto-fill,minmax(280px,1fr))]">
          {relations.map((relation) => (
            <CharacterCard key={relation.id} child={child} relation={relation} />
          ))}
        </div>
      ) : (
        <p className="rounded-[18px] border border-dashed border-border px-5 py-9 text-center text-[13.5px] leading-[1.9] text-muted">
          هنوز شخصیتی برای {child.firstName} ذخیره نشده است. با «افزودن
          شخصیت»، مادر، پدر یا دوستی را با عکسش بسازید.
        </p>
      )}
    </section>
  );
}
