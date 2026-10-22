/**
 * @file upload.ts
 * @description Validates and uploads private child photos while reporting browser progress.
 */

import {
  API_URL,
  CSRF_PROTECTION_HEADER,
  CSRF_PROTECTION_VALUE,
} from './api';

/** «حداکثر ۱۰ مگابایت، JPG یا PNG» — checked here so the drawer can say so
 *  before spending the upload, and again by the API which is the real limit. */
export const MAX_PHOTO_BYTES = 10 * 1024 * 1024;
/** MIME types accepted by both browser validation and the upload endpoint. */
export const PHOTO_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

/** Extensions whose type is known when the browser leaves `File.type` empty. */
const EXTENSION_TYPES: Record<string, string> = {
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  png: 'image/png',
  webp: 'image/webp',
};

/**
 * Gives a photo the content type its extension implies when the browser sent
 * none. Some browsers and file managers leave `type` empty for a perfectly
 * good .jpg, and the API judges the upload by the type the browser declares —
 * so without this the file would be refused for a reason the parent cannot see.
 */
export function normalizePhoto(file: File): File {
  if (file.type) return file;
  const type = EXTENSION_TYPES[file.name.split('.').pop()?.toLowerCase() ?? ''];
  return type ? new File([file], file.name, { type }) : file;
}

/** Returns a localized validation message, or null when a photo is uploadable. */
export function photoError(file: File): string | null {
  if (!PHOTO_TYPES.includes(file.type)) {
    const heic = /hei[cf]/i.test(file.type) || /\.hei[cf]$/i.test(file.name);
    return heic
      ? 'عکس‌های HEIC آیفون پشتیبانی نمی‌شوند. آن را به JPG تبدیل کنید یا در تنظیمات دوربین «Most Compatible» را روشن کنید.'
      : `نوع این فایل${file.type ? ` (${file.type})` : ''} پشتیبانی نمی‌شود. فقط JPG، PNG یا WebP بفرستید.`;
  }
  if (file.size > MAX_PHOTO_BYTES) {
    return `حجم این فایل ${faMegabytes(file.size)} است و از ۱۰ مگابایت بیشتر است. عکس کوچک‌تری انتخاب کنید.`;
  }
  return null;
}

/**
 * fetch() cannot report upload progress, and the design's drawer shows a
 * percentage — so this one stays on XHR.
 */
export function uploadChildPhoto(
  childId: string,
  file: File,
  onProgress: (fraction: number) => void,
): Promise<void> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('PUT', `${API_URL}/children/${childId}/photo`);
    xhr.withCredentials = true;
    xhr.setRequestHeader(CSRF_PROTECTION_HEADER, CSRF_PROTECTION_VALUE);

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) onProgress(event.loaded / event.total);
    };
    xhr.onload = () => {
      if (xhr.status < 300) return resolve();
      let message = 'بارگذاری عکس ناموفق بود.';
      try {
        const body = JSON.parse(xhr.responseText) as { message?: string };
        if (body.message) message = body.message;
      } catch {
        // non-JSON error body — keep the generic message
      }
      reject(new Error(message));
    };
    xhr.onerror = () => reject(new Error('اتصال قطع شد. دوباره تلاش کنید.'));

    const form = new FormData();
    form.append('file', file);
    xhr.send(form);
  });
}

/** ۲٫۱ مگابایت */
export const faMegabytes = (bytes: number) =>
  `${(bytes / 1024 / 1024).toFixed(1).replace(/\d/g, (d) => '۰۱۲۳۴۵۶۷۸۹'[Number(d)]).replace('.', '٫')} مگابایت`;

/**
 * Private, credentialed photo URL for a child.
 *
 * The API lets browsers cache the image, so the photo's version is part of
 * the URL: a replaced photo is then fetched fresh instead of served stale.
 */
export const childPhotoUrl = (childId: string, version?: string | null) =>
  `${API_URL}/children/${childId}/photo${
    version ? `?v=${encodeURIComponent(version)}` : ''
  }`;
