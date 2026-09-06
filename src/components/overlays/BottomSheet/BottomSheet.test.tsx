import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { BottomSheet } from './BottomSheet';

afterEach(() => { vi.useRealTimers(); document.body.style.overflow = ''; });

describe('BottomSheet', () => {
  it('대화상자 접근성, 첫 포커스, 순환, ESC, 배경과 내부 클릭을 지원한다', async () => {
    const user = userEvent.setup(); const close = vi.fn();
    render(<BottomSheet isOpen close={close} unmount={vi.fn()} title="코인 선택" description="추가할 코인을 선택하세요."><button>비트코인</button><button>이더리움</button></BottomSheet>);
    const dialog = screen.getByRole('dialog', { name: '코인 선택' });
    expect(dialog).toHaveAttribute('aria-modal', 'true'); expect(dialog).toHaveAccessibleDescription('추가할 코인을 선택하세요.');
    const first = screen.getByRole('button', { name: '비트코인' }); const last = screen.getByRole('button', { name: '이더리움' });
    expect(first).toHaveFocus(); last.focus(); await user.tab(); expect(first).toHaveFocus();
    await user.click(last); expect(close).not.toHaveBeenCalled(); await user.keyboard('{Escape}'); expect(close).toHaveBeenCalledTimes(1);
    await user.click(screen.getByTestId('bottom-sheet-backdrop')); expect(close).toHaveBeenCalledTimes(2);
  });

  it('닫힘 동안 포커스와 스크롤을 복원하고 transitionend에서 unmount한다', () => {
    const opener = document.createElement('button'); document.body.append(opener); opener.focus(); const unmount = vi.fn();
    const { rerender } = render(<BottomSheet isOpen close={vi.fn()} unmount={unmount} title="선택"><button>항목</button></BottomSheet>);
    expect(document.body.style.overflow).toBe('hidden');
    rerender(<BottomSheet isOpen={false} close={vi.fn()} unmount={unmount} title="선택" />);
    expect(opener).toHaveFocus(); expect(document.body.style.overflow).toBe('');
    fireEvent.transitionEnd(screen.getByTestId('bottom-sheet-panel')); expect(unmount).toHaveBeenCalledTimes(1); opener.remove();
  });

  it('중첩 시 최상단만 처리하고 안전 타이머와 reduced-motion으로 정리한다', () => {
    vi.useFakeTimers(); const lowerClose = vi.fn(); const upperClose = vi.fn(); const unmount = vi.fn();
    const view = render(<><BottomSheet isOpen close={lowerClose} unmount={vi.fn()} title="아래" /><BottomSheet isOpen close={upperClose} unmount={vi.fn()} title="위" /></>);
    fireEvent.keyDown(document, { key: 'Escape' }); expect(lowerClose).not.toHaveBeenCalled(); expect(upperClose).toHaveBeenCalledTimes(1);
    fireEvent.click(screen.getAllByTestId('bottom-sheet-backdrop')[0]); expect(lowerClose).not.toHaveBeenCalled();
    view.rerender(<BottomSheet isOpen={false} close={vi.fn()} unmount={unmount} title="닫힘" />); vi.runAllTimers(); expect(unmount).toHaveBeenCalledTimes(1);
    vi.useRealTimers(); const matchMedia = vi.spyOn(window, 'matchMedia').mockReturnValue({ matches: true } as MediaQueryList); const immediateUnmount = vi.fn();
    view.rerender(<BottomSheet isOpen close={vi.fn()} unmount={immediateUnmount} title="다시" />);
    view.rerender(<BottomSheet isOpen={false} close={vi.fn()} unmount={immediateUnmount} title="다시" />);
    expect(immediateUnmount).toHaveBeenCalledTimes(1); matchMedia.mockRestore();
  });
});
