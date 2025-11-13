import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ErrorToast from '@/components/ErrorToast';

describe('ErrorToast', () => {
  it('에러 메시지가 null이면 렌더링하지 않아야 함', () => {
    render(<ErrorToast message={null} onClose={vi.fn()} onRetry={vi.fn()} />);

    expect(screen.queryByText('재시도')).not.toBeInTheDocument();
  });

  it('에러 메시지가 있으면 표시되어야 함', () => {
    const errorMessage = '네트워크 오류가 발생했습니다';

    render(
      <ErrorToast message={errorMessage} onClose={vi.fn()} onRetry={vi.fn()} />,
    );

    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });

  it('닫기 버튼 클릭 시 onClose가 호출되어야 함', () => {
    const handleClose = vi.fn();

    render(
      <ErrorToast
        message="에러 메시지"
        onClose={handleClose}
        onRetry={vi.fn()}
      />,
    );

    const buttons = screen.getAllByRole('button');
    const closeButton = buttons.find(
      (btn) => btn.querySelector('svg') && !btn.textContent.includes('재시도'),
    );

    fireEvent.click(closeButton);

    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('재시도 버튼 클릭 시 onRetry가 호출되어야 함', () => {
    const handleRetry = vi.fn();

    render(
      <ErrorToast
        message="에러 메시지"
        onClose={vi.fn()}
        onRetry={handleRetry}
      />,
    );

    const retryButton = screen.getByText('재시도');
    fireEvent.click(retryButton);

    expect(handleRetry).toHaveBeenCalledTimes(1);
  });

  it('onRetry가 없으면 재시도 버튼이 표시되지 않아야 함', () => {
    render(
      <ErrorToast message="에러 메시지" onClose={vi.fn()} onRetry={null} />,
    );

    expect(screen.queryByText('재시도')).not.toBeInTheDocument();
  });
});
