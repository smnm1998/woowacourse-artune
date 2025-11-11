import { IoPlay, IoPause, IoMusicalNotes } from 'react-icons/io5';
import { SiSpotify } from 'react-icons/si';
import { useAudioPlayer } from '@/hooks';
import {
  trackListContainerStyle,
  trackItemStyle,
  albumCoverStyle,
  trackInfoStyle,
  trackNameStyle,
  artistNameStyle,
  trackActionsStyle,
  playButtonStyle,
  spotifyLinkStyle,
  durationStyle,
  playingIndicatorStyle,
} from './TrackList.styles';

function TrackList({ tracks }) {
  const { playingTrackId, handlePlayPause, audioRef } = useAudioPlayer();

  // 재생 시간 포맷 (ms -> mm:ss)
  const formatDuration = (ms) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div css={trackListContainerStyle}>
      {tracks.map((track) => (
        <div key={track.id} css={trackItemStyle}>
          {/* 앨범 커버 */}
          <div css={albumCoverStyle}>
            {track.album.images[0]?.url ? (
              <img src={track.album.images[0].url} alt={track.album.name} />
            ) : (
              <IoMusicalNotes size={24} color="rgba(249, 249, 249, 0.5)" />
            )}
          </div>

          {/* 트랙 정보 */}
          <div css={trackInfoStyle}>
            <p css={trackNameStyle}>{track.name}</p>
            <p css={artistNameStyle}>
              {track.artists.map((artist) => artist.name).join(', ')}
            </p>
          </div>

          {/* 액션 버튼들 */}
          <div css={trackActionsStyle}>
            {/* 재생 시간 */}
            <span css={durationStyle}>{formatDuration(track.duration_ms)}</span>

            {/* 재생/일시정지 버튼 */}
            <button
              css={playButtonStyle}
              onClick={() => handlePlayPause(track)}
              disabled={!track.preview_url}
            >
              {playingTrackId === track.id ? (
                <IoPause size={18} />
              ) : (
                <IoPlay size={18} />
              )}
            </button>

            {/* 스포티파이 링크 */}
            <a
              href={track.external_urls.spotify}
              target="_blank"
              rel="noopener noreferrer"
              css={spotifyLinkStyle}
              title="스포티파이에서 듣기"
            >
              <SiSpotify size={16} />
            </a>
          </div>

          {/* 재생 중 인디케이터 */}
          {playingTrackId === track.id && <div css={playingIndicatorStyle} />}
        </div>
      ))}

      {/* 오디오 엘리먼트 (hook에서 제공) */}
      <audio ref={audioRef} />
    </div>
  );
}

export default TrackList;
