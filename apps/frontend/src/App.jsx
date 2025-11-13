import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import EmotionInputPage from '@/pages/EmotionInputPage';
import Loading from '@/components/Loading';
import ResultPage from '@/pages/ResultPage';
import ErrorToast from '@/components/ErrorToast';
import { useEmotionAnalysis } from '@/hooks';

/**
 * 메인 애플리케이션 컴포넌트
 * 페이지 전환 및 감정 분석 플로우 관리
 */
function App() {
  const [currentPage, setCurrentPage] = useState('input');
  const { isLoading, progress, result, error, analyze, clearError, reset } =
    useEmotionAnalysis();

  /**
   * 감정 입력 제출 핸들러
   *
   * @param {string} text - 사용자가 입력한 텍스트
   */
  const handleEmotionSubmit = async (text) => {
    setCurrentPage('loading');
    await analyze(text);
  };

  /**
   * 로딩 완료 핸들러
   * 진행률이 100%에 도달하면 결과 페이지로 전환
   */
  const handleLoadingComplete = () => {
    if (result) {
      setCurrentPage('result');
    }
  };

  /**
   * 다시하기 핸들러
   * 모든 상태를 초기화하고 입력 페이지로 돌아감
   */
  const handleRestart = () => {
    setCurrentPage('input');
    reset();
  };

  /**
   * 에러 재시도 핸들러
   * 에러를 초기화하고 입력 페이지로 돌아감
   */
  const handleRetry = () => {
    clearError();
    setCurrentPage('input');
  };

  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
        position: 'relative',
        background: 'linear-gradient(135deg, #000f00 0%, #0d0d0d 100%)',
      }}
    >
      {/* 에러 토스트 */}
      <ErrorToast message={error} onClose={clearError} onRetry={handleRetry} />

      <AnimatePresence mode="wait">
        {/* 입력 페이지 */}
        {currentPage === 'input' && (
          <motion.div
            key="input"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            style={{ position: 'absolute', width: '100%', height: '100%' }}
          >
            <EmotionInputPage onNext={handleEmotionSubmit} />
          </motion.div>
        )}

        {/* 로딩 페이지 */}
        {currentPage === 'loading' && (
          <motion.div
            key="loading"
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            style={{ position: 'absolute', width: '100%', height: '100%' }}
          >
            <Loading progress={progress} onComplete={handleLoadingComplete} />
          </motion.div>
        )}

        {/* 결과 페이지 */}
        {currentPage === 'result' && result && (
          <motion.div
            key="result"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              overflow: 'auto',
            }}
          >
            <ResultPage emotionResult={result} onRestart={handleRestart} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
