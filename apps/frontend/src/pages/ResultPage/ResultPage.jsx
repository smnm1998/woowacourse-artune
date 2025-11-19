import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ArtworkDisplay,
  PlaylistToggle,
  AlbumGrid,
  ActionButtons,
} from '@/components';
import useAppStore from '@/stores/useAppStore';
import {
  containerStyle,
  leftSectionStyle,
  rightSectionStyle,
} from './ResultPage.styles';

/**
 * 감정 분석 결과와 플레이리스트를 표시하는 페이지
 * Zustand store에서 감정 분석 결과를 직접 가져와 표시
 */
function ResultPage() {
  // Store에서 필요한 상태 가져오기
  const emotionResult = useAppStore((state) => state.emotionResult);

  // 현재 선택된 모드 (immerse | soothe)
  const [selectedMode, setSelectedMode] = useState('immerse');

  // 선택된 모드에 따른 현재 플레이리스트
  const currentPlaylist = emotionResult?.playlists[selectedMode];

  // emotionResult가 없으면 렌더링하지 않음
  if (!emotionResult) return null;

  return (
    <motion.div
      css={containerStyle}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      data-screenshot-target
    >
      {/* 왼쪽 */}
      <div css={leftSectionStyle}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <ArtworkDisplay
            artwork={emotionResult.artwork}
            emotionLabel={emotionResult.emotionLabel}
            description={emotionResult.description}
          />
        </motion.div>

        {/* 액션 버튼 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <ActionButtons />
        </motion.div>
      </div>

      {/* 오른쪽 */}
      <div css={rightSectionStyle}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          style={{ width: '100%', display: 'flex', justifyContent: 'center' }}
        >
          <PlaylistToggle
            selectedMode={selectedMode}
            onModeChange={setSelectedMode}
            immerseLabel={emotionResult.playlists.immerse.modeLabel}
            sootheLabel={emotionResult.playlists.soothe.modeLabel}
            immerseDescription={emotionResult.playlists.immerse.description}
            sootheDescription={emotionResult.playlists.soothe.description}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          <AlbumGrid tracks={currentPlaylist.tracks} />
        </motion.div>
      </div>
    </motion.div>
  );
}

export default ResultPage;
