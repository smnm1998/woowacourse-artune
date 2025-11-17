import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IoPlayCircle, IoWarning } from 'react-icons/io5';
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
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioError, setAudioError] = useState(null);

  // isOpen state 변경 감지 -> 재생/정지
  useEffect(() => {
    // DOM 렌더링을 기다림
    const timer = setTimeout(() => {
      const audio = audioRef.current;
      if (!audio) {
        return;
      }

      if (isOpen && album.preview_url) {
        // audio 요소가 로드될 때까지 기다림
        const handleCanPlay = () => {
          audio
            .play()
            .then(() => {
              setIsPlaying(true);
              setAudioError(null);
            })
            .catch((error) => {
              console.error('❌ 재생 실패:', error);
              setIsPlaying(false);
              setAudioError(error.message);
            });
        };

        const handleError = (e) => {
          console.error('❌ Audio 로드 에러:', e);
          setIsPlaying(false);
          setAudioError('오디오 로드 실패');
        };

        const handlePlay = () => {
          setIsPlaying(true);
        };

        const handlePause = () => {
          setIsPlaying(false);
        };

        // 이벤트 리스너 등록
        audio.addEventListener('canplay', handleCanPlay);
        audio.addEventListener('error', handleError);
        audio.addEventListener('play', handlePlay);
        audio.addEventListener('pause', handlePause);

        // 이미 로드된 경우 바로 재생
        if (audio.readyState >= 3) {
          handleCanPlay();
        }

        return () => {
          audio.removeEventListener('canplay', handleCanPlay);
          audio.removeEventListener('error', handleError);
          audio.removeEventListener('play', handlePlay);
          audio.removeEventListener('pause', handlePause);
        };
      } else if (!isOpen && audio) {
        // 모달 닫힘 -> 정지 + 초기화 + src 제거
        audio.pause();
        audio.currentTime = 0;
        audio.src = ''; // src 제거 추가
        setIsPlaying(false);
        setAudioError(null);
      }
    }, 100); // 100ms 대기 후 실행

    return () => clearTimeout(timer);
  }, [isOpen, album.preview_url, album.name]);

  // 아티스트명 합치기
  const artistNames = album.artists.map((artist) => artist.name).join(', ');

  return (
    <>
      {/* audio 요소는 항상 렌더링 (조건부 렌더링 밖에 위치) */}
      <audio
        ref={audioRef}
        src={isOpen ? album.preview_url : ''}
        style={{ display: 'none' }}
      />

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

              {/* 재생 상태 표시 */}
              <div css={playingIndicatorStyle}>
                {isPlaying ? (
                  <>
                    <IoPlayCircle size={24} />
                    <span>30초 미리듣기 재생 중...</span>
                  </>
                ) : audioError ? (
                  <>
                    <IoWarning size={24} />
                    <span>재생 불가: {audioError}</span>
                  </>
                ) : (
                  <>
                    <IoPlayCircle size={24} />
                    <span>재생 준비 중...</span>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default AlbumHoverModal;
