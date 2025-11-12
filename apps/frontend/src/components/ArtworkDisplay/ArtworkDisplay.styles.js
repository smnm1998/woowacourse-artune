import { css } from '@emotion/react';

// 전체 컨테이너
export const artworkContainerStyle = css`
  display: flex;
  flex-direction: column;
  max-width: 500px;
  gap: 20px;
  padding: 20px;
`;

// 아트워크
export const artworkWrapperStyle = css`
  width: 100%;
  aspect-ratio: 1/1;
  border-radius: 16px;
  overflow: hidden;
  backdrop-filter: blur(10px);
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);

  /* 이미지 로딩 */
  position: relative;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      90deg,
      rgba(255, 255, 255, 0) 0%,
      rgba(255, 255, 255, 0.05) 50%,
      rgba(255, 255, 255, 0) 100%
    );
    animation: shimmer 2s infinite;
  }

  @keyframes shimmer {
    0% {
      transform: translateY(-100%);
    }
    100% {
      transform: translateY(100%);
    }
  }
`;

export const artworkImageStyle = css`
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;

  /* 픽셀아트 컨셉 */
  image-rendering: pixelated;
  image-rendering: -moz-crisp-edges;
  image-rendering: crisp-edges;

  position: relative;
  z-index: 1;
`;

// 감정 정보 영역
export const artworkInfoStyle = css`
  display: flex;
  flex-direction: column;
  gap: 8px;
  text-align: center;
  height: 80px;
  min-height: 80px;
`;

// 감정 설명
export const emotionalLabelStyle = css`
  font-size: 32px;
  font-weight: 700;
  margin: 0;
  color: #f9f9f9;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
`;

export const descriptionStyle = css`
  font-size: 16px;
  font-weight: 400;
  margin: 0;
  color: rgba(250, 250, 250, 0.7);
  line-height: 1.5;
`;

// 안내 문구
export const guideTextStyle = css`
  font-size: 14px;
  font-weight: 500;
  color: rgba(249, 249, 249, 0.8);
  line-height: 1.6;
  margin-top: 8px;
  font-style: italic;
`;
