import { css } from '@emotion/react';

export const gridContainerStyle = css`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-auto-rows: auto;
  gap: 70px;
  width: 100%;
  max-width: 800px;

  > * {
    position: relative;
    aspect-ratio: 1;
    width: 100%;
  }
`;
