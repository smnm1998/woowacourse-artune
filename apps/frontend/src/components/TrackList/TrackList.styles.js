import { css } from '@emotion/react';
import { colors } from '@/styles/theme';

// 트랙 리스트 컨테이너
export const trackListContainerStyle = css`
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 20px;
`;

// 트랙 아이템
export const trackItemStyle = css`
  position: relative;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: ${colors.background.glass.subtle};
  backdrop-filter: blur(10px);
  border: 1px solid ${colors.border.light};
  border-radius: 12px;
  transition: all 0.2s ease;
  overflow: hidden;

  &:hover {
    background: rgba(255, 255, 255, 0.08);
    border-color: rgba(255, 255, 255, 0.15);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px ${colors.shadow.subtle};
  }
`;

// 앨범 커버
export const albumCoverStyle = css`
  flex-shrink: 0;
  width: 56px;
  height: 56px;
  border-radius: 8px;
  overflow: hidden;
  background: ${colors.background.glass.subtle};
  display: flex;
  align-items: center;
  justify-content: center;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

// 트랙 정보
export const trackInfoStyle = css`
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

// 트랙 제목
export const trackNameStyle = css`
  margin: 0;
  font-size: 14px;
  font-weight: 600;
  color: ${colors.text.primary};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

// 아티스트 이름
export const artistNameStyle = css`
  margin: 0;
  font-size: 12px;
  font-weight: 400;
  color: rgba(249, 249, 249, 0.6);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

// 액션 버튼 영역
export const trackActionsStyle = css`
  display: flex;
  align-items: center;
  gap: 8px;
`;

// 재생 시간
export const durationStyle = css`
  font-size: 12px;
  color: ${colors.text.placeholder};
  font-weight: 500;
`;

// 재생/일시정지 버튼
export const playButtonStyle = css`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background: ${colors.accent.primary.base};
  backdrop-filter: blur(10px);
  border: 1px solid ${colors.accent.primary.border};
  border-radius: 50%;
  color: ${colors.text.primary};
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    background: rgba(69, 234, 69, 0.5);
    transform: scale(1.1);
  }

  &:active:not(:disabled) {
    transform: scale(0.95);
  }

  &:disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }
`;

// 스포티파이 링크
export const spotifyLinkStyle = css`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background: rgba(30, 215, 96, 0.2);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(30, 215, 96, 0.3);
  border-radius: 50%;
  color: #1ed760;
  cursor: pointer;
  text-decoration: none;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(30, 215, 96, 0.3);
    transform: scale(1.1);
  }

  &:active {
    transform: scale(0.95);
  }
`;

// 재생 중 인디케이터 (좌측 바)
export const playingIndicatorStyle = css`
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 3px;
  background: linear-gradient(180deg, #45ea45 0%, #2d5f2d 100%);
  animation: pulse 1.5s ease-in-out infinite;

  @keyframes pulse {
    0%,
    100% {
      opacity: 1;
    }
    50% {
      opacity: 0.5;
    }
  }
`;
