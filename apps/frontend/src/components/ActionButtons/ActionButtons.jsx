import { IoRefresh } from 'react-icons/io5';
import {
  containerStyle,
  buttonStyle,
  iconWrapperStyle,
  buttonTextStyle,
} from './ActionButtons.styles';
import useAppStore from '@/stores/useAppStore';

/**
 * 결과 페이지 하단 액션 버튼
 * - 다시하기: 처음 감정 입력 페이지로 돌아가기
 *
 * Zustand store의 reset을 직접 호출
 */
function ActionButtons() {
  const reset = useAppStore((state) => state.reset);

  // 다시하기 핸들러
  const handleRestart = () => {
    if (window.confirm('처음부터 다시 시작하시겠습니까?')) {
      reset();
    }
  };

  return (
    <div css={containerStyle}>
      {/* 다시하기 */}
      <button css={buttonStyle} onClick={handleRestart}>
        <div css={iconWrapperStyle}>
          <IoRefresh size={20} />
        </div>
        <span css={buttonTextStyle}>다시하기</span>
      </button>
    </div>
  );
}

export default ActionButtons;
