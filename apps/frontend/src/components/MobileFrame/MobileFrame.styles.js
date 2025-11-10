import { css } from '@emotion/react';

export const frameContainerStyle = css`
  display: flex;
  justify-content: center;
  align-itmes: center;
  padding: 40px 20px;
`;

// 핸드폰 외곽 프레임
export const frameOuterStyle = css`
  position: relative;
  width: 375px;
  height: 812px;
  background: rgba(20, 20, 20, 0.95);
  border-radius: 40px;
  padding: 12px;
  box-shadow:
    0 0 0 8px rgba(40, 40, 40, 0.8),
    0 0 0 10px rgba(60, 60, 60, 0.6),
    0 20px 60px rgba(0, 0, 0, 0.5);

  /* 글래스 효과 */
  backdrop-filter: blur(10px);
  border: 2px solid rgba(255, 255, 255, 0.1);

  display: flex;
  flex-direction: column;
  gap: 8px;
`;

// 노치 (상단 카메라 영역)
export const notchStyle = css`
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 150px;
  height: 28px;
  background: rgba(20, 20, 20, 0.95);
  border-radius: 0 0 20px 20px;
  z-index: 10;

  /* 스피커 */
  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 60px; /* 40px → 60px */
    height: 4px;
    background: rgba(40, 40, 50, 0.9);
    border-radius: 2px;
  }

  /* 카메라 구멍 */
  &::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 75%; /* 30% → 75% */
    transform: translate(-50%, -50%);
    width: 8px;
    height: 8px;
    background: rgba(60, 60, 80, 0.8);
    border-radius: 50%;
  }
`;

// 스크린 (실제 콘텐츠 영역)
export const screenStyle = css`
  flex: 1;
  background: linear-gradient(135deg, #000f00 0%, #0d0d0d 100%);
  border-radius: 32px;
  overflow-y: auto;
  overflow-x: hidden;
  position: relative;

  /* 스크롤바 스타일링 */
  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.2);
    border-radius: 3px;
    backdrop-filter: blur(5px);
  }

  &::-webkit-scrollbar-thumb:hover {
    background: rgba(255, 255, 255, 0.3);
  }
`;

// 홈 인디케이터 (하단 바)
export const homeIndicatorStyle = css`
  width: 120px;
  height: 4px;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 2px;
  margin: 0 auto;
`;
