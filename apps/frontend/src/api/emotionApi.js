import { post } from './client';
import { API_ENDPOINTS } from '@/constants/api';

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
