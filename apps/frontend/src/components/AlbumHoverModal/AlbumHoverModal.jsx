import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IoPlayCircle } from 'react-icons/io5';
import {
  modalOverlayStyle,
  modalContentStyle,
  albumInfoStyle,
  albumTitleStyle,
  artistNameStyle,
  trackNameStyle,
  playingIndicatorStyle,
} from './AlbumHoverModal.styles';

/**
 * 앨범 호버 시 나타나는 모달
 * - 앨범 상세 정보 표시
 * - 대표 트랙 30초 미리듣기 자동 재생
 * - 호버 해제 시 닫히면서 재생 중지
 *
 * @param {boolean} isOpen - 모달 표시 여부
 * @param {Object} album - Spotify 트랙 객체
 * @param {string} album.name - 트랙 이름 (대표곡)
 * @param {Array} album.artists - 아티스트 배열
 * @param {Object} album.info - 앨범 정보
 * @param {string} album.album.name - 앨범 이름
 * @param {string} album.preview_url - 30초 미리듣기 URL
 */
function AlbumHoverModal({ isOpen, album }) {
  // Audio element
  const audioRef = useRef(null);

  // isOpen state 변경 감지 -> 재생/정지
  useEffect(() => {
    if (!audioRef.current) return;

    if (isOpen && album.preview_url) {
      // 모달 오픈 + URL 있으면 재생
      audioRef.current.play().catch((error) => {
        console.error('오디오 재생 실패: ', error);
      });
    } else {
      // 모달 닫힘 -> 정지 + 초기화
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }

    // 컴포넌트 언마운트 시 정지
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    };
  }, [isOpen, album.preview_url]);

  // 아티스트명 합치기
  const artistNames = album.artists.map((artist) => artist.name).join(', ');

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          css={modalOverlayStyle}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {/* 모달 콘텐츠 */}
          <div css={modalContentStyle}>
            {/* 앨범 정보 */}
            <div css={albumInfoStyle}>
              <p css={albumTitleStyle}>{album.album.name}</p>
              <p css={artistNameStyle}>{artistNames}</p>
              <p css={trackNameStyle}>대표곡: {album.name}</p>
            </div>

            {/* 재생 중 표시 */}
            <div css={playingIndicatorStyle}>
              <IoPlayCircle size={24} />
              <span>30초 미리듣기 재생 중...</span>
            </div>
          </div>

          <audio ref={audioRef} src={album.preview_url} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default AlbumHoverModal;
