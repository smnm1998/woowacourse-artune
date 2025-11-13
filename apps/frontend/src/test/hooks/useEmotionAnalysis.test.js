import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import { useEmotionAnalysis } from '@/hooks/emotion/useEmotionAnalysis';
import * as emotionApi from '@/api/emotionApi';

// API 모킹
vi.mock('@/api/emotionApi');

describe('useEmotionAnalysis', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.clearAllTimers();
  });

  it('초기 상태가 올바르게 설정되어야 함', () => {
    const { result } = renderHook(() => useEmotionAnalysis());

    expect(result.current.isLoading).toBe(false);
    expect(result.current.progress).toBe(0);
    expect(result.current.result).toBe(null);
    expect(result.current.error).toBe(null);
  });

  it('analyze 호출 시 로딩 상태가 활성화되어야 함', async () => {
    emotionApi.analyzeEmotion = vi.fn(() => new Promise(() => {}));

    const { result } = renderHook(() => useEmotionAnalysis());

    act(() => {
      result.current.analyze('행복한 텍스트');
    });

    expect(result.current.isLoading).toBe(true);
  });

  it('진행률이 점진적으로 증가해야 함', async () => {
    vi.useFakeTimers();
    emotionApi.analyzeEmotion = vi.fn(() => new Promise(() => {}));

    const { result } = renderHook(() => useEmotionAnalysis());

    act(() => {
      result.current.analyze('테스트');
    });

    expect(result.current.progress).toBe(0);

    // 500ms 경과
    act(() => {
      vi.advanceTimersByTime(500);
    });

    expect(result.current.progress).toBeGreaterThan(0);
    expect(result.current.progress).toBeLessThan(90);

    vi.useRealTimers();
  });

  it('API 성공 시 결과를 저장하고 진행률 100%로 설정', async () => {
    const mockResult = {
      emotion: 'happy',
      tracks: [],
    };

    emotionApi.analyzeEmotion = vi.fn(() => Promise.resolve(mockResult));

    const { result } = renderHook(() => useEmotionAnalysis());

    await act(async () => {
      await result.current.analyze('행복한 텍스트');
    });

    await waitFor(() => {
      expect(result.current.progress).toBe(100);
      expect(result.current.result).toEqual(mockResult);
      expect(result.current.isLoading).toBe(false);
    });
  });

  it('API 실패 시 에러를 설정하고 진행률 초기화', async () => {
    const errorMessage = '분석 실패';
    emotionApi.analyzeEmotion = vi.fn(() =>
      Promise.reject(new Error(errorMessage)),
    );

    const { result } = renderHook(() => useEmotionAnalysis());

    await act(async () => {
      await result.current.analyze('테스트');
    });

    await waitFor(() => {
      expect(result.current.error).toBe(errorMessage);
      expect(result.current.progress).toBe(0);
      expect(result.current.isLoading).toBe(false);
    });
  });

  it('reset 호출 시 모든 상태가 초기화되어야 함', async () => {
    const mockResult = { emotion: 'happy' };
    emotionApi.analyzeEmotion = vi.fn(() => Promise.resolve(mockResult));

    const { result } = renderHook(() => useEmotionAnalysis());

    await act(async () => {
      await result.current.analyze('테스트');
    });

    act(() => {
      result.current.reset();
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.progress).toBe(0);
    expect(result.current.result).toBe(null);
    expect(result.current.error).toBe(null);
  });

  it('clearError 호출 시 에러만 초기화되어야 함', async () => {
    emotionApi.analyzeEmotion = vi.fn(() => Promise.reject(new Error('에러')));

    const { result } = renderHook(() => useEmotionAnalysis());

    await act(async () => {
      await result.current.analyze('테스트');
    });

    act(() => {
      result.current.clearError();
    });

    expect(result.current.error).toBe(null);
  });
});
