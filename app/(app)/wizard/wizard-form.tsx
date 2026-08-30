/**
 * @file wizard-form.tsx
 * @description Implements the client-side child, theme, style, preview, story creation, and payment handoff flow.
 */

"use client";

import { useEffect, useState } from "react";
import { AddChildButton } from "@/components/app/child-form";
import { ChildAvatar } from "@/components/app/ui";
import { Alert } from "@/components/form";
import { API_URL, ApiError, api } from "@/lib/api";
import { faDigits, faPrice } from "@/lib/fa";
import { photoError } from "@/lib/upload";
import {
  LENGTH_LABEL,
  LENGTH_SHORT_LABEL,
  STYLE_LABEL,
  THEME_COVER,
  TONE_LABEL,
  WIZARD_THEMES,
} from "@/lib/story-art";
import type {
  ChildDto,
  ChildRelationDto,
  CreatedStory,
  IllustrationStyle,
  StoryLength,
  StoryTheme,
  StoryTone,
} from "@/lib/types";
import { cn } from "@/lib/utils";

const STEPS = ["قهرمان", "موضوع", "سفارشی‌سازی", "پیش‌نمایش"] as const;
const LENGTHS: StoryLength[] = ["SHORT", "MEDIUM", "LONG"];
const TONES: StoryTone[] = ["CALM", "FUNNY", "BRAVE"];
const STYLES: IllustrationStyle[] = ["WATERCOLOR", "CLASSIC", "PAPERCUT"];

const TOPIC_FOR_THEME: Record<StoryTheme, string> = {
  HONESTY: "راست‌گویی و پذیرفتن اشتباه",
  KINDNESS: "مهربانی و انجام کار خوب",
  COURAGE: "شجاعت و غلبه بر ترس",
  SHARING: "سهیم شدن و رعایت نوبت",
  TEAMWORK: "همکاری و کمک به دیگران",
  RESPONSIBILITY: "مسئولیت‌پذیری و نگه‌داشتن قول",
  PATIENCE: "صبر و پشتکار",
  RESPECT: "احترام و رفتار مؤدبانه",
  OWN: "",
};

const ART_STYLE_TEXT: Record<IllustrationStyle, string> = {
  WATERCOLOR: "آبرنگی",
  CLASSIC: "کتاب داستان کلاسیک",
  PAPERCUT: "کلاژ کاغذی",
};

const SCENES_FOR_LENGTH: Record<StoryLength, number> = {
  SHORT: 6,
  MEDIUM: 8,
  LONG: 12,
};

const CONSIDERATION_EXAMPLES = [
  "حیوانات را دوست داشته باشد",
  "فضای داستان آرام و بدون ترس باشد",
  "قهرمان کنجکاو و مهربان باشد",
  "ماجرا شوخ‌طبع و پرانرژی باشد",
];

const MORAL_EXAMPLES = [
  "مهربانی با حیوانات",
  "همکاری و کمک به دیگران",
  "راست‌گویی و پذیرش اشتباه",
  "اعتمادبه‌نفس و غلبه بر ترس",
];

const AGE_RANGE_EXAMPLES = ["3-5", "5-8", "9-12"];
const RELATION_EXAMPLES = [
  "مادر",
  "پدر",
  "خواهر",
  "برادر",
  "مادربزرگ",
  "پدربزرگ",
  "خاله",
  "عمه",
  "دایی",
  "عمو",
  "دوست",
];

type CharacterDraft = {
  savedRelationId: string | null;
  name: string;
  relation: string;
  photo: File | null;
  hasSavedPhoto: boolean;
};

const newCharacter = (): CharacterDraft => ({
  savedRelationId: null,
  name: "",
  relation: "",
  photo: null,
  hasSavedPhoto: false,
});

const ageRangeFor = (age: number) =>
  age <= 4 ? "3-5" : age <= 8 ? "5-8" : "9-12";

const HINTS = [
  "قصه با نام و علاقه‌های او نوشته می‌شود.",
  "می‌توانید بعداً موضوع قصه را عوض کنید.",
  "اگر چیزی را عوض نکنید، پیش‌فرض‌ها استفاده می‌شوند.",
  "پس از پرداخت، ساخت قصه حدود یک دقیقه طول می‌کشد.",
];

/** The selected-card ring the design uses everywhere in this flow. */
const ring = (on: boolean) =>
  on ? "outline outline-3 outline-brand outline-offset-[3px]" : "";

/** Compact selectable examples that still leave the associated field editable. */
function Suggestions({
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
function CharacterEditor({
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

/** Manages all four wizard steps and redirects to the returned payment URL. */
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
  const [step, setStep] = useState(1);
  const [childId, setChildId] = useState(
    initialChildId && childProfiles.some((c) => c.id === initialChildId)
      ? initialChildId
      : (childProfiles[0]?.id ?? ""),
  );
  const [theme, setTheme] = useState<StoryTheme>(
    initialIdea ? "OWN" : "HONESTY",
  );
  const [ownIdea, setOwnIdea] = useState(
    initialIdea ? `قصه‌ای دربارهٔ ${initialIdea}` : "",
  );
  const [length, setLength] = useState<StoryLength>("MEDIUM");
  const [tone, setTone] = useState<StoryTone>("CALM");
  const [style, setStyle] = useState<IllustrationStyle>("WATERCOLOR");
  const [artStyle, setArtStyle] = useState(ART_STYLE_TEXT.WATERCOLOR);
  const [storyConsiderations, setStoryConsiderations] = useState("");
  const [desiredMoral, setDesiredMoral] = useState("");
  const [nScenes, setNScenes] = useState(8);
  const [ageRange, setAgeRange] = useState(() => {
    const selected = childProfiles.find(
      (profile) => profile.id === initialChildId,
    );
    return ageRangeFor(selected?.age ?? childProfiles[0]?.age ?? 7);
  });
  const [characters, setCharacters] = useState<CharacterDraft[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const child = childProfiles.find((c) => c.id === childId);
  const chosen = WIZARD_THEMES.find((t) => t.id === theme)!;
  const hero = child?.firstName ?? "کودک شما";
  const topic = theme === "OWN" ? ownIdea.trim() : TOPIC_FOR_THEME[theme];
  const charactersAreValid = characters.every(
    (character) =>
      Boolean(character.name.trim()) ||
      (!character.relation.trim() && !character.photo),
  );
  const namedCharacters = characters.filter((character) =>
    Boolean(character.name.trim()),
  );
  const savedRelations = relationsByChild[childId] ?? [];

  // The one place a step can be wrong: «ایدهٔ خودم» with nothing written.
  const blocked =
    (step === 1 && !childId) ||
    (step === 2 && theme === "OWN" && ownIdea.trim().length < 10) ||
    (step === 3 &&
      (!artStyle.trim() ||
        !ageRange.trim() ||
        nScenes < 1 ||
        nScenes > 50 ||
        !charactersAreValid));

  /** Updates one of the four optional supporting-character cards. */
  function updateCharacter(index: number, patch: Partial<CharacterDraft>) {
    setCharacters((current) =>
      current.map((character, i) =>
        i === index ? { ...character, ...patch } : character,
      ),
    );
  }

  /** Adds or removes character cards while preserving the API's four-slot cap. */
  function addCharacter() {
    setCharacters((current) =>
      current.length >= 4 ? current : [...current, newCharacter()],
    );
  }

  /** Adds a previously saved relation without allowing cross-child reuse. */
  function reuseRelation(relation: ChildRelationDto) {
    if (relation.childId !== childId) return;
    setCharacters((current) =>
      current.length >= 4 ||
      current.some((character) => character.savedRelationId === relation.id)
        ? current
        : [
            ...current,
            {
              savedRelationId: relation.id,
              name: relation.name,
              relation: relation.relation,
              photo: null,
              hasSavedPhoto: relation.hasPhoto,
            },
          ],
    );
  }

  function removeCharacter(index: number) {
    setCharacters((current) => current.filter((_, i) => i !== index));
  }

  /** Keeps a selected supporting-character photo only when it is uploadable. */
  function selectCharacterPhoto(index: number, file?: File) {
    if (!file) return updateCharacter(index, { photo: null });
    const problem = photoError(file);
    if (problem) {
      setError(problem);
      return;
    }
    setError(null);
    updateCharacter(index, { photo: file });
  }

  /** Validates the final selection, creates the story/order, and starts payment. */
  async function submit() {
    setBusy(true);
    setError(null);
    try {
      const form = new FormData();
      form.append("childId", childId);
      form.append("theme", theme);
      if (theme === "OWN") form.append("ownIdea", ownIdea.trim());
      form.append("length", length);
      form.append("tone", tone);
      form.append("style", style);
      form.append("topic", topic);
      form.append("story_considerations", storyConsiderations.trim());
      form.append("mode", "video");
      form.append("art_style", artStyle.trim());
      form.append("desired_moral", desiredMoral.trim());
      form.append("n_scenes", String(nScenes));
      form.append("age_range", ageRange.trim());
      characters.forEach((character, index) => {
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

      const created = await api.post<CreatedStory>("/stories", form);
      // Straight to payment — nothing is generated until the callback lands.
      window.location.href = created.payUrl;
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : "ساخت قصه ممکن نشد. دوباره تلاش کنید.",
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
              aria-current={step === i + 1 ? "step" : undefined}
              className={cn(
                "text-[12.5px] font-semibold",
                step >= i + 1 ? "text-ink" : "text-muted",
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
        گام {faDigits(step)} از ۴
      </p>

      {/* ————— STEP 1 : the hero ————— */}
      {step === 1 ? (
        <section className="animate-[pageIn_.4s_ease_both]">
          <h1 className="mb-2.5 font-display text-[clamp(26px,4.6vw,40px)] leading-[1.35]">
            امشب قصهٔ کی را بسازیم؟
          </h1>
          <p className="mb-7 max-w-[52ch] text-[clamp(14px,1.8vw,17px)] leading-[1.8] text-muted">
            قهرمان این ماجرا را انتخاب کنید. قصه با نام، سن و علاقه‌های او نوشته
            می‌شود.
          </p>

          <div className="grid gap-4 sm:grid-cols-[repeat(auto-fit,minmax(240px,1fr))]">
            {childProfiles.map((c) => (
              <button
                key={c.id}
                type="button"
                aria-pressed={childId === c.id}
                onClick={() => {
                  if (c.id !== childId) setCharacters([]);
                  setChildId(c.id);
                  setAgeRange(ageRangeFor(c.age));
                }}
                className={cn(
                  "flex items-center gap-4 rounded-[22px] border border-border bg-surface p-4.5 text-right shadow-card",
                  "transition-transform duration-250 hover:-translate-y-0.5",
                  ring(childId === c.id),
                )}
              >
                <ChildAvatar child={c} size={76} />
                <span className="flex min-w-0 flex-col gap-1.25">
                  <strong className="text-[18px]">{c.firstName}</strong>
                  <span className="text-[13.5px] text-muted">
                    {faDigits(c.age)} ساله
                    {c.interests.length ? ` · ${c.interests.join("، ")}` : ""}
                  </span>
                  <span className="text-[12.5px] font-semibold text-brand">
                    {faDigits(c.storyCount)} قصه ساخته شده
                  </span>
                </span>
                {childId === c.id ? (
                  <span aria-hidden className="ms-auto text-[18px] text-brand">
                    ✓
                  </span>
                ) : null}
              </button>
            ))}

            <AddChildButton className="flex items-center gap-4 rounded-[22px] border-2 border-dashed border-border p-4.5 text-right text-muted">
              <span className="grid size-19 flex-none place-items-center rounded-full bg-elev text-[26px]">
                +
              </span>
              <span className="flex flex-col gap-1.25">
                <strong className="text-[17px] text-ink">افزودن کودک</strong>
                <span className="text-[13.5px]">
                  نام، سن و یک عکس؛ کمتر از یک دقیقه
                </span>
              </span>
            </AddChildButton>
          </div>

          <div className="mt-6.5 flex max-w-160 items-start gap-3 rounded-[18px] border border-border bg-elev px-4.5 py-4">
            <span aria-hidden className="text-[17px] text-success">
              🛡
            </span>
            <p className="text-[13.5px] leading-[1.85] text-muted">
              عکس کودک شما خصوصی است و فقط برای شخصی‌سازی قصه‌هایش استفاده
              می‌شود. هر زمان بخواهید می‌توانید آن را پاک کنید.
            </p>
          </div>
        </section>
      ) : null}

      {/* ————— STEP 2 : the adventure ————— */}
      {step === 2 ? (
        <section className="animate-[pageIn_.4s_ease_both]">
          <h1 className="mb-2.5 font-display text-[clamp(26px,4.6vw,40px)] leading-[1.35]">
            موضوع قصه را انتخاب کنید
          </h1>
          <p className="mb-7 max-w-[52ch] text-[clamp(14px,1.8vw,17px)] leading-[1.8] text-muted">
            {hero} در این قصه چه چیزی را یاد بگیرد؟
          </p>

          <div className="grid gap-3.5 sm:grid-cols-[repeat(auto-fill,minmax(210px,1fr))]">
            {WIZARD_THEMES.map((t) => (
              <button
                key={t.id}
                type="button"
                aria-pressed={theme === t.id}
                onClick={() => setTheme(t.id)}
                className={cn(
                  "overflow-hidden rounded-[20px] border text-right transition-transform duration-250 hover:-translate-y-1",
                  t.id === "OWN"
                    ? "border-2 border-dashed border-border bg-elev"
                    : "border-border bg-surface shadow-card",
                  ring(theme === t.id),
                )}
              >
                <span
                  aria-hidden
                  className="grid h-26 place-items-center text-[26px] text-brand"
                  style={
                    t.id === "OWN"
                      ? undefined
                      : { backgroundImage: THEME_COVER[t.id] }
                  }
                >
                  {t.id === "OWN" ? "✎" : ""}
                </span>
                <span className="block p-[13px_15px_16px]">
                  <strong className="mb-1.25 block text-[15.5px]">
                    {t.title}
                  </strong>
                  <span className="block text-[12.5px] leading-[1.7] text-muted">
                    {t.body}
                  </span>
                </span>
              </button>
            ))}
          </div>

          <div className="mt-5.5 rounded-[20px] border border-border bg-surface p-5 shadow-card">
            {theme === "OWN" ? (
              <div>
                <label
                  htmlFor="own-idea"
                  className="mb-2 block text-[14px] font-bold"
                >
                  موضوع قصه‌تان را بنویسید
                </label>
                <textarea
                  id="own-idea"
                  rows={3}
                  value={ownIdea}
                  onChange={(e) => setOwnIdea(e.target.value)}
                  maxLength={500}
                  placeholder={`${hero} یاد بگیرد اسباب‌بازی‌هایش را با دوستش قسمت کند.`}
                  className="w-full resize-y rounded-2xl border border-border bg-elev px-4 py-3.5 text-[14px] leading-[1.9] text-ink"
                />
                <p className="mt-2.25 text-[12.5px] text-muted">
                  یک یا دو جمله کافی است. باقی داستان را ما می‌نویسیم.
                </p>
              </div>
            ) : (
              <div className="flex items-start gap-3.5">
                <span aria-hidden className="text-[15px] text-gold">
                  ✦
                </span>
                <div>
                  <p className="mb-1.5 text-[12.5px] font-bold text-warm">
                    نمونه‌ای از این موضوع
                  </p>
                  <p className="text-[14.5px] leading-[1.9]">
                    {chosen.example}
                  </p>
                </div>
              </div>
            )}
          </div>
        </section>
      ) : null}

      {/* ————— STEP 3 : customise ————— */}
      {step === 3 ? (
        <section className="max-w-190 animate-[pageIn_.4s_ease_both]">
          <h1 className="mb-2.5 font-display text-[clamp(26px,4.6vw,40px)] leading-[1.35]">
            قصه را به سلیقهٔ خودتان بسازید
          </h1>
          <p className="mb-7 text-[clamp(14px,1.8vw,17px)] leading-[1.8] text-muted">
            پیش‌فرض‌ها برای {hero} آماده‌اند. اگر چیزی را عوض نکنید هم قصه خوب
            از آب درمی‌آید.
          </p>

          <div className="flex flex-col gap-3.5">
            <fieldset className="rounded-[20px] border border-border bg-surface p-[18px_20px_20px] shadow-card">
              <legend className="px-1.5 text-[14.5px] font-bold">
                طول قصه
              </legend>
              <div className="mt-1.5 flex flex-wrap gap-2.5">
                {LENGTHS.map((id) => (
                  <button
                    key={id}
                    type="button"
                    aria-pressed={length === id}
                    onClick={() => {
                      setLength(id);
                      setNScenes(SCENES_FOR_LENGTH[id]);
                    }}
                    className={cn(
                      "flex-1 basis-37.5 rounded-2xl border border-border bg-elev p-[12px_14px] text-right",
                      ring(length === id),
                    )}
                  >
                    <strong className="block text-[14px]">
                      {LENGTH_SHORT_LABEL[id]}
                    </strong>
                    <span className="text-[12.5px] text-muted">
                      {faDigits(SCENES_FOR_LENGTH[id])} صحنه ·{" "}
                      {LENGTH_LABEL[id]} · {faPrice(prices[id])}
                    </span>
                  </button>
                ))}
              </div>
              <label className="mt-4 flex max-w-64 flex-col gap-1.5 text-[12.5px] text-muted">
                تعداد صحنهٔ دلخواه
                <input
                  type="number"
                  min={1}
                  max={50}
                  value={nScenes}
                  onChange={(event) => setNScenes(Number(event.target.value))}
                  className="rounded-[12px] border border-border bg-elev px-3.5 py-2.5 text-[14px] text-ink"
                />
              </label>
            </fieldset>

            <fieldset className="rounded-[20px] border border-border bg-surface p-[18px_20px_20px] shadow-card">
              <legend className="px-1.5 text-[14.5px] font-bold">لحن</legend>
              <div className="mt-1.5 flex flex-wrap gap-2.5">
                {TONES.map((id) => (
                  <button
                    key={id}
                    type="button"
                    aria-pressed={tone === id}
                    onClick={() => setTone(id)}
                    className={cn(
                      "flex-1 basis-35 rounded-2xl border border-border bg-elev p-3 text-[14px] font-semibold",
                      ring(tone === id),
                    )}
                  >
                    {TONE_LABEL[id]}
                  </button>
                ))}
              </div>
            </fieldset>

            <fieldset className="rounded-[20px] border border-border bg-surface p-[18px_20px_20px] shadow-card">
              <legend className="px-1.5 text-[14.5px] font-bold">
                ملاحظات داستان
              </legend>
              <p className="mb-3 text-[12.5px] leading-[1.8] text-muted">
                یک نمونه را انتخاب کنید یا هر توضیحی که برای داستان مهم است
                بنویسید.
              </p>
              <Suggestions
                values={CONSIDERATION_EXAMPLES}
                selected={storyConsiderations}
                onSelect={setStoryConsiderations}
              />
              <textarea
                rows={3}
                maxLength={1000}
                value={storyConsiderations}
                onChange={(event) => setStoryConsiderations(event.target.value)}
                placeholder="مثلاً سگ‌ها را خیلی دوست داشته باشد و صحنهٔ ترسناک نداشته باشد"
                className="w-full resize-y rounded-2xl border border-border bg-elev px-4 py-3 text-[13.5px] leading-[1.9] text-ink"
              />
            </fieldset>

            <fieldset className="rounded-[20px] border border-border bg-surface p-[18px_20px_20px] shadow-card">
              <legend className="px-1.5 text-[14.5px] font-bold">
                سبک تصویرسازی
              </legend>
              <div className="mt-1.5 grid gap-2.5 sm:grid-cols-[repeat(auto-fit,minmax(130px,1fr))]">
                {STYLES.map((id) => (
                  <button
                    key={id}
                    type="button"
                    aria-pressed={style === id}
                    onClick={() => {
                      setStyle(id);
                      setArtStyle(ART_STYLE_TEXT[id]);
                    }}
                    className={cn(
                      "overflow-hidden rounded-2xl border border-border bg-elev text-right",
                      ring(style === id),
                    )}
                  >
                    <span
                      aria-hidden
                      className={cn(
                        "block h-14.5",
                        id === "WATERCOLOR" &&
                          "bg-[linear-gradient(140deg,#EBD6F0,#F6D9BC_55%,#CFE6E8)]",
                        id === "CLASSIC" &&
                          "bg-[repeating-linear-gradient(45deg,#D8C7A8_0_6px,#EDE0C6_6px_12px)]",
                        id === "PAPERCUT" &&
                          "bg-[linear-gradient(160deg,#F2C578,#DE7639)]",
                      )}
                    />
                    <span className="block px-3 py-2.25 text-[13px] font-semibold">
                      {STYLE_LABEL[id]}
                    </span>
                  </button>
                ))}
              </div>
              <label className="mt-4 flex flex-col gap-1.5 text-[12.5px] text-muted">
                نام سبک دلخواه
                <input
                  list="art-style-examples"
                  maxLength={100}
                  value={artStyle}
                  onChange={(event) => setArtStyle(event.target.value)}
                  placeholder="مثلاً کارتونی سه‌بعدی با رنگ‌های شاد"
                  className="rounded-[12px] border border-border bg-elev px-3.5 py-2.5 text-[14px] text-ink"
                />
                <datalist id="art-style-examples">
                  {[
                    "کارتونی",
                    "آبرنگی",
                    "کتاب داستان کلاسیک",
                    "کلاژ کاغذی",
                    "سه‌بعدی فانتزی",
                  ].map((value) => (
                    <option key={value} value={value} />
                  ))}
                </datalist>
              </label>
            </fieldset>

            <fieldset className="rounded-[20px] border border-border bg-surface p-[18px_20px_20px] shadow-card">
              <legend className="px-1.5 text-[14.5px] font-bold">
                پیام یا نتیجهٔ اخلاقی
              </legend>
              <p className="mb-3 text-[12.5px] leading-[1.8] text-muted">
                اختیاری است؛ یک نمونه را انتخاب کنید یا پیام خودتان را بنویسید.
              </p>
              <Suggestions
                values={MORAL_EXAMPLES}
                selected={desiredMoral}
                onSelect={setDesiredMoral}
              />
              <input
                maxLength={500}
                value={desiredMoral}
                onChange={(event) => setDesiredMoral(event.target.value)}
                placeholder="مثلاً مراقبت از طبیعت مسئولیت همهٔ ماست"
                className="w-full rounded-[12px] border border-border bg-elev px-3.5 py-2.5 text-[14px] text-ink"
              />
            </fieldset>

            <fieldset className="rounded-[20px] border border-border bg-surface p-[18px_20px_20px] shadow-card">
              <legend className="px-1.5 text-[14.5px] font-bold">
                بازهٔ سنی و نوع خروجی
              </legend>
              <p className="mb-3 text-[12.5px] leading-[1.8] text-muted">
                بازه بر اساس سن {hero} پیشنهاد شده و قابل ویرایش است. خروجی این
                سرویس ویدیو است.
              </p>
              <Suggestions
                values={AGE_RANGE_EXAMPLES}
                selected={ageRange}
                onSelect={setAgeRange}
              />
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="flex flex-col gap-1.5 text-[12.5px] text-muted">
                  بازهٔ سنی دلخواه
                  <input
                    maxLength={40}
                    value={ageRange}
                    onChange={(event) => setAgeRange(event.target.value)}
                    placeholder="مثلاً ۵ تا ۸ سال"
                    className="rounded-[12px] border border-border bg-elev px-3.5 py-2.5 text-[14px] text-ink"
                  />
                </label>
                <div className="flex flex-col gap-1.5 text-[12.5px] text-muted">
                  نوع خروجی
                  <div className="rounded-[12px] border border-brand bg-elev px-3.5 py-2.5 text-[14px] font-semibold text-ink">
                    ویدیو
                  </div>
                </div>
              </div>
            </fieldset>

            <CharacterEditor
              characters={characters}
              savedRelations={savedRelations}
              childId={childId}
              valid={charactersAreValid}
              onAdd={addCharacter}
              onReuse={reuseRelation}
              onUpdate={updateCharacter}
              onRemove={removeCharacter}
              onPhoto={selectCharacterPhoto}
            />
          </div>
        </section>
      ) : null}

      {/* ————— STEP 4 : preview ————— */}
      {step === 4 ? (
        <section className="animate-[pageIn_.4s_ease_both]">
          <h1 className="mb-2.5 font-display text-[clamp(26px,4.6vw,40px)] leading-[1.35]">
            همه‌چیز آماده است
          </h1>
          <p className="mb-7 text-[clamp(14px,1.8vw,17px)] leading-[1.8] text-muted">
            یک نگاه آخر، بعد به صفحهٔ پرداخت می‌روید.
          </p>

          <div className="grid items-start gap-5 sm:grid-cols-[repeat(auto-fit,minmax(280px,1fr))]">
            <div className="rounded-3xl border border-border bg-surface p-2 shadow-card-lg">
              <div
                className="relative aspect-4/5 overflow-hidden rounded-[18px]"
                style={{ backgroundImage: THEME_COVER[theme] }}
              >
                <span
                  aria-hidden
                  className="absolute inset-e-[14%] top-[12%] size-13 rounded-full bg-[#FFF3D6] shadow-[0_0_40px_rgba(255,240,200,.8)]"
                />
                <span
                  aria-hidden
                  className="absolute bottom-0 inset-s-[-10%] inset-e-[-10%] h-[34%] rounded-t-[50%] bg-[#1F1A3C]"
                />
                <div className="absolute inset-x-4 bottom-4 flex items-end gap-3">
                  {child ? <ChildAvatar child={child} size={62} /> : null}
                  <div className="pb-1">
                    <p className="mb-1 font-display text-[20px] text-[#FFF6E6] drop-shadow-[0_2px_12px_rgba(0,0,0,.5)]">
                      قصهٔ {hero}
                    </p>
                    <p className="text-[12px] text-[rgba(255,246,230,.8)]">
                      {chosen.title}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <div className="overflow-hidden rounded-[20px] border border-border bg-surface shadow-card">
                <dl className="grid grid-cols-[auto_1fr]">
                  {[
                    ["قهرمان", `${hero} · ${faDigits(child?.age ?? 0)} ساله`],
                    ["موضوع", topic],
                    [
                      "تعداد صحنه",
                      `${faDigits(nScenes)} صحنه · ${LENGTH_LABEL[length]}`,
                    ],
                    ["لحن", TONE_LABEL[tone]],
                    ["سبک تصویر", artStyle],
                    ["بازهٔ سنی", ageRange],
                    ["خروجی", "ویدیو"],
                  ].map(([label, value], i, all) => (
                    <div key={label} className="contents">
                      <dt
                        className={cn(
                          "px-4.5 py-3.5 text-[13px] text-muted",
                          i < all.length - 1 && "border-b border-border",
                        )}
                      >
                        {label}
                      </dt>
                      <dd
                        className={cn(
                          "px-4.5 py-3.5 text-left text-[14px] font-semibold",
                          i < all.length - 1 && "border-b border-border",
                        )}
                      >
                        {value}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>

              {theme === "OWN" && ownIdea ? (
                <div className="rounded-[20px] border border-border bg-elev px-4.5 py-4">
                  <p className="mb-1.5 text-[12.5px] font-bold text-warm">
                    ایدهٔ شما
                  </p>
                  <p className="text-[13.5px] leading-[1.9]">{ownIdea}</p>
                </div>
              ) : null}

              {storyConsiderations || desiredMoral ? (
                <div className="rounded-[20px] border border-border bg-elev px-4.5 py-4">
                  {storyConsiderations ? (
                    <div>
                      <p className="mb-1.5 text-[12.5px] font-bold text-warm">
                        ملاحظات داستان
                      </p>
                      <p className="text-[13.5px] leading-[1.9]">
                        {storyConsiderations}
                      </p>
                    </div>
                  ) : null}
                  {desiredMoral ? (
                    <div className={storyConsiderations ? "mt-3" : undefined}>
                      <p className="mb-1.5 text-[12.5px] font-bold text-warm">
                        پیام اخلاقی
                      </p>
                      <p className="text-[13.5px] leading-[1.9]">
                        {desiredMoral}
                      </p>
                    </div>
                  ) : null}
                </div>
              ) : null}

              {namedCharacters.length ? (
                <div className="rounded-[20px] border border-border bg-elev px-4.5 py-4">
                  <p className="mb-2 text-[12.5px] font-bold text-warm">
                    شخصیت‌های جانبی
                  </p>
                  <ul className="flex flex-col gap-1.5 text-[13.5px]">
                    {namedCharacters.map((character, index) => (
                      <li key={`${character.name}-${index}`}>
                        {character.name}
                        {character.relation ? ` · ${character.relation}` : ""}
                        {character.photo || character.hasSavedPhoto
                          ? " · همراه عکس"
                          : ""}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}

              <div className="rounded-[20px] border border-border bg-elev px-4.5 py-4">
                <p className="mb-2 text-[13.5px] font-bold">هزینهٔ این قصه</p>
                <p className="font-display text-[22px]">
                  {faPrice(prices[length])}
                </p>
                <p className="mt-2 text-[12.5px] leading-[1.9] text-muted">
                  یک پرداخت برای همین یک قصه. اشتراک و تمدید خودکاری در کار
                  نیست، و تا وقتی پرداخت انجام نشود چیزی ساخته نمی‌شود.
                </p>
              </div>
            </div>
          </div>
        </section>
      ) : null}

      {/* sticky footer, exactly as in the design */}
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-[color-mix(in_srgb,var(--sh-bg)_90%,transparent)] backdrop-blur-lg">
        <div className="mx-auto flex max-w-295 items-center gap-3.5 px-5 py-3.5">
          <button
            type="button"
            disabled={step === 1 || busy}
            onClick={() => setStep((s) => Math.max(1, s - 1))}
            className="rounded-[15px] border border-border bg-surface px-5 py-3.25 text-[14.5px] font-semibold text-muted disabled:opacity-45"
          >
            → مرحلهٔ قبل
          </button>
          <p className="min-w-0 flex-1 truncate text-[13px] text-muted">
            {HINTS[step - 1]}
          </p>
          <button
            type="button"
            disabled={blocked || busy}
            onClick={() => (step === 4 ? void submit() : setStep((s) => s + 1))}
            className={cn(
              "rounded-[15px] bg-linear-to-br from-brand to-warm px-7.5 py-3.5",
              "text-[15.5px] font-bold text-brand-fg shadow-card",
              "transition-transform duration-200 hover:-translate-y-0.5",
              (blocked || busy) && "opacity-60",
            )}
          >
            {busy
              ? "در حال رفتن به پرداخت…"
              : step === 4
                ? "ادامه و پرداخت ✦"
                : "ادامه"}
          </button>
        </div>
      </div>
    </div>
  );
}
