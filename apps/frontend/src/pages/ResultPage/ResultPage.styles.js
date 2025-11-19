import { css } from '@emotion/react';
import { colors } from '@/styles/theme';

export const containerStyle = css`
  display: flex;
  min-height: 100vh;
  max-width: 1600px;
  margin: 0 auto;
  background: transparent;
  padding: 40px;
  gap: 80px;
  align-items: flex-start;
`;

// 왼쪽 섹션 (아트워크 + 액션버튼) - 글래스모피즘 + 고정
export const leftSectionStyle = css`
  flex: 0 0 480px; // 고정 너비
  display: flex;
  flex-direction: column;
  gap: 24px;

  // 글래스모피즘 효과
  background: ${colors.background.glass.subtle};
  backdrop-filter: blur(20px);
  border: 1px solid ${colors.border.light};
  border-radius: 24px;
  padding: 32px;

  // 입체감
  box-shadow:
    0 8px 32px ${colors.shadow.light},
    inset 0 1px 0 ${colors.shadow.inset};

  // 고정
  position: sticky;
  top: 40px;
  height: fit-content;
  align-self: start;
`;

// 오른쪽 섹션 (토글 + 앨범 그리드) - 중앙 정렬
export const rightSectionStyle = css`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 40px;
  align-items: center;
  width: 100%;
  max-width: 900px; // 최대 너비 지정
  margin: 0 auto; // 중앙 정렬
  min-height: 100vh;
  padding-bottom: 60px;
`;
