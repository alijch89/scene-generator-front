import type { Metadata } from 'next';
import { AddChildButton } from '@/components/app/child-form';
import { EmptyState } from '@/components/app/ui';
import { STORY_PRICE_RIAL_BY_LENGTH } from '@/lib/config';
import { sapi } from '@/lib/dal';
import type { ChildDto } from '@/lib/types';
import { WizardForm } from './wizard-form';

export const metadata: Metadata = { title: 'ساخت قصهٔ تازه' };

/** Server page that verifies child availability and supplies optional initial selection. */
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
      prices={STORY_PRICE_RIAL_BY_LENGTH}
    />
  );
}
/**
 * @file page.tsx
 * @description Loads parent child profiles and renders the four-step story creation wizard.
 */
