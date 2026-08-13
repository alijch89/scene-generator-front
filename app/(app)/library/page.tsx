import type { Metadata } from 'next';
import { StoryCard } from '@/components/app/story-card';
import { EmptyState, PageTitle, PillLink, PrimaryLink } from '@/components/app/ui';
import { sapi } from '@/lib/dal';
import { faDigits } from '@/lib/fa';
import type { ChildDto, StoryDto } from '@/lib/types';

export const metadata: Metadata = { title: 'قصه‌های من' };

export default async function LibraryPage({
  searchParams,
}: PageProps<'/library'>) {
  const { child, fav, q } = await searchParams;
  const childId = typeof child === 'string' ? child : undefined;
  const favorite = fav === '1';
  const search = typeof q === 'string' ? q.trim() : '';

  const query = new URLSearchParams();
  if (childId) query.set('childId', childId);
  if (favorite) query.set('favorite', 'true');
  if (search) query.set('q', search);

  const [children, { items, total }] = await Promise.all([
    sapi.get<ChildDto[]>('/children'),
    sapi.get<{ items: StoryDto[]; total: number }>(`/stories?${query}`),
  ]);

  const href = (params: Record<string, string>) => {
    const next = new URLSearchParams(search ? { q: search } : {});
    Object.entries(params).forEach(([key, value]) => next.set(key, value));
    const qs = next.toString();
    return qs ? `/library?${qs}` : '/library';
  };

  const unfiltered = !childId && !favorite && !search;

  return (
    <section className="animate-[pageIn_.4s_ease_both]">
      <PageTitle
        title="قصه‌های من"
        meta={`${faDigits(total)} قصه`}
        action={
          // A plain GET form: the URL stays the state, so the result is
          // shareable and works without JS.
          <form action="/library" className="flex-1 basis-55 sm:max-w-80">
            {childId ? <input type="hidden" name="child" value={childId} /> : null}
            {favorite ? <input type="hidden" name="fav" value="1" /> : null}
            <input
              type="search"
              name="q"
              defaultValue={search}
              placeholder="جست‌وجو در قصه‌ها"
              aria-label="جست‌وجو در قصه‌ها"
              className="w-full rounded-[13px] border border-border bg-surface px-3.5 py-2.5 text-[13.5px] text-ink"
            />
          </form>
        }
      />

      <div className="mb-5 flex flex-wrap gap-2">
        <PillLink href={href({})} active={unfiltered}>
          همه
        </PillLink>
        {children.map((c) => (
          <PillLink
            key={c.id}
            href={href({ child: c.id })}
            active={childId === c.id}
          >
            {c.firstName}
          </PillLink>
        ))}
        <PillLink href={href({ fav: '1' })} active={favorite}>
          علاقه‌مندی‌ها
        </PillLink>
      </div>

      {items.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-[repeat(auto-fill,minmax(210px,1fr))]">
          {items.map((story) => (
            <StoryCard key={story.id} story={story} />
          ))}
        </div>
      ) : unfiltered ? (
        <EmptyState
          icon="📖"
          title="کتابخانهٔ شما منتظر اولین ماجراست."
          action={<PrimaryLink href="/wizard">اولین قصه را بسازید</PrimaryLink>}
        >
          هر قصه با نام و عکس کودک شما ساخته می‌شود و حدود یک دقیقه طول می‌کشد.
        </EmptyState>
      ) : (
        <EmptyState icon="✧" title="قصه‌ای با این فیلتر پیدا نشد.">
          فیلتر دیگری امتحان کنید یا{' '}
          <a href="/library">همهٔ قصه‌ها</a> را ببینید.
        </EmptyState>
      )}
    </section>
  );
}
