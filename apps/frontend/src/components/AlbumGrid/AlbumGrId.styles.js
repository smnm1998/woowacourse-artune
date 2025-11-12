import { css } from '@emotion/react';

export const gridContainerStyle = css`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: repeat(5, 1fr);
  gap: 70px;
  width: 100%;
  max-width: 800px;

  box-shadow:
    0 8px 32px rgba(0, 0, 0, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.05);

  > * {
    position: relative;
    aspect-ratio: 1;
  }
`;
