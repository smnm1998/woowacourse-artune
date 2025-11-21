import { useState, useEffect } from 'react';
import { IoSend } from 'react-icons/io5';
import useAutoResizeTextarea from '@/hooks/ui/useAutoResizeTextarea';
import {
  textareaContainerStyle,
  textareaStyle,
  sendButtonStyle,
  sendButtonIconStyle,
  errorMessageStyle,
  inputWrapperStyle,
} from './EmotionInput.styles';

/**
 * 감정 입력 컴포넌트
 * @param {string} value - textarea 값
 * @param {Function} onChange - textarea 변경 핸들러
 * @param {Function} onSubmit - 제출 핸들러
 * @param {string} placeholder - placeholder 텍스트
 * @param {string} error - 에러 메시지
 * @param {number} minLength - 최소 길이
 * @param {number} maxLength - 최대 길이
 */
function EmotionInput({
  value,
  onChange,
  onSubmit,
  placeholder,
  error,
  minLength,
  maxLength,
}) {
  const [isMobile, setIsMobile] = useState(false);

  // 모바일 감지 (768px 이하)
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();

    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // 반응형 placeholder
  const getPlaceholder = () => {
    if (placeholder) return placeholder;
    return isMobile
      ? '오늘 어떤 일이 있었나요?'
      : '오늘 어떤 일이 있었나요? 자유롭게 적어주세요...';
  };

  const currentPlaceholder = getPlaceholder();
  const textareaRef = useAutoResizeTextarea(value, currentPlaceholder);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && e.shiftKey) {
      return;
    }
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSubmit();
    }
  };

  return (
    <div css={inputWrapperStyle}>
      <div css={textareaContainerStyle}>
        <textarea
          id="emotion-input"
          name="emotion"
          aria-label="감정 입력"
          aria-invalid={!!error}
          aria-describedby={error ? 'emotion-input-error' : undefined}
          ref={textareaRef}
          css={textareaStyle}
          value={value}
          onChange={onChange}
          onKeyDown={handleKeyDown}
          placeholder={currentPlaceholder}
          rows={1}
        />

        {/* Send Button */}
        <button
          css={sendButtonStyle}
          onClick={onSubmit}
          disabled={!value.trim()}
          aria-label="전송"
        >
          <IoSend css={sendButtonIconStyle} />
        </button>
      </div>

      {/* 에러 메시지 */}
      {error && (
        <p id="emotion-input-error" css={errorMessageStyle} role="alert">
          {error}
        </p>
      )}

      {/* 글자 수 표시 */}
      {maxLength && (
        <p css={errorMessageStyle} style={{ color: 'rgba(255,255,255,0.5)' }}>
          {value.length} / {maxLength}자
        </p>
      )}
    </div>
  );
}

export default EmotionInput;
