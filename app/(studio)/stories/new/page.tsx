"use client";

import { ErrorMessage } from "@/components/error-message";
import { apiFetch } from "@/lib/api-client";
import type { Story, StoryCatalogs, StoryJob, StoryList } from "@/lib/types";
import { faDigits, STUB_CREDITS } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { LoaderCircle, Sparkles, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

/** User-entered story attributes retained across the creation wizard. */
interface Details {
  /** Story title. */
  title: string;
  /** Child name used for personalization. */
  childName: string;
  /** Child age. */
  childAge: number;
  /** Active topic slug. */
  topic: string;
  /** Active language code. */
  language: string;
  /** Requested narrative duration. */
  durationMinutes: number;
}

/** The creation wizard currently supports Persian stories only. */
const PERSIAN_LANGUAGE = {
  code: "fa",
  nativeName: "فارسی",
} as const;

/** Persian display names for the story topics offered by the catalog. */
const PERSIAN_TOPIC_NAMES: Record<string, string> = {
  adventure: "ماجراجویی",
  animals: "حیوانات",
  friendship: "دوستی",
  "space-adventure": "ماجراجویی فضایی",
  "fairy-tale": "قصهٔ پریان",
  bedtime: "قصهٔ شب",
};

/** Initial creation-wizard values before catalogs and user input arrive. */
const emptyDetails: Details = {
  title: "",
  childName: "",
  childAge: 5,
  topic: "",
  language: PERSIAN_LANGUAGE.code,
  durationMinutes: 10,
};

/**
 * Coordinates the three-step photo, details, and review creation workflow.
 *
 * Security:
 * The selected photo is previewed only through a temporary object URL, then
 * uploaded to an authenticated endpoint. The backend validates magic bytes,
 * consumes a user-scoped upload token, revalidates all story fields, and checks
 * active catalogs before generation.
 */
export default function CreateStoryPage() {
  const router = useRouter();
  const [step, setStep] = useState<0 | 1 | 2>(0);
  const [photo, setPhoto] = useState<File | null>(null);
  const [details, setDetails] = useState<Details>(emptyDetails);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const { data: catalogs } = useQuery({
    queryKey: ["story-catalogs"],
    queryFn: () => apiFetch<StoryCatalogs>("/api/stories/catalogs"),
  });
  const { data: recent } = useQuery({
    queryKey: ["stories", "recent-children"],
    queryFn: () =>
      apiFetch<StoryList>("/api/stories?limit=20&sortBy=createdAt&sortOrder=desc"),
  });
  const pastChildren = useMemo(() => {
    const seen = new Map<string, number>();
    for (const story of recent?.items ?? []) {
      if (!seen.has(story.childName)) seen.set(story.childName, story.childAge);
    }
    return [...seen.entries()];
  }, [recent]);

  const preview = useMemo(
    () => (photo ? URL.createObjectURL(photo) : null),
    [photo],
  );
  useEffect(() => () => { if (preview) URL.revokeObjectURL(preview); }, [preview]);

  // Seed the topic default once catalogs arrive, adjusted during render
  // (React's recommended pattern) rather than in an effect.
  const [catalogsSeeded, setCatalogsSeeded] = useState(false);
  if (catalogs && !catalogsSeeded) {
    setCatalogsSeeded(true);
    setDetails((d) => ({
      ...d,
      topic: d.topic || catalogs.topics[0]?.slug || "",
      language: PERSIAN_LANGUAGE.code,
    }));
  }

  const detailsValid =
    details.title.length >= 3 &&
    details.childName.length > 0 &&
    details.childAge > 0 &&
    details.topic &&
    details.language;

  /**
   * Uploads the photo, consumes the returned token in story creation, and
   * navigates to the resulting story.
   */
  async function generate() {
    if (!photo) return;
    setSubmitting(true);
    setError("");
    try {
      const upload = new FormData();
      upload.append("photo", photo);
      const uploaded = await apiFetch<{ uploadToken: string }>(
        "/api/storage/photos",
        { method: "POST", body: upload },
      );
      const result = await apiFetch<{ story: Story; job: StoryJob }>(
        "/api/stories",
        {
          method: "POST",
          body: JSON.stringify({
            title: details.title,
            topic: details.topic,
            language: details.language,
            childName: details.childName,
            childAge: details.childAge,
            durationMinutes: details.durationMinutes,
            childPhotoToken: uploaded.uploadToken,
          }),
        },
      );
      router.push(`/stories/${result.story.id}`);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "قصه ساخته نشد.");
      setSubmitting(false);
    }
  }

  const stepLabel = ["عکس", "جزئیات", "مرور"][step];

  return (
    <div className="mx-auto flex max-w-xl flex-col gap-5 px-5 py-8 sm:px-8">
      <header className="flex flex-col gap-3">
        <span className="text-sm font-semibold">قدم {faDigits(step + 1)} از ۳ — {stepLabel}</span>
        <div className="h-1.5 rounded-full bg-[var(--surface-3)]">
          <div
            className="h-full rounded-full bg-[var(--primary)] transition-all"
            style={{ width: `${((step + 1) / 3) * 100}%` }}
          />
        </div>
      </header>

      {step === 0 && (
        <StepUpload
          photo={photo}
          preview={preview}
          onSelect={setPhoto}
          onNext={() => setStep(1)}
        />
      )}

      {step === 1 && catalogs && (
        <StepDetails
          details={details}
          setDetails={setDetails}
          catalogs={catalogs}
          pastChildren={pastChildren}
          onBack={() => setStep(0)}
          onNext={() => setStep(2)}
          valid={Boolean(detailsValid)}
        />
      )}

      {step === 2 && (
        <StepReview
          photoPreview={preview}
          details={details}
          catalogs={catalogs}
          error={error}
          submitting={submitting}
          onBack={() => setStep(1)}
          onEditPhoto={() => setStep(0)}
          onGenerate={() => void generate()}
        />
      )}
    </div>
  );
}

/** Collects and previews the child photo selected for the new story. */
function StepUpload({
  photo,
  preview,
  onSelect,
  onNext,
}: {
  photo: File | null;
  preview: string | null;
  onSelect: (file: File | null) => void;
  onNext: () => void;
}) {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        <h1 className="m-0 text-[26px] font-extrabold">عکس کودک را بفرستید</h1>
        <p className="m-0 text-[15px] leading-loose text-[var(--ink-2)]">
          یک عکس روبه‌رو از چهره، در نور خوب. بهترین نتیجه با عکس بدون عینک
          آفتابی گرفته می‌شود.
        </p>
      </div>
      {preview ? (
        <div className="relative overflow-hidden rounded-2xl bg-[var(--surface-2)]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={preview}
            alt="عکس انتخاب‌شده"
            className="aspect-[4/5] w-full object-cover"
          />
          <button
            type="button"
            aria-label="حذف عکس"
            className="absolute end-3 top-3 grid size-9 place-items-center rounded-full bg-black/60 text-white"
            onClick={() => onSelect(null)}
          >
            <X className="size-4" />
          </button>
        </div>
      ) : (
        <label className="grid aspect-[4/5] cursor-pointer place-items-center gap-3 rounded-3xl border-2 border-dashed border-[var(--primary-border)] bg-[var(--surface)] text-center">
          <input
            className="sr-only"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={(event) => onSelect(event.target.files?.[0] ?? null)}
          />
          <span className="grid size-[66px] place-items-center rounded-[22px] bg-[var(--primary-soft)] text-2xl text-[var(--primary)]">
            ↑
          </span>
          <strong className="text-base font-semibold">انتخاب عکس</strong>
          <span className="text-[13px] text-[var(--ink-3)]">
            JPG یا PNG تا ۱۰ مگابایت
          </span>
        </label>
      )}
      <div className="flex gap-3 rounded-2xl bg-[var(--teal-soft)] p-4">
        <span className="text-lg">🛡️</span>
        <p className="m-0 text-[13.5px] leading-loose text-[var(--teal)]">
          عکس فقط برای ساخت همین قصه استفاده می‌شود، رمزنگاری می‌شود و پس از
          آماده‌شدن قصه پاک می‌شود.
        </p>
      </div>
      <button
        disabled={!photo}
        onClick={onNext}
        className="rounded-2xl bg-[var(--primary)] py-4 text-base font-bold text-[var(--primary-ink)] shadow-[var(--shadow-2)] disabled:opacity-50"
      >
        ادامه
      </button>
    </div>
  );
}

/** Collects validated story, child, catalog, language, and duration inputs. */
function StepDetails({
  details,
  setDetails,
  catalogs,
  pastChildren,
  onBack,
  onNext,
  valid,
}: {
  details: Details;
  setDetails: React.Dispatch<React.SetStateAction<Details>>;
  catalogs: StoryCatalogs;
  pastChildren: Array<[string, number]>;
  onBack: () => void;
  onNext: () => void;
  valid: boolean;
}) {
  return (
    <div className="flex flex-col gap-5">
      <h1 className="m-0 text-[26px] font-extrabold">دربارهٔ قصه</h1>
      {pastChildren.length > 0 && (
        <div className="flex flex-col gap-2">
          <span className="text-sm font-semibold">یا از پروفایل‌های قبلی</span>
          <div className="flex flex-wrap gap-2">
            {pastChildren.map(([name, age]) => (
              <button
                key={name}
                onClick={() => setDetails((d) => ({ ...d, childName: name, childAge: age }))}
                className={`rounded-xl border px-3.5 py-2 text-sm font-semibold ${
                  details.childName === name
                    ? "border-[var(--primary)] bg-[var(--primary-soft)] text-[var(--primary)]"
                    : "border-[var(--border)] text-[var(--ink-2)]"
                }`}
              >
                {name} · {faDigits(age)}
              </button>
            ))}
          </div>
        </div>
      )}
      <Field label="عنوان قصه">
        <input
          className="story-input"
          value={details.title}
          maxLength={180}
          lang="fa"
          placeholder="آوا و فانوس دریایی"
          onChange={(e) => setDetails((d) => ({ ...d, title: e.target.value }))}
        />
      </Field>
      <div className="grid grid-cols-2 gap-4">
        <Field label="نام کودک">
          <input
            className="story-input"
            value={details.childName}
            maxLength={100}
            onChange={(e) => setDetails((d) => ({ ...d, childName: e.target.value }))}
          />
        </Field>
        <Field label="سن">
          <input
            className="story-input"
            type="number"
            min={1}
            max={17}
            value={details.childAge}
            onChange={(e) =>
              setDetails((d) => ({ ...d, childAge: Number(e.target.value) }))
            }
          />
        </Field>
      </div>
      <Field label="موضوع">
        <select
          className="story-input"
          value={details.topic}
          onChange={(e) => setDetails((d) => ({ ...d, topic: e.target.value }))}
        >
          {catalogs.topics.map((topic) => (
            <option key={topic.slug} value={topic.slug}>
              {PERSIAN_TOPIC_NAMES[topic.slug] ?? topic.displayName}
            </option>
          ))}
        </select>
      </Field>
      <div className="grid grid-cols-2 gap-4">
        <Field label="زبان">
          <div
            className="story-input flex items-center"
            lang="fa"
          >
            {PERSIAN_LANGUAGE.nativeName}
          </div>
        </Field>
        <Field label="طول">
          <select
            className="story-input"
            value={details.durationMinutes}
            onChange={(e) =>
              setDetails((d) => ({ ...d, durationMinutes: Number(e.target.value) }))
            }
          >
            {[5, 10, 15, 20].map((minutes) => (
              <option key={minutes} value={minutes}>
                حدود {faDigits(minutes)} دقیقه
              </option>
            ))}
          </select>
        </Field>
      </div>
      <div className="flex gap-3">
        <button
          onClick={onBack}
          className="flex-1 rounded-2xl border border-[var(--border)] py-4 text-base font-bold"
        >
          بازگشت
        </button>
        <button
          disabled={!valid}
          onClick={onNext}
          className="flex-[2] rounded-2xl bg-[var(--primary)] py-4 text-base font-bold text-[var(--primary-ink)] shadow-[var(--shadow-2)] disabled:opacity-50"
        >
          ادامه
        </button>
      </div>
    </div>
  );
}

/** Summarizes creation inputs and initiates the two-request generation flow. */
function StepReview({
  photoPreview,
  details,
  catalogs,
  error,
  submitting,
  onBack,
  onEditPhoto,
  onGenerate,
}: {
  photoPreview: string | null;
  details: Details;
  catalogs?: StoryCatalogs;
  error: string;
  submitting: boolean;
  onBack: () => void;
  onEditPhoto: () => void;
  onGenerate: () => void;
}) {
  const topic = catalogs?.topics.find((t) => t.slug === details.topic);
  return (
    <div className="flex flex-col gap-5">
      <h1 className="m-0 text-[26px] font-extrabold">یک بار مرور کنیم</h1>
      <div className="flex flex-col gap-4 rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-5">
        <div className="flex items-center gap-3.5">
          <div className="size-[60px] shrink-0 overflow-hidden rounded-full bg-[var(--surface-2)]">
            {photoPreview && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={photoPreview} alt="" className="size-full object-cover" />
            )}
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-base font-bold">
              {details.childName}، {faDigits(details.childAge)} ساله
            </span>
          </div>
          <button
            onClick={onEditPhoto}
            className="ms-auto text-sm text-[var(--primary)]"
          >
            تغییر
          </button>
        </div>
        <div className="h-px bg-[var(--border)]" />
        <SummaryRow label="عنوان" value={details.title} />
        <SummaryRow
          label="موضوع"
          value={
            topic
              ? PERSIAN_TOPIC_NAMES[topic.slug] ?? topic.displayName
              : "—"
          }
        />
        <SummaryRow label="زبان" value={PERSIAN_LANGUAGE.nativeName} />
        <SummaryRow
          label="طول"
          value={`${faDigits(details.durationMinutes)} دقیقه`}
        />
      </div>
      <div className="flex items-center justify-between rounded-2xl bg-[var(--accent-soft)] p-4">
        <div className="flex flex-col gap-0.5">
          <span className="text-sm font-bold text-[var(--accent-ink)]">
            ۱ اعتبار مصرف می‌شود
          </span>
          <span className="text-[13px] text-[var(--accent-ink)] opacity-80">
            پس از ساخت، {faDigits(STUB_CREDITS - 1)} اعتبار می‌ماند
          </span>
        </div>
        <span className="text-xl">✦</span>
      </div>
      <ErrorMessage message={error || null} />
      <div className="flex gap-3">
        <button
          onClick={onBack}
          disabled={submitting}
          className="flex-1 rounded-2xl border border-[var(--border)] py-4 text-base font-bold disabled:opacity-50"
        >
          بازگشت
        </button>
        <button
          onClick={onGenerate}
          disabled={submitting}
          className="flex flex-[2] items-center justify-center gap-2 rounded-2xl bg-[var(--primary)] py-4 text-base font-bold text-[var(--primary-ink)] shadow-[var(--shadow-3)] disabled:opacity-70"
        >
          {submitting ? (
            <>
              <LoaderCircle className="size-4 animate-spin" /> در حال آماده‌سازی
            </>
          ) : (
            <>
              <Sparkles className="size-4" /> بساز
            </>
          )}
        </button>
      </div>
    </div>
  );
}

/** Renders one review label/value pair. */
function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-[var(--ink-3)]">{label}</span>
      <span className="font-semibold">{value}</span>
    </div>
  );
}

/** Renders a consistently styled label around an arbitrary form control. */
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="grid gap-2 text-sm font-bold">
      {label}
      {children}
    </label>
  );
}
