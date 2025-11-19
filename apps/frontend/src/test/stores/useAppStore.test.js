import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import useAppStore from '@/stores/useAppStore';
import * as emotionApi from '@/api/emotionApi';

vi.mock('useAppStore', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.clearAllTimers();

    // 시작 전 초기화
    useAppStore.getState().reset();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('초기 상태', () => {
    it('올바른 초기값을 갸져야 함', () => {
      const { currentPage, isLoading, progress, emotionResult, error } =
        useAppStore.getState();

      expect(currentPage).toBe('input');
      expect(isLoading).toBe(false);
      expect(progress).toBe(0);
      expect(emotionResult).toBe(null);
      exppect(error).toBe(null);
    });
  });

  describe('setPage', () => {
    it('페이지를 변경할 수 있어야 함', () => {
      const { setPage } = useAppStore.getState();

      act(() => {
        setPage('loading');
      });

      expect(useAppStore.getState().currentPage).toBe('loading');

      act(() => {
        setPage('result');
      });

      expect(useAppStore.getState().currentPage).toBe('result');
    });
  });

  describe('analyzeEmotion', () => {
    it('API 호출 시 로딩 상태와 페이지 전환이 발생해야 함', async () => {
      emotionApi.analyzeEmotion = vi.fn(() => new Promise(() => {}));

      const { analyzeEmotion } = useAppStore.getState();

      await act(async () => {
        analyzeEmotion('테스트 텍스트');
      });

      const state = useAppStore.getState();
      expect(state.currentPage).toBe('loading');
      expect(state.isLoading).toBe(true);
      expect(state.progress).toBeGreaterThanOrEqual(0);
    });

    it('진행률이 점진적으로 증가해야 함', async () => {
      vi.useFakeTimers();
      emotionApi.analyzeEmotion = vi.fn(() => new Promise(() => {}));

      const { analyzeEmotion } = useAppStore.getState();

      await act(async () => {
        analyzeEmotion('테스트');
      });

      const initialProgress = useAppStore.getState().progress;
      expect(initialProgress).toBe(0);

      // 500ms 경과
      await act(async () => {
        await vi.advanceTimersByTimeAsync(500);
      });

      const afterProgress = useAppStore.getState().progress;
      expect(afterProgress).toBeGreaterThan(0);
      expect(afterProgress).toBeLessThan(96); // MAX_PROGRESS_BEFORE_COMPLETE

      vi.useRealTimers();
    });

    it('API 성공 시 결과를 저장하고 페이지를 전환해야 함', async () => {
      const mockResult = {
        emotion: 'joy',
        emotionLabel: '기쁨',
        playlists: {
          immerse: [{ id: '1', name: 'Track 1' }],
          soothe: [{ id: '2', name: 'Track 2' }],
        },
      };

      emotionApi.analyzeEmotion = vi.fn(() => Promise.resolve(mockResult));

      const { analyzeEmotion } = useAppStore.getState();

      await act(async () => {
        await analyzeEmotion('행복한 텍스트');
      });

      await waitFor(
        () => {
          const state = useAppStore.getState();
          expect(state.emotionResult).toEqual(mockResult);
          expect(state.currentPage).toBe('result');
          expect(state.isLoading).toBe(false);
          expect(state.progress).toBe(100);
        },
        { timeout: 3000 },
      );
    });

    it('API 실패 시 에러를 설정하고 input 페이지로 돌아가야 함', async () => {
      const errorMessage = '분석 실패';
      emotionApi.analyzeEmotion = vi.fn(() =>
        Promise.reject(new Error(errorMessage)),
      );

      const { analyzeEmotion } = useAppStore.getState();

      await act(async () => {
        await analyzeEmotion('테스트');
      });

      await waitFor(() => {
        const state = useAppStore.getState();
        expect(state.error).toBe(errorMessage);
        expect(state.currentPage).toBe('input');
        expect(state.isLoading).toBe(false);
        expect(state.progress).toBe(0);
      });
    });
  });

  describe('reset', () => {
    it('모든 상태를 초기화해야 함', async () => {
      const mockResult = { emotion: 'joy' };
      emotionApi.analyzeEmotion = vi.fn(() => Promise.resolve(mockResult));

      const { analyzeEmotion, reset } = useAppStore.getState();

      // 먼저 분석 실행
      await act(async () => {
        await analyzeEmotion('테스트');
      });

      await waitFor(() => {
        expect(useAppStore.getState().emotionResult).toEqual(mockResult);
      });

      // reset 호출
      act(() => {
        reset();
      });

      const state = useAppStore.getState();
      expect(state.currentPage).toBe('input');
      expect(state.isLoading).toBe(false);
      expect(state.progress).toBe(0);
      expect(state.emotionResult).toBe(null);
      expect(state.error).toBe(null);
    });
  });

  describe('clearError', () => {
    it('에러만 초기화해야 함', async () => {
      emotionApi.analyzeEmotion = vi.fn(() =>
        Promise.reject(new Error('에러')),
      );

      const { analyzeEmotion, clearError } = useAppStore.getState();

      await act(async () => {
        await analyzeEmotion('테스트');
      });

      await waitFor(() => {
        expect(useAppStore.getState().error).toBe('에러');
      });

      act(() => {
        clearError();
      });

      expect(useAppStore.getState().error).toBe(null);
      // 다른 상태는 그대로 유지되어야 함
      expect(useAppStore.getState().currentPage).toBe('input');
    });
  });
});
