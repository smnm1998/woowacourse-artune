import { css } from '@emotion/react';
import { colors } from '@/styles/theme';

export const cardContainerStyle = css`
  display: flex;
  flex-direction: column;
  gap: 12px;
  cursor: pointer;
  position: relative;
  width: 100%;
  height: 100%;
`;

// CD + 디스크 wrapper
export const albumWrapperStyle = css`
  position: relative;
  width: 100%;
  aspect-ratio: 1; // 정사각형 비율 유지
  overflow: visible; // LP판 노출
`;

// CD 디스크
export const vinylDiscStyle = css`
  position: absolute;
  top: 0;
  left: 15%;
  width: 100%;
  height: 100%;

  // 홀로그램 효과
  background: ${colors.gradients.hologram}, ${colors.gradients.vinylReflection};
  background-blend-mode: overlay;

  border-radius: 50%;
  border: 1px solid ${colors.border.vinyl};

  box-shadow:
    0 6px 20px ${colors.shadow.medium},
    inset 0 0 50px ${colors.shadow.inset};

  transform: rotate(-20deg);
  z-index: 0;

  // 회전 시 무지개 효과 강조
  transition: filter 0.3s ease;

  // hover 방지
  pointer-events: none;
`;

// CD 중앙 홀
export const vinylCenterStyle = css`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 20%;
  height: 20%;

  background: ${colors.gradients.vinylCenter};
  border-radius: 50%;
  border: 2px solid ${colors.border.vinylCenter};

  box-shadow:
    inset 0 2px 8px rgba(0, 0, 0, 0.8),
    0 0 12px rgba(255, 255, 255, 0.3),
    0 0 20px rgba(200, 220, 255, 0.2);
`;

// 앨범 커버
export const albumCoverStyle = css`
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: 8px;
  overflow: hidden;
  box-shadow:
    0 8px 16px ${colors.shadow.medium},
    0 4px 8px ${colors.shadow.light};
  z-index: 1;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    background: ${colors.background.glass.subtle};
  }
`;

// 앨범 이름
export const albumNameStyle = css`
  font-size: 14px;
  font-weight: 600;
  color: ${colors.text.primary};
  line-height: 1.4;

  // 2줄 넘어가면 생략
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
`;

// 아티스트 이름
export const artistNameStyle = css`
  font-size: 12px;
  font-weight: 400;
  color: ${colors.text.secondary};
  line-height: 1.3;

  // 1줄 넘어가면 생략
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;
