import { useState, useRef, useEffect } from 'react';
import { IoSend } from 'react-icons/io5';
import {
  containerStyle,
  titleWrapperStyle,
  titleStyle,
  subTitleStyle,
  inputWrapperStyle,
  textareaContainerStyle,
  textareaStyle,
  sendButtonStyle,
} from './EmotionInput.styles';

function EmotionInput() {
  const [text, setText] = useState('');
  const textareaRef = useRef(null);

  const handleTextChange = (e) => {
    setText(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && e.shiftKey) {
      return;
    }

    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleSubmit = () => {
    if (!test.trim()) return;
    console.log('제출된 텍스트:', text);
    // TODO: 감정 분석 API 호출
    setText('');
  };

  // textarea 높이 자동 조절
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [text]);

  return (
    <div css={containerStyle}>
      <div css={titleWrapperStyle}>
        <h1 css={titleStyle}>안녕하세요!</h1>
        <p css={subTitleStyle}>오늘의 감정을 들려주세요</p>
      </div>
      <div css={inputWrapperStyle}>
        <div css={textareaContainerStyle}>
          <textarea
            ref={textareaRef}
            css={textareaStyle}
            value={text}
            onChange={handleTextChange}
            onKeyDown={handleKeyDown}
            placeholder="오늘 어떤 일이 있었나요? 자유롭게 적어주세요..."
            rows={1}
          />
          <button
            css={sendButtonStyle}
            onClick={handleSubmit}
            disabled={!text.trim()}
            aria-label="전송"
          >
            <IoSend />
          </button>
        </div>
      </div>
    </div>
  );
}

export default EmotionInput;
