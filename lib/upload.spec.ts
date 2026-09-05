import {
  CSRF_PROTECTION_HEADER,
  CSRF_PROTECTION_VALUE,
} from './api';
import { uploadChildPhoto } from './upload';

describe('uploadChildPhoto', () => {
  it('adds browser-intent proof to the credentialed XHR upload', async () => {
    const xhr = {
      open: jest.fn(),
      setRequestHeader: jest.fn(),
      send: jest.fn(),
      upload: {} as XMLHttpRequestUpload,
      status: 204,
      responseText: '',
      withCredentials: false,
      onload: null as null | (() => void),
      onerror: null as null | (() => void),
    };
    const original = global.XMLHttpRequest;
    global.XMLHttpRequest = jest.fn(() => xhr) as never;

    try {
      const result = uploadChildPhoto(
        '2f47d639-5810-4cb7-b65f-7596f88478f4',
        new File(['photo'], 'child.jpg', { type: 'image/jpeg' }),
        jest.fn(),
      );
      xhr.onload?.();
      await expect(result).resolves.toBeUndefined();

      expect(xhr.withCredentials).toBe(true);
      expect(xhr.setRequestHeader).toHaveBeenCalledWith(
        CSRF_PROTECTION_HEADER,
        CSRF_PROTECTION_VALUE,
      );
      expect(xhr.send).toHaveBeenCalledWith(expect.any(FormData));
    } finally {
      global.XMLHttpRequest = original;
    }
  });
});
