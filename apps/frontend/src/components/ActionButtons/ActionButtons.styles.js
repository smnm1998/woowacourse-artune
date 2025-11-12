import { css } from '@emotion/react';

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
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  color: #f9f9f9;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    backgorund: rgba(255, 255, 255, 0.15);
    border-color: rgba(255, 255, 255, 0.3);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
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
  color: #2d5f2d;
`;

// 버튼 텍스트
export const buttonTextStyle = css`
  line-height: 1;
`;
