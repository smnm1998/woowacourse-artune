import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { IoArrowBack } from 'react-icons/io5';
import {
  ArtworkDisplay,
  PlaylistToggle,
  AlbumGrid,
  ActionButtons,
  MobilePlayerModal,
} from '@/components';
import useAppStore from '@/stores/useAppStore';
import {
  containerStyle,
  leftSectionStyle,
  rightSectionStyle,
  mobileMusicHeaderStyle,
  backButtonStyle,
  toggleWrapperStyle,
  actionButtonWrapperStyle,
  emptyStateStyle,
} from './ResultPage.styles';

/**
 * 감정 분석 결과 페이지
 *
 * - **PC (>1024px)**: 좌측 아트워크, 우측 플레이리스트가 나란히 배치됩니다.
 * - **Tablet/Mobile (<=1024px)**: 아트워크 뷰와 플레이리스트 뷰가 분리되어 전환됩니다.
 */
function ResultPage() {
  const emotionResult = useAppStore((state) => state.emotionResult);
  const [selectedMode, setSelectedMode] = useState('immerse');

  // 뷰 상태: 'artwork' | 'music'
  const [viewMode, setViewMode] = useState('artwork');

  // 1024px 이하를 Compact View(Tablet/Mobile)로 취급
  const [isCompactView, setIsCompactView] = useState(false);

  // 선택된 트랙 상태 (모바일 모달용)
  const [selectedTrack, setSelectedTrack] = useState(null);

  useEffect(() => {
    const checkCompact = () => setIsCompactView(window.innerWidth <= 1024);
    checkCompact();

    window.addEventListener('resize', checkCompact);
    return () => window.removeEventListener('resize', checkCompact);
  }, []);

  // 모바일 앨범 클릭 핸들러
  const handleTrackClick = (track) => {
    if (isCompactView) {
      setSelectedTrack(track);
    }
  };

  const closePlayerModal = () => {
    setSelectedTrack(null);
  };

  if (!emotionResult) return null;
  const currentPlaylist = emotionResult.playlists[selectedMode];
  const isEmpty =
    !currentPlaylist.tracks || currentPlaylist.tracks.length === 0;

  return (
    <motion.div
      css={containerStyle}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* 아트워크 섹션 
        - PC: 항상 표시
        - Compact View: viewMode가 'artwork'일 때만 표시 
      */}
      {(!isCompactView || viewMode === 'artwork') && (
        <div css={leftSectionStyle}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <ArtworkDisplay
              artwork={emotionResult.artwork}
              emotionLabel={emotionResult.emotionLabel}
              description={emotionResult.description}
            />
          </motion.div>

          {/* 하단 액션 버튼 그룹 */}
          <motion.div
            css={actionButtonWrapperStyle}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <ActionButtons
              // Compact View일 때만 '음악 보기' 버튼 활성화
              onNext={isCompactView ? () => setViewMode('music') : undefined}
            />
          </motion.div>
        </div>
      )}

      {/* 플레이리스트 섹션 
        - PC: 항상 표시
        - Compact View: viewMode가 'music'일 때만 표시 
      */}
      {(!isCompactView || viewMode === 'music') && (
        <div css={rightSectionStyle}>
          {/* 헤더 (뒤로가기 + 토글) */}
          <div css={mobileMusicHeaderStyle}>
            {/* Compact View 전용 뒤로가기 버튼 */}
            {isCompactView && (
              <button
                css={backButtonStyle}
                onClick={() => setViewMode('artwork')}
                aria-label="아트워크로 돌아가기"
              >
                <IoArrowBack size={24} />
              </button>
            )}

            {/* 플레이리스트 모드 토글 */}
            <div css={toggleWrapperStyle}>
              <PlaylistToggle
                selectedMode={selectedMode}
                onModeChange={setSelectedMode}
                immerseLabel={emotionResult.playlists.immerse.modeLabel}
                sootheLabel={emotionResult.playlists.soothe.modeLabel}
                // PC에서만 툴팁 표시 (터치 디바이스 방해 방지)
                immerseDescription={
                  !isCompactView
                    ? emotionResult.playlists.immerse.description
                    : undefined
                }
                sootheDescription={
                  !isCompactView
                    ? emotionResult.playlists.soothe.description
                    : undefined
                }
              />
            </div>
          </div>

          <motion.div
            key={selectedMode}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            style={{ width: '100%', flex: 1 }}
          >
            {isEmpty ? (
              <div css={emptyStateStyle}>
                <div className="empty-icon">🎵</div>
                <h3>플레이리스트를 찾을 수 없어요</h3>
                <p>
                  죄송합니다. 지금은 추천할 수 있는 음악이 없어요.
                  <br />
                  다른 감정을 입력하거나 잠시 후 다시 시도해주세요.
                </p>
              </div>
            ) : (
              <AlbumGrid
                tracks={currentPlaylist.tracks}
                onTrackClick={isCompactView ? handleTrackClick : undefined}
              />
            )}
          </motion.div>
        </div>
      )}

      {/* 모바일 플레이어 모달 */}
      <MobilePlayerModal
        isOpen={!!selectedTrack}
        onClose={closePlayerModal}
        track={selectedTrack}
      />
    </motion.div>
  );
}

export default ResultPage;
