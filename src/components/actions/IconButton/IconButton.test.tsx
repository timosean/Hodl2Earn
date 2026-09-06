import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { IconButton } from './IconButton';

describe('IconButton', () => {
  it('필수 라벨로 접근 가능한 이름을 제공한다', () => {
    render(<IconButton aria-label="메뉴 열기" icon={<span aria-hidden="true">☰</span>} />);

    expect(screen.getByRole('button', { name: '메뉴 열기' })).toBeInTheDocument();
  });

  it('기본 버튼 속성, 외부 클래스와 ref를 전달한다', () => {
    const ref = { current: null as HTMLButtonElement | null };

    render(
      <IconButton
        ref={ref}
        aria-label="삭제"
        icon="×"
        disabled
        className="external"
      />,
    );

    const button = screen.getByRole('button', { name: '삭제' });
    expect(button).toBeDisabled();
    expect(button).toHaveClass('external');
    expect(ref.current).toBe(button);
  });
});
