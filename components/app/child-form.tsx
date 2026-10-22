/**
 * @file child-form.tsx
 * @description Implements reusable add/edit child forms with validation and progressive photo upload.
 */

'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { InterestsPicker } from '@/components/app/interests-picker';
import { Modal, ModalHeader } from '@/components/app/dialog';
import { PhotoPicker } from '@/components/app/photo-picker';
import { Alert, Field, Input, Select, SubmitButton } from '@/components/form';
import { ApiError, api } from '@/lib/api';
import { faDigits } from '@/lib/fa';
import type { ChildDto } from '@/lib/types';
import { childPhotoUrl, uploadChildPhoto } from '@/lib/upload';

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
  const [firstName, setFirstName] = useState(child?.firstName ?? '');
  const [age, setAge] = useState(child?.age ?? 7);
  const [interests, setInterests] = useState<string[]>(child?.interests ?? []);
  const [photo, setPhoto] = useState<File | null>(null);
  const [progress, setProgress] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  /** Creates or updates the profile, then uploads a selected photo with progress. */
  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    // A story needs the child's photo, and a profile saved without one only
    // fails later, after the parent has paid. A new profile therefore starts
    // with a photo; an older one without it is warned about rather than blocked,
    // so fixing a typo in the name is still possible.
    if (!child && !photo) {
      setError(
        'عکس کودک را انتخاب کنید؛ بدون عکس نمی‌توان برای او ویدیو ساخت. اگر عکس را انتخاب کرده‌اید و این پیام را می‌بینید، دوباره «انتخاب فایل» را بزنید.',
      );
      return;
    }
    setSaving(true);

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

      <PhotoPicker
        title="عکس کودک"
        inputLabel="عکس کودک"
        required={!child?.hasPhoto}
        badge={child ? '(برای ساخت ویدیو لازم است)' : '(الزامی)'}
        currentSrc={
          child?.hasPhoto ? childPhotoUrl(child.id, child.photoVersion) : null
        }
        placeholder={<span className="font-display text-[30px]">{initial}</span>}
        progress={progress}
        onChange={setPhoto}
      />

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

/** Opens the shared child form pre-populated for an existing profile. */
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
