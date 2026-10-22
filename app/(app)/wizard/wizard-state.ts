import type {
  ChildDto,
  ChildRelationDto,
  IllustrationStyle,
  StoryLength,
  StoryTheme,
  StoryTone,
} from '@/lib/types';
import { relationMissing } from '@/lib/relations';

/** The four labelled steps of the rail, in order. */
export const STEPS = ['قهرمان', 'موضوع', 'سفارشی‌سازی', 'پیش‌نمایش'] as const;

export const LENGTHS: StoryLength[] = ['SHORT', 'MEDIUM', 'LONG'];
export const TONES: StoryTone[] = ['CALM', 'FUNNY', 'BRAVE'];
export const STYLES: IllustrationStyle[] = [
  'WATERCOLOR',
  'CLASSIC',
  'PAPERCUT',
];

/** The topic sentence the generator receives for each predefined theme. */
export const TOPIC_FOR_THEME: Record<StoryTheme, string> = {
  HONESTY: 'راست‌گویی و پذیرفتن اشتباه',
  KINDNESS: 'مهربانی و انجام کار خوب',
  COURAGE: 'شجاعت و غلبه بر ترس',
  SHARING: 'سهیم شدن و رعایت نوبت',
  TEAMWORK: 'همکاری و کمک به دیگران',
  RESPONSIBILITY: 'مسئولیت‌پذیری و نگه‌داشتن قول',
  PATIENCE: 'صبر و پشتکار',
  RESPECT: 'احترام و رفتار مؤدبانه',
  OWN: '',
};

/** The editable art-direction phrase each illustration preset fills in. */
export const ART_STYLE_TEXT: Record<IllustrationStyle, string> = {
  WATERCOLOR: 'آبرنگی',
  CLASSIC: 'کتاب داستان کلاسیک',
  PAPERCUT: 'کلاژ کاغذی',
};

/** Scene count each length preset fills in; the field stays editable. */
export const SCENES_FOR_LENGTH: Record<StoryLength, number> = {
  SHORT: 6,
  MEDIUM: 8,
  LONG: 12,
};

export const CONSIDERATION_EXAMPLES = [
  'حیوانات را دوست داشته باشد',
  'فضای داستان آرام و بدون ترس باشد',
  'قهرمان کنجکاو و مهربان باشد',
  'ماجرا شوخ‌طبع و پرانرژی باشد',
];

export const MORAL_EXAMPLES = [
  'مهربانی با حیوانات',
  'همکاری و کمک به دیگران',
  'راست‌گویی و پذیرش اشتباه',
  'اعتمادبه‌نفس و غلبه بر ترس',
];

export const AGE_RANGE_EXAMPLES = ['3-5', '5-8', '9-12'];

export { RELATION_EXAMPLES } from '@/lib/relations';

/** One line of guidance under the footer, per step. */
export const HINTS = [
  'قصه با نام و علاقه‌های او نوشته می‌شود.',
  'می‌توانید بعداً موضوع قصه را عوض کنید.',
  'اگر چیزی را عوض نکنید، پیش‌فرض‌ها استفاده می‌شوند.',
  'پس از پرداخت، ساخت قصه حدود یک دقیقه طول می‌کشد.',
];

/** The selected-card ring the design uses everywhere in this flow. */
export const ring = (on: boolean) =>
  on ? 'outline outline-3 outline-brand outline-offset-[3px]' : '';

/**
 * One of the four optional supporting-character slots the API accepts.
 *
 * Characters are chosen from the ones saved on the child's profile, where they
 * are made complete — name, relation and photo — in one step. Nothing is typed
 * into the wizard itself, so a half-filled character cannot be started here.
 */
export interface CharacterDraft {
  savedRelationId: string | null;
  name: string;
  relation: string;
  hasSavedPhoto: boolean;
  /** Version of the saved photo, so a replaced one is not served from cache. */
  photoVersion: string | null;
}

/** The provider's age bucket for a child's actual age. */
export const ageRangeFor = (age: number) =>
  age <= 4 ? '3-5' : age <= 8 ? '5-8' : '9-12';

/** Everything the four steps collect, and nothing about how they render it. */
export interface WizardDraft {
  step: number;
  childId: string;
  theme: StoryTheme;
  ownIdea: string;
  length: StoryLength;
  tone: StoryTone;
  style: IllustrationStyle;
  artStyle: string;
  storyConsiderations: string;
  desiredMoral: string;
  nScenes: number;
  ageRange: string;
  characters: CharacterDraft[];
}

/**
 * Every way the draft can change.
 *
 * Three of these exist because a choice implies another field: picking a
 * child re-suggests the age range and clears characters belonging to the
 * previous one, a length preset fills the scene count, and a style preset
 * fills the art-direction phrase. As separate `useState` setters those
 * couplings lived in JSX click handlers, where the next person to add a way
 * of setting a child had no reason to know about the other two.
 */
export type WizardAction =
  | { type: 'back' }
  | { type: 'next' }
  | { type: 'child'; child: ChildDto }
  | { type: 'length'; length: StoryLength }
  | { type: 'style'; style: IllustrationStyle }
  | { type: 'set'; patch: Partial<WizardDraft> }
  | { type: 'character/reuse'; relation: ChildRelationDto }
  | { type: 'character/remove'; index: number };

/** The API accepts four supporting characters; the UI must not offer a fifth. */
const MAX_CHARACTERS = 4;

/** Builds the opening draft from the profiles and any deep-linked intent. */
export function initialDraft({
  childProfiles,
  initialChildId,
  initialIdea,
}: {
  childProfiles: ChildDto[];
  initialChildId?: string;
  initialIdea?: string;
}): WizardDraft {
  const selected =
    childProfiles.find((profile) => profile.id === initialChildId) ??
    childProfiles[0];

  return {
    step: 1,
    childId: selected?.id ?? '',
    theme: initialIdea ? 'OWN' : 'HONESTY',
    ownIdea: initialIdea ? `قصه‌ای دربارهٔ ${initialIdea}` : '',
    length: 'MEDIUM',
    tone: 'CALM',
    style: 'WATERCOLOR',
    artStyle: ART_STYLE_TEXT.WATERCOLOR,
    storyConsiderations: '',
    desiredMoral: '',
    nScenes: SCENES_FOR_LENGTH.MEDIUM,
    ageRange: ageRangeFor(selected?.age ?? 7),
    characters: [],
  };
}

/** Applies one action to the draft. */
export function wizardReducer(
  draft: WizardDraft,
  action: WizardAction,
): WizardDraft {
  switch (action.type) {
    case 'back':
      return { ...draft, step: Math.max(1, draft.step - 1) };

    case 'next':
      return { ...draft, step: Math.min(STEPS.length, draft.step + 1) };

    case 'child':
      if (action.child.id === draft.childId) return draft;
      return {
        ...draft,
        childId: action.child.id,
        ageRange: ageRangeFor(action.child.age),
        // Supporting characters belong to one child's saved relations, so
        // carrying them across would offer another family's people.
        characters: [],
      };

    case 'length':
      return {
        ...draft,
        length: action.length,
        nScenes: SCENES_FOR_LENGTH[action.length],
      };

    case 'style':
      return {
        ...draft,
        style: action.style,
        artStyle: ART_STYLE_TEXT[action.style],
      };

    case 'set':
      return { ...draft, ...action.patch };

    case 'character/reuse': {
      const { relation } = action;
      const alreadyUsed = draft.characters.some(
        (character) => character.savedRelationId === relation.id,
      );
      if (
        relation.childId !== draft.childId ||
        // A saved person who is missing anything cannot be used until the
        // profile completes them.
        relationMissing(relation).length > 0 ||
        alreadyUsed ||
        draft.characters.length >= MAX_CHARACTERS
      ) {
        return draft;
      }
      return {
        ...draft,
        characters: [
          ...draft.characters,
          {
            savedRelationId: relation.id,
            name: relation.name,
            relation: relation.relation,
            hasSavedPhoto: relation.hasPhoto,
            photoVersion: relation.updatedAt,
          },
        ],
      };
    }

    case 'character/remove':
      return {
        ...draft,
        characters: draft.characters.filter(
          (_, index) => index !== action.index,
        ),
      };
  }
}

/**
 * What is still missing from a supporting character, or null when it is
 * complete.
 *
 * The story service takes a character with all three of name, relation and
 * photo, or not at all. One that has two of them is not a smaller character,
 * it is a story that fails after the parent has paid, so it is stopped here
 * instead. Characters only come from the profile, where they are saved whole,
 * so this is the backstop for a row that was saved before that was the rule.
 */
export function characterProblem(character: CharacterDraft): string | null {
  const missing = [
    !character.name.trim() && 'نام',
    !character.relation.trim() && 'نسبت',
    !(character.savedRelationId && character.hasSavedPhoto) && 'عکس',
  ].filter(Boolean);
  return missing.length
    ? `ناقص است (${missing.join('، ')}). آن را در پروفایل کودک کامل کنید یا از این قصه حذفش کنید.`
    : null;
}

/** Whether every supporting character on the draft is complete. */
export const charactersAreValid = (characters: CharacterDraft[]) =>
  characters.every((character) => characterProblem(character) === null);

/** Why this child cannot star in a video yet, or null. */
export const childPhotoProblem = (child?: ChildDto) =>
  child && !child.hasPhoto
    ? `برای ساخت ویدیو، عکس «${child.firstName}» لازم است. ابتدا از پروفایل او عکس را بارگذاری کنید.`
    : null;

/** The first thing keeping the cast from being complete, or null. */
export const castProblem = (draft: WizardDraft, child?: ChildDto) =>
  childPhotoProblem(child) ??
  (charactersAreValid(draft.characters)
    ? null
    : 'یکی از شخصیت‌ها ناقص است؛ آن را کامل یا حذف کنید.');

/** Whether the current step still has something wrong with it. */
export function isBlocked(draft: WizardDraft, child?: ChildDto): boolean {
  switch (draft.step) {
    case 1:
      return !draft.childId || childPhotoProblem(child) !== null;
    case 2:
      // The one place a step can be wrong: «ایدهٔ خودم» with nothing written.
      return draft.theme === 'OWN' && draft.ownIdea.trim().length < 10;
    case 3:
      return (
        !draft.artStyle.trim() ||
        !draft.ageRange.trim() ||
        draft.nScenes < 1 ||
        draft.nScenes > 50 ||
        !charactersAreValid(draft.characters)
      );
    default:
      // The last step is the one that goes to the gateway; it re-checks the
      // whole cast so nothing incomplete can slip through a back-and-forth.
      return castProblem(draft, child) !== null;
  }
}

/** The topic sentence for the current selection, predefined or written. */
export const topicOf = (draft: WizardDraft) =>
  draft.theme === 'OWN' ? draft.ownIdea.trim() : TOPIC_FOR_THEME[draft.theme];
/**
 * @file wizard-state.ts
 * @description Holds the story wizard's draft shape, its reducer, and the derived rules the steps read.
 */
