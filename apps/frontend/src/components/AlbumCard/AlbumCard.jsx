import { motion } from 'framer-motion';
import {
  cardContainerStyle,
  albumWrapperStyle,
  vinylDiscStyle,
  vinylCenterStyle,
  albumCoverStyle,
} from './AlbumCard.styles';

/**
 * LP 앨범 카드 컴포넌트
 * - LP 표지 & 살짝 나온 LP판 표시
 * - 호버 시 앨범 정보 & 미리듣기 모달 표시
 *
 * @param {Object} album - Spotify 트랙 객체에서 추출한 앨범 정보
 * @param {string} album.id - 트랙 고유 ID
 * @param {string} album.name - 앨범명
 * @param {Array} album.artists - 아티스트 배열 [{ name: string }]
 * @param {Object} album.info - 앨범 상세 정보
 * @param {Array} album.album.images - 앨범 커버 이미지 배열
 * @param {string} album.preview_url - 30초 미리듣기 URL
 * @param {boolean} isHovered - 현재 호버 상태 (부모에서 관리)
 * @param {Function} onMouseEnter - 마우스 진입 핸들러
 * @param {Function} onMouseLeave - 마우스 이탈 핸들러
 */
function AlbumCard({ album, isHovered }) {
  // 앨범 커버 이미지 URL (첫 번째 이미지 사용)
  const coverUrl = album.album.images[0]?.url || '';

  // 아티스트명 합치기 (여러 명일 경우 쉼표 구분)
  const artistNames = album.artists.map((artists) => artists.name).join(', ');

  // 이미지 로딩 에러 디버깅
  if (!coverUrl || !album.album.images || album.album.images.length === 0) {
    console.warn('⚠️ 이미지 없음:', {
      trackName: album.name,
      artist: artistNames,
      images: album.album.images,
    });
  }

  // 이미지 로드 에러 핸들러
  const handleImageError = (e) => {
    console.error('❌ 이미지 로드 실패:', {
      trackName: album.name,
      artist: artistNames,
      imageUrl: coverUrl,
    });
    e.target.style.display = 'none';
  };

  return (
    <div css={cardContainerStyle}>
      <div css={albumWrapperStyle}>
        {/* CD 앨범 + CD 디스크 영역 */}
        <motion.div
          css={vinylDiscStyle}
          animate={{
            left: isHovered ? 0 : '15%',
          }}
          transition={{
            duration: 0.3, // 0.3초에 이동
            ease: 'easeOut', // 부드럽게 감속
          }}
        >
          {/* CD 중앙 디테일 */}
          <div css={vinylCenterStyle} />
        </motion.div>

        {/* 앨범 커버 */}
        <motion.div
          css={albumCoverStyle}
          whileHover={{ scale: 1.05 }} // 확대
          transition={{ duration: 0.3 }}
        >
          {coverUrl ? (
            <img
              src={coverUrl}
              alt={album.name}
              onError={handleImageError}
              loading="lazy"
            />
          ) : (
            <div
              style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'rgba(255, 255, 255, 0.1)',
                color: 'rgba(255, 255, 255, 0.5)',
                fontSize: '12px',
              }}
            >
              No Image
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}

export default AlbumCard;
