import { css } from '@emotion/react';

export const cardContainerStyle = css`
  display: flex;
  flex-direction: column;
  gap: 12px;
  cursor: pointer;
  position: relative;
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
  background:
    conic-gradient(
      from 45deg,
      #e0e0e0 0deg,
      #ffd4ff 60deg,
      #d4f4ff 120deg,
      #fff4d4 180deg,
      #ffd4d4 240deg,
      #d4ffe4 300deg,
      #e0e0e0 360deg
    ),
    radial-gradient(
      circle,
      rgba(255, 255, 255, 0.3) 0%,
      rgba(200, 200, 200, 0.5) 50%,
      rgba(150, 150, 150, 0.7) 100%
    );
  background-blend-mode: overlay;

  border-radius: 50%;
  border: 1px solid rgba(255, 255, 255, 0.5);

  box-shadow:
    0 6px 20px rgba(0, 0, 0, 0.4),
    inset 0 0 50px rgba(255, 255, 255, 0.15);

  transform: rotate(-20deg);
  z-index: 0;

  // 회전 시 무지개 효과 강조
  transition: filter 0.3s ease;
`;

// CD 중앙 홀
export const vinylCenterStyle = css`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 20%;
  height: 20%;

  background: radial-gradient(
    circle,
    rgba(40, 40, 40, 0.9) 0%,
    rgba(80, 80, 80, 0.7) 40%,
    rgba(140, 140, 140, 0.5) 100%
  );
  border-radius: 50%;
  border: 2px solid rgba(200, 200, 200, 0.6);

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
    0 8px 16px rgba(0, 0, 0, 0.4),
    0 4px 8px rgba(0, 0, 0, 0.3);
  z-index: 1;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }
`;

// 앨범 이름
export const albumNameStyle = css`
  font-size: 14px;
  font-weight: 600;
  color: #f9f9f9;
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
  color: #b0b0b0;
  line-height: 1.3;

  // 1줄 넘어가면 생략
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;
