import { IoShareSocial, IoRefresh } from 'react-icons/io5';
import {
  containerStyle,
  buttonStyle,
  iconWrapperStyle,
  buttonTextStyle,
} from './ActionButtons.styles';

/**
 * 결과 페이지 하단 액션 버튼
 * - 공유하기: 현재 페이지를 이미지로 캡쳐하여 다운로드
 * - 다시하기: 처음 감정 입력 페이지로 돌아가기
 *
 * @param {Function} onShare - 스크린샷 저장 클릭 핸들러
 * @param {Function} onRestart - 다시하기 클릭 핸들러
 */
function ActionButtons({ onShare, onRestart }) {
  // 공유하기 (스크린샷 저장 핸들러)
  const handleShareScreenShot = () => {
    // TODO: 스크린샷 캡쳐 후 다운로드 기능까지 구현할 것 (html2canvas)

    if (onShare) {
      onShare();
    } else {
      alert('스크린 샷 기능은 아직 구현 중입니다!');
    }
  };

  // 다시하기 핸들러
  const handleRestart = () => {
    if (window.confirm('처음부터 다시 시작하시겠습니까?')) {
      onRestart();
    }
  };

  return (
    <div css={containerStyle}>
      {/* 공유하기 (스크린 샷 저장) */}
      <button css={buttonStyle} onClick={handleShareScreenShot}>
        <div css={iconWrapperStyle}>
          <IoShareSocial size={20} />
        </div>
        <span css={buttonTextStyle}>공유하기</span>
      </button>

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
