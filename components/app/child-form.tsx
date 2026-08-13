'use client';

import { useRouter } from 'next/navigation';
import { useRef, useState } from 'react';
import { InterestsPicker } from '@/components/app/interests-picker';
import { Modal, ModalHeader } from '@/components/app/dialog';
import { Alert, Field, Input, Select, SubmitButton } from '@/components/form';
import { ApiError, api } from '@/lib/api';
import { faDigits, faPercent } from '@/lib/fa';
import { AVATAR_GRADIENT } from '@/lib/story-art';
import type { ChildDto } from '@/lib/types';
import { faMegabytes, photoError, uploadChildPhoto } from '@/lib/upload';

const AGES = [3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

/**
 * One form for both «پروندهٔ کودک تازه» and «ویرایش پرونده» — the fields are
 * identical, only the request differs.
 */
function ChildForm({
  child,
  onDone,
  onCancel,
}: {
  child?: ChildDto;
  onDone: () => void;
  onCancel: () => void;
}) {
  const router = useRouter();
  const fileInput = useRef<HTMLInputElement>(null);

  const [firstName, setFirstName] = useState(child?.firstName ?? '');
  const [age, setAge] = useState(child?.age ?? 7);
  const [interests, setInterests] = useState<string[]>(child?.interests ?? []);
  const [photo, setPhoto] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [progress, setProgress] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  function pickPhoto(file: File | undefined) {
    if (!file) return;
    const problem = photoError(file);
    if (problem) {
      setError(problem);
      setPhoto(null);
      setPreview(null);
      return;
    }
    setError(null);
    setPhoto(file);
    setPreview(URL.createObjectURL(file));
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const body = { firstName: firstName.trim(), age, interests };
      const saved = child
        ? await api.patch<ChildDto>(`/children/${child.id}`, body)
        : await api.post<ChildDto>('/children', body);

      // The profile exists first; the photo is a second, resumable step, so a
      // failed upload never costs the parent the whole form.
      if (photo) {
        setProgress(0);
        await uploadChildPhoto(saved.id, photo, setProgress);
      }

      router.refresh();
      onDone();
    } catch (err) {
      setError(
        err instanceof ApiError || err instanceof Error
          ? err.message
          : 'ذخیره نشد. دوباره تلاش کنید.',
      );
    } finally {
      setSaving(false);
      setProgress(null);
    }
  }

  const initial = firstName.trim().slice(0, 1) || '؟';

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      {error ? (
        <Alert tone="error" icon="✕">
          {error}
        </Alert>
      ) : null}

      <div>
        <p className="mb-2 text-[13.5px] font-bold">عکس کودک</p>
        <div className="flex items-center gap-3.5">
          {preview ? (
            // Local object URL for the file the parent just picked.
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={preview}
              alt=""
              className="size-22 flex-none rounded-full border border-border object-cover"
            />
          ) : (
            <span
              aria-hidden
              style={{ backgroundImage: AVATAR_GRADIENT }}
              className="grid size-22 flex-none place-items-center rounded-full font-display text-[30px] text-brand-fg"
            >
              {initial}
            </span>
          )}

          <div className="flex-1">
            <p className="mb-2 text-[12.5px] leading-[1.8] text-muted">
              صورت رو به دوربین، حداکثر ۱۰ مگابایت، JPG یا PNG.
            </p>
            <div className="flex flex-wrap gap-2">
              <input
                ref={fileInput}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="sr-only"
                onChange={(event) => pickPhoto(event.target.files?.[0])}
              />
              <button
                type="button"
                onClick={() => fileInput.current?.click()}
                className="rounded-[10px] border border-border bg-elev px-3 py-2 text-[12.5px] font-semibold"
              >
                انتخاب فایل
              </button>
              {photo ? (
                <button
                  type="button"
                  onClick={() => {
                    setPhoto(null);
                    setPreview(null);
                    if (fileInput.current) fileInput.current.value = '';
                  }}
                  className="rounded-[10px] border border-border bg-elev px-3 py-2 text-[12.5px] text-error"
                >
                  حذف
                </button>
              ) : null}
            </div>
          </div>
        </div>

        {progress !== null && photo ? (
          <div className="mt-3 flex items-center gap-2.5">
            <span className="h-1.5 flex-1 overflow-hidden rounded bg-border">
              <span
                className="block h-full bg-brand transition-[width]"
                style={{ width: `${Math.round(progress * 100)}%` }}
              />
            </span>
            <span className="text-xs text-muted">
              {faPercent(progress * 100)} · {faMegabytes(photo.size)}
            </span>
          </div>
        ) : null}
      </div>

      <Field label="نام کودک">
        <Input
          name="firstName"
          value={firstName}
          onChange={(event) => setFirstName(event.target.value)}
          required
          minLength={2}
          maxLength={40}
          placeholder="آوا"
        />
      </Field>

      <Field label="سن">
        <Select
          name="age"
          value={age}
          onChange={(event) => setAge(Number(event.target.value))}
        >
          {AGES.map((value) => (
            <option key={value} value={value}>
              {faDigits(value)}
            </option>
          ))}
        </Select>
      </Field>

      <div>
        <p className="mb-2 text-[13.5px] font-bold">
          علاقه‌ها <span className="font-normal text-muted">(اختیاری)</span>
        </p>
        <InterestsPicker value={interests} onChange={setInterests} />
      </div>

      <div className="flex gap-3 rounded-2xl border border-border bg-elev px-4 py-3.5">
        <span aria-hidden className="text-success">
          🛡
        </span>
        <p className="text-[12.5px] leading-[1.85] text-muted">
          عکس کودک شما خصوصی است و فقط برای شخصی‌سازی قصه‌هایش استفاده می‌شود.
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
          ذخیرهٔ پرونده
        </SubmitButton>
      </div>
    </form>
  );
}

/** «+ افزودن کودک» — the right-anchored drawer from the design. */
export function AddChildButton({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className={className}>
        {children}
      </button>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        label="افزودن کودک"
        variant="drawer"
      >
        <ModalHeader title="پروندهٔ کودک تازه" onClose={() => setOpen(false)} />
        {/* Remounts per open, so a cancelled draft never comes back. */}
        {open ? (
          <ChildForm onDone={() => setOpen(false)} onCancel={() => setOpen(false)} />
        ) : null}
      </Modal>
    </>
  );
}

export function EditChildButton({ child }: { child: ChildDto }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="rounded-[14px] border border-border bg-elev px-4 py-3 text-[14px] font-semibold"
      >
        ویرایش پرونده
      </button>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        label="ویرایش پرونده"
        variant="drawer"
      >
        <ModalHeader
          title={`پروندهٔ ${child.firstName}`}
          onClose={() => setOpen(false)}
        />
        {open ? (
          <ChildForm
            child={child}
            onDone={() => setOpen(false)}
            onCancel={() => setOpen(false)}
          />
        ) : null}
      </Modal>
    </>
  );
}
