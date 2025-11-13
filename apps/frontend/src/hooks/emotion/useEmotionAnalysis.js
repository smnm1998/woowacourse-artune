import { useState } from 'react';
import { analyzeEmotion } from '@/api/emotionApi';
import { ERROR_MESSAGES } from '@/constants/errorMessages';
import {
  PROGRESS_UPDATE_INTERVAL,
  MAX_PROGRESS_BEFORE_COMPLETE,
  PROGRESS_INCREMENT_MAX,
} from '@/constants/loading';

/**
 * 감정 분석 로직을 관리하는 커스텀 훅
 *
 * @returns {Object} 감정 분석 상태 및 함수들
 */
export function useEmotionAnalysis() {
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  /**
   * 진행률을 시뮬레이션하는 함수
   * 실제 API 진행 상태를 알 수 없으므로 가짜 진행률 표시
   */
  const startProgressSimulation = () => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= MAX_PROGRESS_BEFORE_COMPLETE) {
          clearInterval(interval);
          return MAX_PROGRESS_BEFORE_COMPLETE;
        }
        return prev + Math.random() * PROGRESS_INCREMENT_MAX;
      });
    }, PROGRESS_UPDATE_INTERVAL);

    return interval;
  };

  /**
   * 감정 분석 수행
   *
   * @param {string} text - 분석할 텍스트
   */
  const analyze = async (text) => {
    // 초기화
    setIsLoading(true);
    setProgress(0);
    setError(null);
    setResult(null);

    // 진행률 시뮬레이션 시작
    const progressInterval = startProgressSimulation();

    try {
      // API 호출
      const analysisResult = await analyzeEmotion(text);

      // 진행률 완료 처리
      clearInterval(progressInterval);
      setProgress(100);

      // 결과 저장
      setResult(analysisResult);
    } catch (err) {
      // 에러 처리
      clearInterval(progressInterval);
      setError(err.message || ERROR_MESSAGES.EMOTION_ANALYSIS_FAILED);
      setProgress(0);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * 에러 메시지 초기화
   */
  const clearError = () => {
    setError(null);
  };

  /**
   * 전체 상태 초기화 (다시하기)
   */
  const reset = () => {
    setIsLoading(false);
    setProgress(0);
    setResult(null);
    setError(null);
  };

  return {
    isLoading,
    progress,
    result,
    error,
    analyze,
    clearError,
    reset,
  };
}

export default useEmotionAnalysis;
