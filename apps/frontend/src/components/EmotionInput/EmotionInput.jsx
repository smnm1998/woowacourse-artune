import { IoSend } from 'react-icons/io5';
import useAutoResizeTextarea from '@/hooks/ui/useAutoResizeTextarea';
import {
  textareaContainerStyle,
  textareaStyle,
  sendButtonStyle,
} from './EmotionInput.styles';

/**
 * 감정 입력 컴포넌트
 * @param {string} value - textarea 값
 * @param {Function} onChange - textarea 변경 핸들러
 * @param {Function} onSubmit - 제출 핸들러
 * @param {string} placeholder - placeholder 텍스트
 */
function EmotionInput({ value, onChange, onSubmit, placeholder }) {
  const textareaRef = useAutoResizeTextarea(value);

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
    <div css={textareaContainerStyle}>
      <textarea
        ref={textareaRef}
        css={textareaStyle}
        value={value}
        onChange={onChange}
        onKeyDown={handleKeyDown}
        placeholder={
          placeholder || '오늘 어떤 일이 있었나요? 자유롭게 적어주세요...'
        }
        rows={1}
      />

      {/* Send Button - 단순 버튼으로 복구 */}
      <button
        css={sendButtonStyle}
        onClick={onSubmit}
        disabled={!value.trim()}
        aria-label="전송"
      >
        <IoSend />
      </button>
    </div>
  );
}

export default EmotionInput;
