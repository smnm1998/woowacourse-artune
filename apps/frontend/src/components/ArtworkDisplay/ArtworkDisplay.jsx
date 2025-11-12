import {
  artworkContainerStyle,
  artworkWrapperStyle,
  artworkImageStyle,
  artworkInfoStyle,
  emotionalLabelStyle,
  descriptionStyle,
  guideTextStyle,
} from './ArtworkDisplay.styles';

function ArtworkDisplay({ artwork, emotionLabel, description }) {
  return (
    <div css={artworkContainerStyle}>
      <div css={artworkWrapperStyle}>
        <img
          src={artwork.url}
          alt={`${emotionLabel} 감정 아트워크`}
          css={artworkImageStyle}
        />
      </div>

      {/* 감정 정보 */}
      <div css={artworkInfoStyle}>
        <h2 css={emotionalLabelStyle}>{emotionLabel}</h2>
        <p css={descriptionStyle}>{description}</p>
        <p css={guideTextStyle}>
          이런 날에는 아트워크의 디저트와 함께 노래를 감상해보세요!
        </p>
      </div>
    </div>
  );
}

export default ArtworkDisplay;
