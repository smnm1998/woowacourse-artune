import { useState } from 'react';
import { EmotionInput } from '@/components';
import {
  containerStyle,
  titleWrapperStyle,
  titleStyle,
  subTitleStyle,
  inputWrapperStyle,
} from './EmotionInputPage.styles';
import useAppStore from '@/stores/useAppStore';

/**
 * 감정 입력 페이지
 * 사용자로부터 감정 텍스트를 입력받아 Zustand store의 analyzeEmotion을 호출
 */
function EmotionInputPage() {
  const analyzeEmotion = useAppStore((state) => state.analyzeEmotion);
  const [text, setText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleTextChange = (e) => {
    if (isSubmitting) return;
    setText(e.target.value);
  };

  const handleSubmit = async () => {
    if (!text.trim() || isSubmitting) return;

    setIsSubmitting(true);
    const textToSubmit = text;
    setText('');

    // Store에서 직접 호출
    await analyzeEmotion(textToSubmit);

    // 완료 후 submitting 상태 해제 (에러 발생도 포함)
    setIsSubmitting(false);
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
