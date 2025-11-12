import { css } from '@emotion/react';

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

export const contentWrapperStyle = css`
  display: flex;
  margin: 0 auto;
  gap: 60px; // 좌우 간격
  align-items: flex-start;
`;

// 왼쪽 섹션 (아트워크 + 액션버튼) - 글래스모피즘 + 고정
export const leftSectionStyle = css`
  flex: 0 0 480px; // 고정 너비
  display: flex;
  flex-direction: column;
  gap: 24px;

  // 글래스모피즘 효과
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 24px;
  padding: 32px;

  // 입체감
  box-shadow:
    0 8px 32px rgba(0, 0, 0, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.05);

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

// 하단 액션 버튼 영역
export const actionSectionStyle = css`
  width: 100%;
  max-width: 1200px;
  margin-top: 40px;
`;
