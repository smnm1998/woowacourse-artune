import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import EmotionInputPage from '@/pages/EmotionInputPage';
import Loading from '@/components/Loading';
import ResultPage from '@/pages/ResultPage';
import { mockEmotionResult } from '@/mocks/mockData';

function App() {
  const [currentPage, setCurrentPage] = useState('input');
  const [progress, setProgress] = useState(0);
  const [emotionResult, setEmotionResult] = useState(null);

  // 감정 입력 제출 핸들러
  const handleEmotionSubmit = async (text) => {
    setCurrentPage('loading');
    setProgress(0);

    // 가짜 진행률
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) {
          clearInterval(interval);
          return 90;
        }
        return prev + Math.random() * 15;
      });
    }, 150);

    try {
      // 8초 대기 (실제 API 호출 시뮬레이션)
      await new Promise((resolve) => setTimeout(resolve, 8000));
      clearInterval(interval);
      setProgress(100);
      setEmotionResult(mockEmotionResult);
    } catch (error) {
      console.error('감정 분석 실패:', error);
      clearInterval(interval);
      setCurrentPage('input');
    }
  };

  // 로딩 완료 핸들러
  const handleLoadingComplete = () => {
    setCurrentPage('result');
  };

  // 다시하기 핸들러 (추가)
  const handleRestart = () => {
    setCurrentPage('input');
    setProgress(0);
    setEmotionResult(null);
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
        {currentPage === 'result' && emotionResult && (
          <motion.div
            key="result"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              overflow: 'auto', // 스크롤 가능하도록
            }}
          >
            <ResultPage
              emotionResult={emotionResult}
              onRestart={handleRestart}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
