import { post } from './client';
import { API_ENDPOINTS, API_BASE_URL } from '@/constants/api';

/**
 * 감정 분석 API 호출
 *
 * @param {string} text - 분석할 텍스트
 * @returns {Promise<Object>} 감정 분석 결과
 * @throws {ApiError} API 호출 실패 시
 */
export async function analyzeEmotion(text) {
  const response = await post(API_ENDPOINTS.ANALYZE_EMOTION, { text });
  return response;
}

/**
 * 감정 분석 API 호출 (SSE - 진행률 포함)
 *
 * @param {string} text - 분석할 텍스트
 * @param {Function} onProgress - 진행률 콜백 (progress: number, message: string)
 * @returns {Promise<Object>} 감정 분석 결과
 * @throws {Error} API 호출 실패 시
 */
export async function analyzeEmotionWithProgress(text, onProgress) {
  return new Promise((resolve, reject) => {
    const url = `${API_BASE_URL}${API_ENDPOINTS.ANALYZE_EMOTION_STREAM}?text=${encodeURIComponent(text)}`;

    // EventSource는 credentials를 보내지 않으므로 withCredentials 옵션 없이 생성
    const eventSource = new EventSource(url);

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);

        if (data.type === 'progress') {
          // 진행률 업데이트
          onProgress(data.progress, data.message);
        }
        if (data.type === 'complete') {
          // 완료
          eventSource.close();
          resolve(data.data);
        }
        if (data.type === 'error') {
          // 에러
          eventSource.close();
          reject(new Error(data.message));
        }
      } catch (error) {
        eventSource.close();
        reject(error);
      }
    };

    eventSource.onerror = (event) => {
      console.error('SSE Error:', event);
      eventSource.close();

      // EventSource 연결 실패 시 에러 메시지
      const errorMessage = event.target.readyState === EventSource.CLOSED
        ? '서버와의 연결이 끊어졌습니다. 다시 시도해주세요.'
        : '감정 분석 중 오류가 발생했습니다.';

      reject(new Error(errorMessage));
    };
  });
}
