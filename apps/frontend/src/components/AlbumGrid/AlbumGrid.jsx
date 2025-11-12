import { motion } from 'framer-motion';
import { useHover } from '@/hooks';
import AlbumCard from '@/components/AlbumCard';
import AlbumHoverModal from '@/components/AlbumHoverModal';
import { gridContainerStyle } from './AlbumGrid.styles';

/**
 * 앨범 그리드 컴포넌트
 * - 3x3 그리드로 9개의 앨범을 표시
 * - 각 앨범 호버 시 상세 정보와 미리듣기 제공
 *
 * @param {Array} tracks - Spotify Track Array (9개)
 * @param {string} tracks[].id - 트랙 고유 ID
 * @param {string} tracks[].name - 트랙 이름
 * @param {Array} tracks[].artists - 아티스트 배열
 * @param {Object} tracks[].album - 앨범 정보
 * @param {string} tracks[].preview_url -30초 미리듣기 url
 */
function AlbumGrid({ tracks }) {
  const { handleMouseEnter, handleMouseLeave, isHovered } = useHover();

  return (
    <div css={gridContainerStyle}>
      {tracks.map((track, index) => (
        // 각 앨범 카드를 motion.div로 감싸서 staggered 애니메이션
        <motion.div
          key={track.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          onMouseEnter={() => handleMouseEnter(track.id)}
          onMouseLeave={handleMouseLeave}
          transition={{
            delay: index * 0.1,
            duration: 0.5,
          }}
        >
          <AlbumCard
            album={track}
            isHovered={isHovered(track.id)} // 현재 카드가 호버되었는지
          />

          {/* 호버 모달 (AlbumCard 내부에서 absolute 위치) */}
          <AlbumHoverModal isOpen={isHovered(track.id)} album={track} />
        </motion.div>
      ))}
    </div>
  );
}

export default AlbumGrid;
