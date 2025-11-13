import { css } from '@emotion/react';
import { colors } from '@/styles/theme';

export const containerStyle = css`
  display: flex;
  gap: 16px;
  justify-content: center;
  align-items: center;
  margin-top: 40px;
  padding: 20px 0;
`;

// 버튼 공통 스타일
export const buttonStyle = css`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  background: ${colors.background.glass.light};
  border: 1px solid ${colors.border.strong};
  border-radius: 12px;
  color: ${colors.text.primary};
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    backgorund: ${colors.background.glass.medium};
    border-color: ${colors.border.hover};
    transform: translateY(-2px);
    box-shadow: 0 4px 12px ${colors.shadow.light};
  }

  // 클릭 효과
  &:active {
    transform: translateY(0);
  }
`;

// 아이콘 래퍼
export const iconWrapperStyle = css`
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${colors.accent.green};
`;

// 버튼 텍스트
export const buttonTextStyle = css`
  line-height: 1;
`;
