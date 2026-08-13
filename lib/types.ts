/** Mirrors the DTOs the API returns. Kept flat and hand-written on purpose. */

export type StoryLength = 'SHORT' | 'MEDIUM' | 'LONG';
export type NarratorVoice = 'MARYAM' | 'BABAK' | 'NAZANIN';
export type IllustrationStyle = 'WATERCOLOR' | 'CLASSIC' | 'PAPERCUT';
export type StoryTone = 'CALM' | 'FUNNY' | 'BRAVE';
export type StoryStatus =
  | 'DRAFT'
  | 'AWAITING_PAYMENT'
  | 'GENERATING'
  | 'READY'
  | 'FAILED';
export type StoryTheme =
  | 'FANTASY'
  | 'SPACE'
  | 'DINO'
  | 'OCEAN'
  | 'ANIMALS'
  | 'HERO'
  | 'MYSTERY'
  | 'BEDTIME'
  | 'OWN';

export interface ChildDto {
  id: string;
  firstName: string;
  age: number;
  interests: string[];
  hasPhoto: boolean;
  photoStatus: 'NONE' | 'PENDING' | 'READY' | 'FLAGGED' | 'DELETED';
  prefLength: StoryLength;
  prefVoice: NarratorVoice;
  prefStyle: IllustrationStyle;
  prefAvoidScary: boolean;
  storyCount: number;
  createdAt: string;
}

export interface StoryDto {
  id: string;
  title: string | null;
  childId: string;
  childName: string | null;
  theme: StoryTheme;
  length: StoryLength;
  pageCount: number;
  tone: StoryTone;
  style: IllustrationStyle;
  voice: NarratorVoice;
  status: StoryStatus;
  durationSec: number | null;
  isFavorite: boolean;
  readCount: number;
  lastReadPage: number;
  lastReadAt: string | null;
  failureReason: string | null;
  createdAt: string;
  readyAt: string | null;
}

export type OrderStatus = 'PENDING' | 'PAID' | 'FAILED' | 'CANCELLED';

export type JobStage =
  | 'CHARACTER'
  | 'WRITING'
  | 'ILLUSTRATION'
  | 'NARRATION'
  | 'BINDING';

export type JobStatus = 'QUEUED' | 'RUNNING' | 'DONE' | 'FAILED';

export interface OrderDto {
  id: string;
  storyId: string;
  /** ریال — render with faPrice, which converts to تومان. */
  amount: number;
  currency: string;
  status: OrderStatus;
  paymentRef: string | null;
  paidAt: string | null;
  createdAt: string;
  storyTitle?: string | null;
  storyStatus?: StoryStatus | null;
}

/** POST /stories — the wizard's final step returns the story and its payment link. */
export interface CreatedStory {
  story: StoryDto;
  order: OrderDto;
  payUrl: string;
}

export interface StoryPageDto {
  index: number;
  text: string;
}

export interface StoryProgressDto {
  status: StoryStatus;
  failureReason: string | null;
  orderId: string | null;
  percent: number;
  stages: { stage: JobStage; status: JobStatus; error: string | null }[];
}

export interface NotificationDto {
  id: string;
  type: string;
  title: string;
  body: string;
  readAt: string | null;
  createdAt: string;
}

export interface SessionDto {
  id: string;
  device: string | null;
  ip: string | null;
  createdAt: string;
  current: boolean;
}

export interface NotificationPrefs {
  notifyStoryReady: boolean;
  notifyPayment: boolean;
  notifyProductNews: boolean;
}
