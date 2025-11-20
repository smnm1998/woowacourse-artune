import { useRef, useEffect, useState, useCallback } from 'react';

/**
 * DJ 스크래치 페이드아웃 효과가 있는 오디오 플레이어 훅
 * HTMLAudioElement의 playbackRate와 volume을 조절하여 DJ 스크래치 효과 구현
 * (CORS 문제로 Web Audio API 대신 기본 HTMLAudioElement 사용)
 *
 * @param {Object} options - 훅 옵션
 * @param {string} options.src - 오디오 소스 URL
 * @param {boolean} options.isEnabled - 재생 활성화 여부
 * @param {number} [options.scratchDuration=2] - 스크래치 효과 지속 시간 (초)
 * @param {number} [options.minPlaybackRate=0.5] - 최소 재생 속도 (0~1)
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
  minPlaybackRate = 0.5,
}) {
  const audioRef = useRef(null);
  const scratchingRef = useRef(false);
  const animationFrameRef = useRef(null);
  const prevEnabledRef = useRef(isEnabled);
  const listenerCleanupRef = useRef(null);
  const playTimeoutRef = useRef(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState(null);

  /**
   * 오디오를 즉시 정지하고 상태를 초기화하는 함수 (최적화된 공통 로직)
   */
  const stopAndReset = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }

    // 오디오 정지 및 속성 원복
    audio.pause();
    audio.currentTime = 0;
    audio.playbackRate = 1.0;
    audio.volume = 1.0;

    scratchingRef.current = false;
    setIsPlaying(false);
    setError(null);
  }, []);

  /**
   * DJ 스크래치 효과 적용 애니메이션
   */
  const applyScratchEffect = useCallback(
    (duration = scratchDuration) => {
      const audio = audioRef.current;
      if (!audio) return;

      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }

      scratchingRef.current = true;

      const startTime = performance.now();
      const initialVolume = Math.max(0, Math.min(1, audio.volume));
      const initialRate = Math.max(0.25, Math.min(2, audio.playbackRate));

      const animate = (currentTime) => {
        const elapsed = (currentTime - startTime) / 1000;
        const progress = Math.min(elapsed / duration, 1);

        if (progress < 1 && !audio.paused) {
          // 속도 감소: 초기 속도 -> minPlaybackRate
          const targetRate =
            initialRate - progress * (initialRate - minPlaybackRate);
          audio.playbackRate = Math.max(
            minPlaybackRate,
            Math.min(initialRate, targetRate),
          );

          // 볼륨 감소: 초기 볼륨 -> 0
          const targetVolume = initialVolume * (1.0 - progress);
          audio.volume = Math.max(0, Math.min(1, targetVolume));

          animationFrameRef.current = requestAnimationFrame(animate);
        } else {
          // 효과 완료 후 완전 정지
          stopAndReset();
        }
      };

      animationFrameRef.current = requestAnimationFrame(animate);
    },
    [scratchDuration, minPlaybackRate, stopAndReset],
  );

  /**
   * 재생 시간 추적 및 종료 전 스크래치 효과 트리거
   */
  const handleTimeUpdate = useCallback(() => {
    const audio = audioRef.current;

    if (!audio || scratchingRef.current || !audio.duration) return;

    const timeRemaining = audio.duration - audio.currentTime;

    if (timeRemaining <= scratchDuration && timeRemaining > 0) {
      scratchingRef.current = true;
      applyScratchEffect(scratchDuration);
    }
  }, [scratchDuration, applyScratchEffect]);

  // 탭 전환(화면 가림) 감지 및 오디오 강제 정지
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        // 화면이 가려지면 즉시 정지
        stopAndReset();

        // 리스너까지 제거하여 복귀 시 자동 재생(좀비 실행) 원천 차단
        if (listenerCleanupRef.current) {
          listenerCleanupRef.current();
          listenerCleanupRef.current = null;
        }

        if (playTimeoutRef.current) {
          clearTimeout(playTimeoutRef.current);
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [stopAndReset]);

  // 호버 해제 감지 및 스크래치 효과 적용 (Fade-out)
  useEffect(() => {
    const wasEnabled = prevEnabledRef.current;
    const isNowDisabled = !isEnabled;

    if (wasEnabled && isNowDisabled) {
      if (playTimeoutRef.current) {
        clearTimeout(playTimeoutRef.current);
        playTimeoutRef.current = null;
      }
      // 재생 중일 때만 스크래치 효과로 퇴장
      if (isPlaying) {
        applyScratchEffect(0.5);
      }
    }
    prevEnabledRef.current = isEnabled;
  }, [isEnabled, isPlaying, applyScratchEffect]);

  // 메인 재생/정지 로직
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    // 이전 타임아웃 및 리스너 정리
    if (playTimeoutRef.current) {
      clearTimeout(playTimeoutRef.current);
      playTimeoutRef.current = null;
    }
    if (listenerCleanupRef.current) {
      listenerCleanupRef.current();
      listenerCleanupRef.current = null;
    }

    playTimeoutRef.current = setTimeout(() => {
      if (isEnabled && src) {
        const handleCanPlay = () => {
          // 탭이 백그라운드 상태라면 재생 명령 무시
          if (document.hidden) return;

          audio
            .play()
            .then(() => {
              setIsPlaying(true);
              setError(null);
            })
            .catch(() => {
              // 자동 재생 정책 차단 등으로 실패 시 조용히 처리
              setIsPlaying(false);
            });
        };

        const handleError = () => {
          setIsPlaying(false);
          setError('오디오 로드 실패');
        };

        const handlePlay = () => setIsPlaying(true);
        const handlePause = () => setIsPlaying(false);

        // 리스너 등록
        audio.addEventListener('canplay', handleCanPlay);
        audio.addEventListener('error', handleError);
        audio.addEventListener('play', handlePlay);
        audio.addEventListener('pause', handlePause);
        audio.addEventListener('timeupdate', handleTimeUpdate);

        // 리스너 제거 함수 저장 (Ref로 관리하여 언제든 호출 가능하게 함)
        listenerCleanupRef.current = () => {
          audio.removeEventListener('canplay', handleCanPlay);
          audio.removeEventListener('error', handleError);
          audio.removeEventListener('play', handlePlay);
          audio.removeEventListener('pause', handlePause);
          audio.removeEventListener('timeupdate', handleTimeUpdate);
        };

        // 이미 준비된 경우 즉시 재생 시도
        if (audio.readyState >= 3) {
          handleCanPlay();
        }
      } else if (!scratchingRef.current) {
        // 스크래치 중이 아닐 때(비활성화 상태 등)는 즉시 정지
        stopAndReset();
      }
    }, 100);

    // Cleanup 함수
    return () => {
      if (playTimeoutRef.current) {
        clearTimeout(playTimeoutRef.current);
      }
      // 컴포넌트 언마운트/업데이트 시 리스너 확실하게 제거
      if (listenerCleanupRef.current) {
        listenerCleanupRef.current();
        listenerCleanupRef.current = null;
      }
    };
  }, [isEnabled, src, handleTimeUpdate, stopAndReset]);

  return {
    audioRef,
    isPlaying,
    error,
  };
}

export default useAudioScratch;
