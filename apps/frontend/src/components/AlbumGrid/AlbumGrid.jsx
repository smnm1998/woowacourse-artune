import { useRef } from 'react';
import { motion } from 'framer-motion';
import { useHover } from '@/hooks';
import { AlbumCard, AlbumHoverModal } from '@/components';
import { gridContainerStyle } from './AlbumGrid.styles';

/**
 * 앨범 그리드 컴포넌트
 * * - **PC**: 마우스 오버(Hover) 시 미리듣기 재생
 * - **Tablet/Mobile**: 롱프레스(200ms 이상 터치) 시 미리듣기 재생
 */
function AlbumGrid({ tracks }) {
  const { handleMouseEnter, handleMouseLeave, isHovered } = useHover();

  // 롱프레스 타이머 저장을 위한 Ref
  const longPressTimerRef = useRef(null);

  // 터치 시작 (롱프레스 감지)
  const handleTouchStart = (id) => {
    longPressTimerRef.current = setTimeout(() => {
      handleMouseEnter(id);
      // 햅틱 피드백 (지원 기기만)
      if (navigator.vibrate) navigator.vibrate(10);
    }, 200);
  };

  // 터치 종료/이동/취소 시 재생 중단
  const stopTouchInteraction = () => {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
    handleMouseLeave();
  };

  return (
    <div css={gridContainerStyle}>
      {tracks.map((track, index) => (
        <motion.div
          key={track.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05, duration: 0.4 }}
          // [PC] Hover Interaction
          onMouseEnter={() => handleMouseEnter(track.id)}
          onMouseLeave={handleMouseLeave}
          // [Mobile/Tablet] Long Press Interaction
          onTouchStart={() => handleTouchStart(track.id)}
          onTouchEnd={stopTouchInteraction}
          onTouchCancel={stopTouchInteraction}
          onTouchMove={stopTouchInteraction} // 스크롤 시 중단
          onContextMenu={(e) => e.preventDefault()} // 롱프레스 메뉴 방지
          style={{
            position: 'relative',
            touchAction: 'pan-y', // 세로 스크롤만 허용하고 터치 액션은 직접 처리
            cursor: 'pointer',
            userSelect: 'none',
            WebkitUserSelect: 'none',
          }}
        >
          <AlbumCard album={track} isHovered={isHovered(track.id)} />
          <AlbumHoverModal isOpen={isHovered(track.id)} album={track} />
        </motion.div>
      ))}
    </div>
  );
}

export default AlbumGrid;
