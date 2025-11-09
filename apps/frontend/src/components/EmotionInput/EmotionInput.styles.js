import { css } from '@emotion/react';

export const containerStyle = css`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 20px;
  gap: 24px;
  background: linear-gradient(135deg, #000f00 0%, #0d0d0d 100%);
`;

export const titleWrapperStyle = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  text-align: center;
`;

export const titleStyle = css`
  font-size: 50px;
  font-weight: 700;
  margin: 0;
  color: #f9f9f9;
`;

export const subTitleStyle = css`
  font-size: 26px;
  font-weight: 700;
  color: #f9f9f9;
  opacity: 0.6;
`;

export const inputWrapperStyle = css`
  position: relative;
  width: 100%;
  max-width: 1000px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  box-shadow: 0 0 10px rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.18);
`;

export const textareaContainerStyle = css`
  position: relative;
  display: flex;
  align-items: flex-end;
  gap: 12px;
`;

export const textareaStyle = css`
  background: none;
  border: none;
  flex: 1;
  min-height: 57px;
  max-height: 200px;
  padding: 16px;
  font-size: 20px;
  color: #f9f9f9;
  border-radius: 12px;
  resize: none;
  transition: all 0.3s ease;
  overflow-y: auto;
  caret-color: #f9f9f9;

  &:focus {
    outline: none;
    background: none;
    border: none;
  }

  &:hover {
    background: none;
    border: none;
  }

  &::placeholder {
    color: rgba(249, 249, 249, 0.5);
  }

  /* 스크롤바 스타일링 */
  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
    border-radius: 10px;
    margin: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.2);
    border-radius: 10px;
    backdrop-filter: blur(5px);
    -webkit-backdrop-filter: blur(5px);
  }

  &::-webkit-scrollbar-thumb:hover {
    background: rgba(255, 255, 255, 0.3);
  }
`;

export const sendButtonStyle = css`
  width: 57px;
  height: 57px;
  min-width: 57px;
  border-radius: 50px;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: all 0.3s ease;
  font-size: 24px;
  color: #f9f9f9;
  background: rgba(255, 255, 255, 0.1);
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.18);

  &:hover:not(:disabled) {
    background: rgba(102, 126, 234, 0.3);
    border: 1px solid rgba(102, 126, 234, 0.4);
    transform: translateY(-2px);
    box-shadow: 0 12px 24px rgba(102, 126, 234, 0.2);
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }

  &:disabled {
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    color: rgba(249, 249, 249, 0.3);
    cursor: not-allowed;
    transform: none;
  }
`;

export const hintStyle = css`
  font-size: 12px;
  color: rgba(249, 249, 249, 0.6);
  text-align: right;
  margin: 0;
`;
