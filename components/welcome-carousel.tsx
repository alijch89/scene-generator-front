"use client";

import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useState } from "react";

/** Ordered onboarding content rendered by the welcome carousel. */
const SLIDES = [
  {
    icon: "📷",
    tint: "var(--primary-soft)",
    title: "یک عکس، یک قهرمان",
    body: "عکس کودک را می‌فرستید و او در همهٔ صفحه‌های قصه با همان چهره حاضر می‌شود.",
    cta: "بعدی",
  },
  {
    icon: "🛡️",
    tint: "var(--teal-soft)",
    title: "عکس‌ها پیش ما نمی‌مانند",
    body: "عکس رمزنگاری می‌شود، برای آموزش هوش مصنوعی استفاده نمی‌شود و پس از ساخت قصه پاک می‌شود.",
    cta: "بعدی",
  },
  {
    icon: "✦",
    tint: "var(--accent-soft)",
    title: "اولین قصه مهمان ما",
    body: "یک اعتبار رایگان در حساب شماست. همین حالا اولین قصه را بسازید.",
    cta: "بزن بریم",
  },
];

/** Renders the post-registration onboarding carousel and login handoff. */
export function WelcomeCarousel() {
  const [index, setIndex] = useState(0);
  const router = useRouter();
  const finish = () => router.push("/login?registered=1");
  const slide = SLIDES[index];

  return (
    <div className="flex min-h-screen flex-col gap-6 bg-[var(--bg)] p-6">
      <div className="flex items-center justify-between">
        <div className="flex gap-1.5">
          {SLIDES.map((_, i) => (
            <span
              key={i}
              className={cn(
                "h-1.5 rounded-full bg-[var(--surface-3)] transition-all",
                i <= index ? "w-5.5 bg-[var(--primary)]" : "w-1.5",
              )}
            />
          ))}
        </div>
        <button
          onClick={finish}
          className="text-sm text-[var(--ink-3)]"
        >
          رد کردن
        </button>
      </div>
      <div className="flex flex-1 flex-col items-center justify-center gap-6 text-center">
        <div
          className="grid size-[172px] place-items-center rounded-[44px] text-6xl"
          style={{ background: slide.tint }}
        >
          {slide.icon}
        </div>
        <div className="flex flex-col gap-3">
          <h1 className="m-0 text-2xl font-extrabold leading-snug">
            {slide.title}
          </h1>
          <p className="m-0 max-w-[300px] text-base leading-loose text-[var(--ink-2)]">
            {slide.body}
          </p>
        </div>
      </div>
      <div className="flex flex-col gap-3">
        <button
          onClick={() =>
            index < SLIDES.length - 1 ? setIndex(index + 1) : finish()
          }
          className="rounded-2xl bg-[var(--primary)] py-4 text-base font-bold text-[var(--primary-ink)] shadow-[var(--shadow-2)]"
        >
          {slide.cta}
        </button>
        {index > 0 && (
          <button
            onClick={() => setIndex(index - 1)}
            className="text-center text-sm text-[var(--ink-3)]"
          >
            قدم قبل
          </button>
        )}
      </div>
    </div>
  );
}
