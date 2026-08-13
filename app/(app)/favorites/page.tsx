import type { Metadata } from 'next';
import { StoryCard } from '@/components/app/story-card';
import { EmptyState, PageTitle, PrimaryLink } from '@/components/app/ui';
import { sapi } from '@/lib/dal';
import type { StoryDto } from '@/lib/types';

export const metadata: Metadata = { title: 'علاقه‌مندی‌ها' };

export default async function FavoritesPage() {
  const { items } = await sapi.get<{ items: StoryDto[] }>(
    '/stories?favorite=true',
  );

  return (
    <section className="animate-[pageIn_.4s_ease_both]">
      <PageTitle
        title="علاقه‌مندی‌ها"
        lead="قصه‌هایی که خانه دوباره و دوباره می‌خواهد."
      />

      {items.length > 0 ? (
        <>
          <div className="grid gap-4 sm:grid-cols-[repeat(auto-fill,minmax(210px,1fr))]">
            {items.map((story) => (
              <StoryCard key={story.id} story={story} />
            ))}
          </div>
          <div className="mt-6 rounded-[22px] border border-dashed border-border bg-elev p-6 text-center">
            <p className="mb-1.5 text-[15px] font-bold">
              قصه‌هایی که خانه می‌خواهد دوباره بشنود را ذخیره کنید.
            </p>
            <p className="text-[13.5px] text-muted">
              با زدن ستارهٔ کنار هر قصه، اینجا اضافه می‌شود.
            </p>
          </div>
        </>
      ) : (
        <EmptyState
          icon="✦"
          title="هنوز چیزی ستاره‌دار نشده."
          action={<PrimaryLink href="/library">رفتن به کتابخانه</PrimaryLink>}
        >
          با زدن ستارهٔ کنار هر قصه، اینجا اضافه می‌شود.
        </EmptyState>
      )}
    </section>
  );
}
