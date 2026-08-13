import type { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import { ApiError } from '@/lib/api';
import { sapi } from '@/lib/dal';
import type { StoryDto, StoryPageDto } from '@/lib/types';
import { Reader } from './reader';

export const metadata: Metadata = { title: 'خواندن قصه' };

export default async function ReadPage({
  params,
  searchParams,
}: PageProps<'/stories/[id]/read'>) {
  const { id } = await params;
  const { play } = await searchParams;

  const story = await sapi.get<StoryDto>(`/stories/${id}`).catch((err) => {
    if (err instanceof ApiError && err.status === 404) notFound();
    throw err;
  });

  // Nothing to read until the story finished.
  if (story.status !== 'READY') redirect(`/stories/${id}/generating`);

  const pages = await sapi.get<StoryPageDto[]>(`/stories/${id}/pages`);

  return <Reader story={story} pages={pages} autoPlay={play === '1'} />;
}
