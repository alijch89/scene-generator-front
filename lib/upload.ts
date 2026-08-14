/**
 * @file upload.ts
 * @description Validates and uploads private child photos while reporting browser progress.
 */

import { API_URL } from './api';

/** «حداکثر ۱۰ مگابایت، JPG یا PNG» — checked here so the drawer can say so
 *  before spending the upload, and again by the API which is the real limit. */
export const MAX_PHOTO_BYTES = 10 * 1024 * 1024;
/** MIME types accepted by both browser validation and the upload endpoint. */
export const PHOTO_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

/** Returns a localized validation message, or null when a photo is uploadable. */
export function photoError(file: File): string | null {
  if (!PHOTO_TYPES.includes(file.type)) {
    return 'فقط JPG یا PNG بفرستید.';
  }
  if (file.size > MAX_PHOTO_BYTES) {
    return 'حجم فایل بیشتر از ۱۰ مگابایت است. عکس کوچک‌تری انتخاب کنید.';
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
