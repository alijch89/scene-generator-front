export interface UserProfile {
  id: string;
  phoneNumber: string;
  email: string | null;
  displayName: string | null;
  roles: string[];
  permissions: string[];
}

export interface ApiErrorBody {
  statusCode?: number;
  message?: string | string[];
  correlationId?: string;
}

export type StoryStatus =
  | "Draft"
  | "Queued"
  | "Processing"
  | "Completed"
  | "Failed"
  | "Cancelled"
  | "Expired";

export interface Story {
  id: string;
  userId: string;
  title: string;
  topic: string;
  language: string;
  childName: string;
  childAge: number;
  durationMinutes: number;
  status: StoryStatus;
  coverImageUrl: string | null;
  storyText: string | null;
  createdAt: string;
  updatedAt: string;
  completedAt: string | null;
  character?: { photoUrl: string };
}

export interface StoryPage {
  id: string;
  storyId: string;
  pageNumber: number;
  pageTitle: string | null;
  pageText: string;
  imageUrl: string | null;
  audioUrl: string | null;
  durationSeconds: number;
}

export interface StoryAsset {
  id: string;
  assetType: string;
  publicUrl: string;
  mimeType: string;
  fileSize: string;
  createdAt: string;
}

export interface StoryJob {
  id: string;
  storyId: string;
  status: string;
  attemptCount: number;
  errorMessage: string | null;
  createdAt: string;
}

export interface StoryList {
  items: Story[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface StoryCatalogs {
  topics: Array<{ slug: string; displayName: string; description: string }>;
  languages: Array<{
    code: string;
    displayName: string;
    nativeName: string;
    isRtl: boolean;
  }>;
}

export function assetUrl(value: string | null): string | undefined {
  if (!value) return undefined;
  return value.replace(/^\/api\/v1\//, "/api/");
}
