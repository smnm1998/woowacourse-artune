import { css } from '@emotion/react';
import { colors } from '@/styles/theme';

export const toastContainer = css`
  position: fixed;
  top: 24px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 12px;
  background: ${colors.error.color};
  color: ${colors.error.textColor};
  box-shadow: 0 8px 24px ${colors.shadow.light};
  padding: 16px 20px;
  border-radius: 12px;
  min-width: 320px;
  max-width: 500px;
  z-index: 99;
`;

export const iconWrapper = css`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

export const messageWrapper = css`
  flex: 1;
`;

export const message = css`
  margin: 0;
  font-size: 14px;
  line-height: 1.5;
  font-weight: 500;
`;

export const actionsWrapper = css`
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
`;

export const retryButton = css`
  background: ${colors.background.glass.mediumHeavy};
  color: ${colors.error.textColor};
  border: 1px solid ${colors.border.hover};
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s

  &:hover {
    background: ${colors.background.glass.heavy};
  }

  &:active {
    transform: scale(0.95);
  }
`;

export const closeButton = css`
  background: transparent;
  color: ${colors.error.textColor};
  border: none;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border-radius: 4px;
  transition: all 0.2s;

  &:hover {
    background: ${colors.background.glass.heavy};
  }

  &:active {
    transform: scale(0.9);
  }
`;
