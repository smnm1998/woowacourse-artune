import { motion, AnimatePresence } from 'framer-motion';
import { MdError, MdClose } from 'react-icons/md';
import * as styles from './ErrorToast.styles';

/**
 * 에러 메시지를 표시하는 토스트 컴포넌트
 *
 * @param {Object} props
 * @param {string} props.message - 표시할 에러 메시지
 * @param {Function} props.onClose - 토스트를 닫을 때 호출되는 콜백
 * @param {Function} [props.onRetry] - 재시도 버튼 클릭 시 호출되는 콜백
 * @returns {JSX.Element}
 */
function ErrorToast({ message, onClose, onRetry }) {
  return (
    <AnimatePresence>
      {message && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          transition={{ duration: 0.3 }}
          css={styles.toastContainer}
        >
          {/* 에러 아이콘 */}
          <div css={styles.iconWrapper}>
            <MdError size={24} />
          </div>

          {/* 에러 메시지 */}
          <div css={styles.messageWrapper}>
            <p css={styles.message}>{message}</p>
          </div>

          {/* 액션 버튼 */}
          <div css={styles.actionsWrapper}>
            {onRetry && (
              <button
                css={styles.retryButton}
                onClick={onRetry}
                aria-label="재시도"
              >
                재시도
              </button>
            )}
            <button
              css={styles.closeButton}
              onClick={onClose}
              aria-label="닫기"
            >
              <MdClose size={20} />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default ErrorToast;
