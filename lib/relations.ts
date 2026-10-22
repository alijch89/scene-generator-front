/**
 * @file relations.ts
 * @description Shared helpers for saved supporting characters: photo URLs and completeness.
 */

import { API_URL } from '@/lib/api';
import type { ChildRelationDto } from '@/lib/types';

/** Suggested relations; the field stays free text. */
export const RELATION_EXAMPLES = [
  'مادر',
  'پدر',
  'خواهر',
  'برادر',
  'مادربزرگ',
  'پدربزرگ',
  'خاله',
  'عمه',
  'دایی',
  'عمو',
  'دوست',
];

/** Most saved characters one child can have; the API enforces the same limit. */
export const MAX_RELATIONS_PER_CHILD = 10;

/**
 * Private, credentialed photo URL for a saved character.
 *
 * The API lets browsers cache the image for minutes, so the version — the
 * row's last-change time — is part of the URL: replacing the photo then shows
 * the new one immediately instead of the cached old one.
 */
export const relationPhotoUrl = (
  childId: string,
  relationId: string,
  version?: string | null,
) =>
  `${API_URL}/children/${childId}/relations/${relationId}/photo${
    version ? `?v=${encodeURIComponent(version)}` : ''
  }`;

/** What a saved character still lacks to be usable in a story, in Persian. */
export function relationMissing(
  relation: Pick<ChildRelationDto, 'name' | 'relation' | 'hasPhoto'>,
): string[] {
  return [
    !relation.name.trim() && 'نام',
    !relation.relation.trim() && 'نسبت',
    !relation.hasPhoto && 'عکس',
  ].filter((part): part is string => Boolean(part));
}
