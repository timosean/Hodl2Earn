import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { Modal } from './Modal';

afterEach(() => {
  vi.useRealTimers();
  document.body.style.overflow = '';
});

describe('Modal', () => {
  it('대화상자의 제목과 설명을 연결하고 지정한 요소에 첫 포커스를 둔다', () => {
    const initialFocusRef = createRef<HTMLButtonElement>();
    render(
      <Modal isOpen close={vi.fn()} unmount={vi.fn()} title="보유 자산 삭제" description="삭제한 자산은 복구할 수 없습니다." initialFocusRef={initialFocusRef}>
        <button>취소</button><button ref={initialFocusRef}>삭제</button>
      </Modal>,
    );
    const dialog = screen.getByRole('dialog', { name: '보유 자산 삭제' });
    expect(dialog).toHaveAttribute('aria-modal', 'true');
    expect(dialog).toHaveAccessibleDescription('삭제한 자산은 복구할 수 없습니다.');
    expect(screen.getByRole('button', { name: '삭제' })).toHaveFocus();
  });

  it('첫 상호작용 요소로 포커스를 옮기고 Tab 포커스를 순환한 뒤 복원한다', async () => {
    const user = userEvent.setup();
    const opener = document.createElement('button');
    document.body.append(opener); opener.focus();
    const props = { close: vi.fn(), unmount: vi.fn(), title: '설정' };
    const { rerender } = render(<Modal isOpen {...props}><button>첫 번째</button><button>마지막</button></Modal>);
    const first = screen.getByRole('button', { name: '첫 번째' });
    const last = screen.getByRole('button', { name: '마지막' });
    expect(first).toHaveFocus(); last.focus(); await user.tab(); expect(first).toHaveFocus();
    await user.tab({ shift: true }); expect(last).toHaveFocus();
    rerender(<Modal isOpen={false} {...props}><button>첫 번째</button><button>마지막</button></Modal>);
    expect(opener).toHaveFocus(); opener.remove();
  });

  it('ESC와 배경 클릭으로 닫고 내부 클릭은 유지한다', async () => {
    const user = userEvent.setup(); const close = vi.fn();
    render(<Modal isOpen close={close} unmount={vi.fn()} title="확인"><button>내용</button></Modal>);
    await user.click(screen.getByRole('button', { name: '내용' })); expect(close).not.toHaveBeenCalled();
    await user.click(screen.getByTestId('modal-backdrop')); expect(close).toHaveBeenCalledTimes(1);
    await user.keyboard('{Escape}'); expect(close).toHaveBeenCalledTimes(2);
  });

  it('closeOnBackdrop이 false이면 배경 클릭을 무시한다', async () => {
    const user = userEvent.setup(); const close = vi.fn();
    render(<Modal isOpen close={close} unmount={vi.fn()} title="확인" closeOnBackdrop={false} />);
    await user.click(screen.getByTestId('modal-backdrop')); expect(close).not.toHaveBeenCalled();
  });

  it('중첩된 오버레이에서는 최상단만 ESC와 배경 클릭을 처리한다', async () => {
    const user = userEvent.setup(); const lowerClose = vi.fn(); const upperClose = vi.fn();
    render(<><Modal isOpen close={lowerClose} unmount={vi.fn()} title="아래" /><Modal isOpen close={upperClose} unmount={vi.fn()} title="위" /></>);
    await user.keyboard('{Escape}'); expect(lowerClose).not.toHaveBeenCalled(); expect(upperClose).toHaveBeenCalledTimes(1);
    await user.click(screen.getAllByTestId('modal-backdrop')[0]); expect(lowerClose).not.toHaveBeenCalled();
  });

  it('열린 오버레이 수만큼 body 스크롤을 잠그고 마지막 닫힘에 복원한다', () => {
    const first = render(<Modal isOpen close={vi.fn()} unmount={vi.fn()} title="첫째" />);
    const second = render(<Modal isOpen close={vi.fn()} unmount={vi.fn()} title="둘째" />);
    expect(document.body.style.overflow).toBe('hidden'); first.unmount(); expect(document.body.style.overflow).toBe('hidden');
    second.unmount(); expect(document.body.style.overflow).toBe('');
  });

  it('닫힘 transitionend 또는 안전 타이머에서 한 번만 unmount한다', () => {
    vi.useFakeTimers(); const unmount = vi.fn();
    const { rerender } = render(<Modal isOpen close={vi.fn()} unmount={unmount} title="확인" />);
    rerender(<Modal isOpen={false} close={vi.fn()} unmount={unmount} title="확인" />);
    fireEvent.transitionEnd(screen.getByTestId('modal-panel')); vi.runAllTimers(); expect(unmount).toHaveBeenCalledTimes(1);
  });

  it('reduced-motion에서는 닫힘을 즉시 완료한다', () => {
    const matchMedia = vi.spyOn(window, 'matchMedia').mockReturnValue({ matches: true } as MediaQueryList);
    const unmount = vi.fn(); const { rerender } = render(<Modal isOpen close={vi.fn()} unmount={unmount} title="확인" />);
    rerender(<Modal isOpen={false} close={vi.fn()} unmount={unmount} title="확인" />);
    expect(unmount).toHaveBeenCalledTimes(1); matchMedia.mockRestore();
  });

  it('overlay-kit의 false → true → false 수명주기에서 실제로 열린 뒤에만 unmount한다', () => {
    vi.useFakeTimers();
    const unmount = vi.fn();
    const props = { close: vi.fn(), unmount, title: '확인' };
    const { rerender } = render(<Modal isOpen={false} {...props} />);
    vi.runAllTimers();
    expect(unmount).not.toHaveBeenCalled();

    rerender(<Modal isOpen {...props} />);
    rerender(<Modal isOpen={false} {...props} />);
    vi.runAllTimers();
    expect(unmount).toHaveBeenCalledTimes(1);
  });

  it('닫힘 애니메이션 중에도 잠금을 유지하고 중첩 오버레이가 모두 정리된 뒤 복원한다', () => {
    const firstProps = { close: vi.fn(), unmount: vi.fn(), title: '첫째' };
    const secondProps = { close: vi.fn(), unmount: vi.fn(), title: '둘째' };
    const view = render(<><Modal isOpen {...firstProps} /><Modal isOpen {...secondProps} /></>);
    view.rerender(<><Modal isOpen={false} {...firstProps} /><Modal isOpen {...secondProps} /></>);
    expect(document.body.style.overflow).toBe('hidden');
    view.rerender(<><Modal isOpen={false} {...firstProps} /><Modal isOpen={false} {...secondProps} /></>);
    expect(document.body.style.overflow).toBe('hidden');
    view.unmount();
    expect(document.body.style.overflow).toBe('');
  });

  it('숨겨지거나 비활성인 후보와 외부 initialFocusRef를 제외하고 외부 포커스를 양방향으로 보정한다', async () => {
    const user = userEvent.setup();
    const outsideRef = createRef<HTMLButtonElement>();
    render(<>
      <button ref={outsideRef}>외부</button>
      <Modal isOpen close={vi.fn()} unmount={vi.fn()} title="포커스" initialFocusRef={outsideRef}>
        <button hidden>hidden</button>
        <button aria-hidden="true">aria hidden</button>
        <button disabled>disabled</button>
        <fieldset disabled><button>fieldset disabled</button></fieldset>
        <span style={{ display: 'none' }}><button>CSS hidden</button></span>
        <button>첫 유효</button>
        <button>마지막 유효</button>
      </Modal>
    </>);
    const first = screen.getByRole('button', { name: '첫 유효' });
    const last = screen.getByRole('button', { name: '마지막 유효' });
    expect(first).toHaveFocus();
    outsideRef.current?.focus();
    await user.tab();
    expect(first).toHaveFocus();
    outsideRef.current?.focus();
    await user.tab({ shift: true });
    expect(last).toHaveFocus();
  });

  it('dialog 내부라도 포커스할 수 없는 initialFocusRef는 사용하지 않는다', () => {
    const invalidRef = createRef<HTMLDivElement>();
    render(
      <Modal isOpen close={vi.fn()} unmount={vi.fn()} title="포커스" initialFocusRef={invalidRef}>
        <div ref={invalidRef}>포커스 불가</div>
        <button>유효 후보</button>
      </Modal>,
    );
    expect(screen.getByRole('button', { name: '유효 후보' })).toHaveFocus();
  });
});
