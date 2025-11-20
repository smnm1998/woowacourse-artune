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
 * @param {number} progress - 진행률 (0-100)
 * @param {string} message - 로딩 메시지 (추가됨)
 * @param {Function} onComplete - 로딩 완료 후 호출될 콜백
 */
// 👇 여기 인자에 'message'가 빠져 있었습니다. 추가해주세요!
function Loading({ progress = 0, message, onComplete }) {
  const isComplete = progress >= 100;

  return (
    <div css={loadingContainerStyle}>
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
          if (isComplete && onComplete) {
            onComplete();
          }
        }}
      >
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

      <motion.div
        css={progressWrapperStyle}
        initial={{ opacity: 0 }}
        animate={{ opacity: isComplete ? 0 : 1 }}
        transition={{ delay: 0.8, duration: 0.5 }}
      >
        <ProgressBar value={progress} />
        {/* 이제 message 값이 정상적으로 들어옵니다 */}
        <p css={loadingTextStyle}>{message || '감정을 분석하고 있어요...'}</p>
      </motion.div>
    </div>
  );
}

export default Loading;
