import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { OverlayProvider } from 'overlay-kit';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { showToast, Toast } from './Toast';

afterEach(() => {
  vi.useRealTimers();
});

describe('Toast', () => {
  it('상태 메시지를 알리고 시간이 지나면 닫는다', () => {
    vi.useFakeTimers();
    const close = vi.fn();

    render(<Toast isOpen message="저장했어요" duration={2000} close={close} unmount={vi.fn()} />);

    expect(screen.getByRole('status')).toHaveTextContent('저장했어요');
    act(() => vi.advanceTimersByTime(1999));
    expect(close).not.toHaveBeenCalled();
    act(() => vi.advanceTimersByTime(1));
    expect(close).toHaveBeenCalledOnce();
  });

  it('닫힌 상태가 되면 마운트를 해제한다', () => {
    const unmount = vi.fn();
    const { rerender } = render(
      <Toast isOpen message="저장했어요" close={vi.fn()} unmount={unmount} />,
    );

    rerender(<Toast isOpen={false} message="저장했어요" close={vi.fn()} unmount={unmount} />);

    expect(unmount).toHaveBeenCalledOnce();
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });

  it('표시될 때 현재 포커스를 이동하지 않는다', () => {
    const { rerender } = render(<><button type="button">계속 입력</button></>);
    const button = screen.getByRole('button', { name: '계속 입력' });
    button.focus();

    rerender(
      <>
        <button type="button">계속 입력</button>
        <Toast isOpen message="저장했어요" close={vi.fn()} unmount={vi.fn()} />
      </>,
    );

    expect(screen.getByRole('button', { name: '계속 입력' })).toHaveFocus();
  });

  it('showToast로 overlay-kit 수명주기에 연결한다', async () => {
    const user = userEvent.setup();

    function Trigger() {
      return (
        <button type="button" onClick={() => showToast({ message: '추가했어요', duration: 10_000 })}>
          토스트 열기
        </button>
      );
    }

    render(<OverlayProvider><Trigger /></OverlayProvider>);
    const trigger = screen.getByRole('button', { name: '토스트 열기' });
    trigger.focus();
    await user.click(trigger);

    expect(await screen.findByRole('status')).toHaveTextContent('추가했어요');
    expect(trigger).toHaveFocus();
  });
});
