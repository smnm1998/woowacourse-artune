import { useState } from 'react';
import { motion } from 'framer-motion';
import ArtworkDisplay from '@/components/ArtworkDisplay';
import PlaylistToggle from '@/components/PlaylistToggle';
import AlbumGrid from '@/components/AlbumGrid';
import ActionButtons from '@/components/ActionButtons';
import {
  containerStyle,
  contentWrapperStyle,
  leftSectionStyle,
  rightSectionStyle,
} from './ResultPage.styles';

/**
 * 감정 분석 결과와 플레이리스트를 표시하는 페이지
 * @param {Object} emotionResult - API에서 받은 감정 분석 결과 전체 데이터
 * @param {string} emotionResult.emotionLabel - 감정 이름 (예: '기쁨', '슬픔')
 * @param {string} emotionResult.description - 감정 설명
 * @param {Object} emotionResult.artwork - DALL-E 생성 아트워크 정보
 * @param {string} emotionResult.artwork.url - 아트워크 이미지 URL
 * @param {Object} emotionResult.playlists - immerse/soothe 플레이리스트
 * @param {Object} emotionResult.playlists.immerse - 감정 심취 플레이리스트
 * @param {Object} emotionResult.playlists.soothe - 감정 완화 플레이리스트
 * @param {Array} emotionResult.playlists.immerse.tracks - 트랙 목록 (9개)
 * @param {Array} emotionResult.playlists.soothe.tracks - 트랙 목록 (9개)
 * @param {Function} onRestart - 다시하기 버튼 클릭 핸들러
 */
function ResultPage({ emotionResult, onRestart }) {
  // 현재 선택된 모드 (immerse | soothe)
  const [selectedMode, setSelectedMode] = useState('immerse');

  // 선택된 모드에 따른 현재 플레이리스트
  const currentPlaylist = emotionResult.playlists[selectedMode];

  // 스크린샷 저장 핸들러
  const handleScreenshot = () => {
    // TODO: html2canvas로 스크린샷 구현
    alert('스크린샷 기능은 추후 구현 예정입니다!');
  };

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
          <ActionButtons
            onScreenshot={handleScreenshot}
            onRestart={onRestart}
          />
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
