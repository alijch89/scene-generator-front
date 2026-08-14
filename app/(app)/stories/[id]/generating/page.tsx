import type { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import { ApiError } from '@/lib/api';
import { sapi } from '@/lib/dal';
import type { ChildDto, StoryDto, StoryProgressDto } from '@/lib/types';
import { ProgressWatch } from './progress-watch';

export const metadata: Metadata = { title: 'در حال ساخت قصه' };

/** Server page that supplies the dynamic story identifier and initial status to the progress watcher. */
export default async function GeneratingPage({
  params,
}: PageProps<'/stories/[id]/generating'>) {
  const { id } = await params;

  const [story, progress] = await Promise.all([
    sapi.get<StoryDto>(`/stories/${id}`).catch((err) => {
      if (err instanceof ApiError && err.status === 404) notFound();
      throw err;
    }),
    sapi.get<StoryProgressDto>(`/stories/${id}/progress`),
  ]);

  // Nothing to watch: send the parent where they actually need to be.
  if (progress.status === 'READY') redirect(`/stories/${id}/ready`);
  if (progress.status === 'AWAITING_PAYMENT' || progress.status === 'DRAFT') {
    redirect(progress.orderId ? `/checkout/${progress.orderId}` : '/library');
  }

  const child = await sapi
    .get<ChildDto>(`/children/${story.childId}`)
    .catch(() => null);

  return <ProgressWatch story={story} child={child} initial={progress} />;
}
/**
 * @file page.tsx
 * @description Loads one owned story and renders its client-polled five-stage generation progress.
 */
