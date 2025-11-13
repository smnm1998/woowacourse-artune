import { css } from '@emotion/react';
import { colors } from '@/styles/theme';

export const gridContainerStyle = css`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: repeat(5, 1fr);
  gap: 70px;
  width: 100%;
  max-width: 800px;

  box-shadow:
    0 8px 32px ${colors.shadow.light},
    inset 0 1px 0 ${colors.shadow.inset};

  > * {
    position: relative;
    aspect-ratio: 1;
  }
`;
