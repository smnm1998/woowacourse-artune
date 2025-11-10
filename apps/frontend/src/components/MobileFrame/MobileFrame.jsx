import {
  frameContainerStyle,
  frameOuterStyle,
  notchStyle,
  screenStyle,
  homeIndicatorStyle,
} from './MobileFrame.styles';

function MobileFrame({ children }) {
  return (
    <div css={frameContainerStyle}>
      <div css={frameOuterStyle}>
        {/* 카메라 영역 */}
        <div css={notchStyle}></div>

        {/* 스크린 영역 */}
        <div css={screenStyle}>{children}</div>

        {/* 홈 인디케이터 */}
        <div css={homeIndicatorStyle} />
      </div>
    </div>
  );
}

export default MobileFrame;
