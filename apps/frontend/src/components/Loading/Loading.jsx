import { motion } from 'framer-motion';
import { IoSend } from 'react-icons/io5';
import ProgressBar from './ProgressBar';
import {
  loadingContainerStyle,
  iconWrapperStyle,
  iconStyle,
  progressWrapperStyle,
  loadingTextStyle,
} from './Loading.styles';

/**
 * 로딩 상태를 표시하는 컴포넌트
 * - 아이콘이 왼쪽에서 중앙으로 이동
 * - 비행 이펙트 적용
 * - 프로그래바 표시
 * @param {number} progress - 진행률 (0-100)
 * @param {Function} onComplete - 로딩 완료 후 호출될 콜백 (progress가 100일 때)
 */
function Loading({ progress = 0, onComplete }) {
  // progress가 100이 되면 아이콘이 오른쪽으로 이동
  const isComplete = progress >= 100;

  return (
    <div css={loadingContainerStyle}>
      {/* 아이콘 래퍼 - 왼쪽에서 중앙으로, 완료 시 오른쪽으로 */}
      <motion.div
        css={iconWrapperStyle}
        initial={{ x: '-100vw' }}
        animate={{
          x: isComplete ? '200vw' : 0,
        }}
        transition={{
          duration: 1.6,
          ease: 'easeInOut',
        }}
        onAnimationComplete={() => {
          // 오른쪽으로 나가는 애니메이션 완료 시
          if (isComplete && onComplete) {
            onComplete();
          }
        }}
      >
        {/* 비행 이펙트 */}
        <motion.div
          css={iconStyle}
          animate={
            !isComplete
              ? {
                  y: [-8, 8, -8],
                  rotate: [-3, 3, -3],
                }
              : {}
          }
          transition={{
            duration: 1.6,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          <IoSend size={48} color="#f9f9f9" />
        </motion.div>
      </motion.div>

      {/* 프로그래스 바 */}
      <motion.div
        css={progressWrapperStyle}
        initial={{ opacity: 0 }}
        animate={{ opacity: isComplete ? 0 : 1 }} // 완료 시 페이드아웃 처리
        transition={{
          delay: 0.8, // 아이콘 이동 완료 후 나타남
          duration: 0.5,
        }}
      >
        <ProgressBar value={progress} />
        <p css={loadingTextStyle}>감정을 분석하고 있어요...</p>
      </motion.div>
    </div>
  );
}

export default Loading;
