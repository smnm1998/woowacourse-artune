/**
 * 로딩 관련 상수
 */

/** 진행률 업데이트 간격 (밀리초) */
export const PROGRESS_UPDATE_INTERVAL = 150;

/** 최대 진행률 (API 호출 중 표시할 최대값) */
export const MAX_PROGRESS_BEFORE_COMPLETE = 90;

/** 진행률 증가 최대값 (랜덤 범위) */
export const PROGRESS_INCREMENT_MAX = 15;

/** API 호출 시뮬레이션 대기 시간 (밀리초) - 실제 API 연동 시 제거 예정 */
export const MOCK_API_DELAY = 5000;
