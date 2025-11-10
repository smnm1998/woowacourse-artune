import { useEffect, useRef } from 'react';

/**
 * textarea의 높이를 내용에 맞게 자동으로 조절하는 훅
 * @param {string} value - textarea의 값 (의존성)
 * @returns {React.RefObject} textarea에 연결한 ref
 */
function useAuthResizeTextarea(value) {
  const textareaRef = useRef(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [value]);

  return textareaRef;
}

export default useAuthResizeTextarea;
