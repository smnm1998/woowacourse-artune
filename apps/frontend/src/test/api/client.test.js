import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { get, post, ApiError } from '@/api/client';
import { ERROR_MESSAGES } from '@/constants/errorMessages';

describe('API Client', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('request 타임아웃', () => {
    it('REQUEST_TIMEOUT 초과 시 ApiError를 던져야 함', async () => {
      // fetch를 무한 대기로 모킹
      global.fetch = vi.fn((url, options) => {
        return new Promise((resolve, reject) => {
          if (options?.signal) {
            options.signal.addEventListener('abort', () => {
              reject(
                Object.assign(new Error('The operation was aborted'), {
                  name: 'AbortError',
                }),
              );
            });
          }
        });
      });

      vi.useFakeTimers();

      const promise = get('/test');

      // 시간 경과 시뮬레이션
      await vi.advanceTimersByTimeAsync(31000);

      await expect(promise).rejects.toThrow(ApiError);
      await expect(promise).rejects.toThrow(ERROR_MESSAGES.TIMEOUT_ERROR);

      vi.useRealTimers();
    });

    it('AbortError 발생 시 TIMEOUT_ERROR를 던져야 함', async () => {
      global.fetch = vi.fn(() =>
        Promise.reject(
          Object.assign(new Error('The operation was aborted'), {
            name: 'AbortError',
          }),
        ),
      );

      await expect(get('/test')).rejects.toThrow(ApiError);
      await expect(get('/test')).rejects.toThrow(ERROR_MESSAGES.TIMEOUT_ERROR);
    });
  });

  describe('HTTP 에러 처리', () => {
    it('500 에러 시 SERVER_ERROR 메시지를 반환해야 함', async () => {
      global.fetch = vi.fn(() =>
        Promise.resolve({
          ok: false,
          status: 500,
          json: () => Promise.resolve({}),
        }),
      );

      await expect(get('/test')).rejects.toThrow(ERROR_MESSAGES.SERVER_ERROR);
    });

    it('400 에러 시 CLIENT_ERROR 메시지를 반환해야 함', async () => {
      global.fetch = vi.fn(() =>
        Promise.resolve({
          ok: false,
          status: 400,
          json: () => Promise.resolve({}),
        }),
      );

      await expect(get('/test')).rejects.toThrow(ERROR_MESSAGES.CLIENT_ERROR);
    });
  });

  describe('성공 케이스', () => {
    it('정상 응답 시 JSON 데이터를 반환해야 함', async () => {
      const mockData = { result: 'success' };

      global.fetch = vi.fn(() =>
        Promise.resolve({
          ok: true,
          status: 200,
          json: () => Promise.resolve(mockData),
        }),
      );

      const result = await get('/test');
      expect(result).toEqual(mockData);
    });
  });

  describe('POST 요청', () => {
    it('body를 JSON으로 직렬화하여 전송해야함', async () => {
      const mockData = { text: '테스트' };

      global.fetch = vi.fn(() =>
        Promise.resolve({
          ok: true,
          status: 200,
          json: () => Promise.resolve({}),
        }),
      );

      await post('/analyze', mockData);

      expect(global.fetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify(mockData),
        }),
      );
    });
  });
});
