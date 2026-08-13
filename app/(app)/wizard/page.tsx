import type { Metadata } from 'next';
import { AddChildButton } from '@/components/app/child-form';
import { EmptyState } from '@/components/app/ui';
import { STORY_PRICE_RIAL } from '@/lib/config';
import { sapi } from '@/lib/dal';
import type { ChildDto } from '@/lib/types';
import { WizardForm } from './wizard-form';

export const metadata: Metadata = { title: 'ساخت قصهٔ تازه' };

export default async function WizardPage({
  searchParams,
}: PageProps<'/wizard'>) {
  const { child, idea } = await searchParams;
  const childProfiles = await sapi.get<ChildDto[]>('/children');

  // A wizard with no hero has nothing to ask about.
  if (childProfiles.length === 0) {
    return (
      <EmptyState
        icon="✦"
        title="اول یک پروندهٔ کودک بسازید."
        action={
          <AddChildButton className="rounded-[15px] bg-linear-to-br from-brand to-warm px-6 py-3.5 text-[15px] font-bold text-brand-fg">
            + افزودن کودک
          </AddChildButton>
        }
      >
        قصه‌ها با نام، سن و علاقه‌های کودک شما نوشته می‌شوند.
      </EmptyState>
    );
  }

  return (
    <WizardForm
      childProfiles={childProfiles}
      initialChildId={typeof child === 'string' ? child : undefined}
      initialIdea={typeof idea === 'string' ? idea : undefined}
      price={STORY_PRICE_RIAL}
    />
  );
}
