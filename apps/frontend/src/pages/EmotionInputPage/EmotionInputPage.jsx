import { useState } from 'react';
import EmotionInput from '@/components/EmotionInput';
import {
  containerStyle,
  titleWrapperStyle,
  titleStyle,
  subTitleStyle,
  inputWrapperStyle,
} from './EmotionInputPage.styles';

function EmotionInputPage({ onNext }) {
  const [text, setText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleTextChange = (e) => {
    if (isSubmitting) return;
    setText(e.target.value);
  };

  const handleSubmit = () => {
    if (!text.trim() || isSubmitting) return;

    setIsSubmitting(true);
    const textToSubmit = text;
    setText('');

    // TODO: 감정 분석 API 호출
    // TODO: 결과 페이지로 이동
    if (onNext) {
      onNext(textToSubmit);
    }
  };

  return (
    <div css={containerStyle}>
      <div css={titleWrapperStyle}>
        <h1 css={titleStyle}>안녕하세요!</h1>
        <p css={subTitleStyle}>오늘의 감정을 들려주세요.</p>
      </div>

      <div css={inputWrapperStyle}>
        <EmotionInput
          value={text}
          onChange={handleTextChange}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
}

export default EmotionInputPage;
