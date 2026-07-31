"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { apiFetch } from "@/lib/api-client";
import type { Story, StoryCatalogs, StoryJob } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import { ImagePlus, LoaderCircle, Sparkles, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useMemo, useState } from "react";

export default function CreateStoryPage() {
  const router = useRouter();
  const [photo, setPhoto] = useState<File | null>(null);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { data: catalogs } = useQuery({
    queryKey: ["story-catalogs"],
    queryFn: () => apiFetch<StoryCatalogs>("/api/stories/catalogs"),
  });
  const preview = useMemo(
    () => (photo ? URL.createObjectURL(photo) : null),
    [photo],
  );
  useEffect(
    () => () => {
      if (preview) URL.revokeObjectURL(preview);
    },
    [preview],
  );

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!photo) {
      setError("Choose a clear photo of your child.");
      return;
    }
    setSubmitting(true);
    setError("");
    const form = new FormData(event.currentTarget);
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
            title: form.get("title"),
            topic: form.get("topic"),
            language: form.get("language"),
            childName: form.get("childName"),
            childAge: Number(form.get("childAge")),
            durationMinutes: Number(form.get("durationMinutes")),
            childPhotoToken: uploaded.uploadToken,
          }),
        },
      );
      router.push(`/stories/${result.story.id}`);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Could not create story.");
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-5xl px-5 py-8 sm:px-8 lg:px-12 lg:py-11">
      <header>
        <p className="eyebrow">A new adventure</p>
        <h1 className="font-[var(--font-serif)] text-4xl sm:text-5xl">
          Tell us who this story is for.
        </h1>
        <p className="mt-3 max-w-2xl text-[var(--muted)]">
          A clear portrait and a few thoughtful details are all we need.
        </p>
      </header>
      <form onSubmit={submit} className="mt-9 grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
        <Card className="h-fit gap-4 p-5 shadow-none">
          <div>
            <span className="text-sm font-bold">Child photo</span>
            <p className="mt-1 text-xs text-[var(--muted)]">
              JPEG, PNG or WebP · maximum 10 MB
            </p>
          </div>
          {preview ? (
            <div className="relative overflow-hidden rounded-xl bg-[#e6ded0]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={preview}
                alt="Selected child"
                className="aspect-[4/5] w-full object-cover"
              />
              <button
                type="button"
                aria-label="Remove photo"
                className="absolute right-3 top-3 grid size-9 place-items-center rounded-full bg-black/60 text-white"
                onClick={() => setPhoto(null)}
              >
                <X className="size-4" />
              </button>
            </div>
          ) : (
            <label className="grid aspect-[4/5] cursor-pointer place-items-center rounded-xl border-2 border-dashed border-[var(--line)] bg-white/60 text-center transition hover:border-[var(--sage)]">
              <input
                className="sr-only"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={(event) => setPhoto(event.target.files?.[0] ?? null)}
              />
              <span>
                <ImagePlus className="mx-auto size-8 text-[var(--clay)]" />
                <strong className="mt-3 block text-sm">Choose a portrait</strong>
                <small className="mt-1 block text-[var(--muted)]">
                  Face forward, good light
                </small>
              </span>
            </label>
          )}
          <p className="text-xs leading-relaxed text-[var(--muted)]">
            The original photo is private and used only to shape this story&apos;s
            character.
          </p>
        </Card>

        <Card className="gap-5 p-6 shadow-none">
          <Field label="Story title">
            <input
              name="title"
              required
              minLength={3}
              maxLength={180}
              placeholder="Mina and the Moon Garden"
              className="story-input"
            />
          </Field>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Child's name">
              <input
                name="childName"
                required
                maxLength={100}
                placeholder="Mina"
                className="story-input"
              />
            </Field>
            <Field label="Age">
              <input
                name="childAge"
                type="number"
                min={1}
                max={17}
                defaultValue={7}
                required
                className="story-input"
              />
            </Field>
          </div>
          <Field label="Story world">
            <select name="topic" required className="story-input">
              {(catalogs?.topics ?? []).map((topic) => (
                <option key={topic.slug} value={topic.slug}>
                  {topic.displayName}
                </option>
              ))}
            </select>
          </Field>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Language">
              <select name="language" required className="story-input">
                {(catalogs?.languages ?? []).map((language) => (
                  <option key={language.code} value={language.code}>
                    {language.displayName} · {language.nativeName}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Reading time">
              <select
                name="durationMinutes"
                defaultValue="10"
                className="story-input"
              >
                {[5, 10, 15, 20].map((minutes) => (
                  <option key={minutes} value={minutes}>
                    About {minutes} minutes
                  </option>
                ))}
              </select>
            </Field>
          </div>
          {error && (
            <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-800">
              {error}
            </p>
          )}
          <Button type="submit" size="lg" disabled={submitting || !catalogs}>
            {submitting ? (
              <>
                <LoaderCircle className="animate-spin" /> Preparing the story
              </>
            ) : (
              <>
                <Sparkles /> Create their story
              </>
            )}
          </Button>
        </Card>
      </form>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="grid gap-2 text-sm font-bold">
      {label}
      {children}
    </label>
  );
}
