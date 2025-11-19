import { useRef, useEffect, useState } from 'react';

/**
 * DJ 스크래치 페이드아웃 효과가 있는 오디오 플레이어 훅
 * HTMLAudioElement의 playbackRate와 volume을 조절하여 DJ 스크래치 효과 구현
 * (CORS 문제로 Web Audio API 대신 기본 HTMLAudioElement 사용)
 *
 * @param {Object} options - 훅 옵션
 * @param {string} options.src - 오디오 소스 URL
 * @param {boolean} options.isEnabled - 재생 활성화 여부
 * @param {number} [options.scratchDuration=2] - 스크래치 효과 지속 시간 (초)
 * @param {number} [options.minPlaybackRate=0.3] - 최소 재생 속도 (0~1)
 *
 * @returns {Object} 오디오 플레이어 상태 및 ref
 * @returns {React.RefObject} returns.audioRef - audio 엘리먼트에 연결한 ref
 * @returns {boolean} returns.isPlaying - 재생 중 여부
 * @returns {string|null} returns.error - 에러 메시지
 */
function useAudioScratch({
  src,
  isEnabled,
  scratchDuration = 2,
  minPlaybackRate = 0.3,
}) {
  const audioRef = useRef(null);
  const scratchingRef = useRef(false);
  const animationFrameRef = useRef(null);
  const prevEnabledRef = useRef(isEnabled);
  const playTimeoutRef = useRef(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState(null);

  // DJ 스크래치 효과 적용 (HTMLAudioElement 기본 기능 사용)
  const applyScratchEffect = (duration = scratchDuration) => {
    const audio = audioRef.current;

    if (!audio) return;

    // 이전 애니메이션 취소
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }

    // 이미 스크래치 중이면 중단하고 새로 시작
    scratchingRef.current = true;

    const startTime = performance.now();
    const initialVolume = Math.max(0, Math.min(1, audio.volume)); // 0~1 범위 보장
    const initialRate = Math.max(0.25, Math.min(2, audio.playbackRate)); // 0.25~2 범위 보장

    const animate = (currentTime) => {
      const elapsed = (currentTime - startTime) / 1000;
      const progress = Math.min(elapsed / duration, 1);

      if (progress < 1 && !audio.paused) {
        // playbackRate: 초기 속도 -> minPlaybackRate (속도 감소)
        const targetRate =
          initialRate - progress * (initialRate - minPlaybackRate);
        audio.playbackRate = Math.max(
          minPlaybackRate,
          Math.min(initialRate, targetRate),
        );

        // volume: 초기 볼륨 -> 0 (볼륨 페이드아웃)
        const targetVolume = initialVolume * (1.0 - progress);
        audio.volume = Math.max(0, Math.min(1, targetVolume));

        animationFrameRef.current = requestAnimationFrame(animate);
      } else {
        // 효과 완료 후 정지 및 리소스 해제
        audio.pause();
        audio.currentTime = 0;
        audio.playbackRate = 1.0;
        audio.volume = 1.0;
        audio.removeAttribute('src');
        audio.load();
        scratchingRef.current = false;
        setIsPlaying(false);
        setError(null);
      }
    };

    animationFrameRef.current = requestAnimationFrame(animate);
  };

  // 재생 시간 추적 및 스크래치 효과 트리거
  const handleTimeUpdate = () => {
    const audio = audioRef.current;

    if (!audio || scratchingRef.current || !audio.duration) return;

    const timeRemaining = audio.duration - audio.currentTime;

    if (timeRemaining <= scratchDuration && timeRemaining > 0) {
      scratchingRef.current = true;
      applyScratchEffect(scratchDuration);
    }
  };

  // 호버 해제 감지 및 스크래치 효과 적용
  useEffect(() => {
    const wasEnabled = prevEnabledRef.current;
    const isNowDisabled = !isEnabled;

    // 호버 해제 시 (enabled: true -> false)
    if (wasEnabled && isNowDisabled) {
      // 대기 중인 재생 timeout 취소
      if (playTimeoutRef.current) {
        clearTimeout(playTimeoutRef.current);
        playTimeoutRef.current = null;
      }

      // 재생 중이면 스크래치 효과 적용
      if (isPlaying) {
        applyScratchEffect(0.5);
      }
    }

    prevEnabledRef.current = isEnabled;
  }, [isEnabled, isPlaying]);

  // 오디오 재생/정지 로직
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    // 이전 timeout 취소
    if (playTimeoutRef.current) {
      clearTimeout(playTimeoutRef.current);
      playTimeoutRef.current = null;
    }

    playTimeoutRef.current = setTimeout(() => {
      if (isEnabled && src) {
        const handleCanPlay = () => {
          audio
            .play()
            .then(() => {
              setIsPlaying(true);
              setError(null);
            })
            .catch((err) => {
              setIsPlaying(false);
              setError(err.message);
            });
        };

        const handleError = (e) => {
          setIsPlaying(false);
          setError('오디오 로드 실패');
        };

        const handlePlay = () => setIsPlaying(true);
        const handlePause = () => setIsPlaying(false);

        audio.addEventListener('canplay', handleCanPlay);
        audio.addEventListener('error', handleError);
        audio.addEventListener('play', handlePlay);
        audio.addEventListener('pause', handlePause);
        audio.addEventListener('timeupdate', handleTimeUpdate);

        if (audio.readyState >= 3) {
          handleCanPlay();
        }

        return () => {
          audio.removeEventListener('canplay', handleCanPlay);
          audio.removeEventListener('error', handleError);
          audio.removeEventListener('play', handlePlay);
          audio.removeEventListener('pause', handlePause);
          audio.removeEventListener('timeupdate', handleTimeUpdate);
        };
      } else if (!scratchingRef.current) {
        // 정리 (스크래치 중이 아닐 때만)
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }
        audio.pause();
        audio.currentTime = 0;
        audio.playbackRate = 1.0;
        audio.volume = 1.0;
        audio.removeAttribute('src');
        audio.load();
        setIsPlaying(false);
        setError(null);
      }
    }, 100);

    return () => {
      if (playTimeoutRef.current) {
        clearTimeout(playTimeoutRef.current);
        playTimeoutRef.current = null;
      }
    };
  }, [isEnabled, src, scratchDuration]);

  return {
    audioRef,
    isPlaying,
    error,
  };
}

export default useAudioScratch;
