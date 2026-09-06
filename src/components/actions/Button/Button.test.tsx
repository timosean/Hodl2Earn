import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { Button } from './Button';

describe('Button', () => {
  it.each(['primary', 'secondary', 'weak', 'danger'] as const)(
    '%s 변형을 렌더링한다',
    (variant) => {
      render(<Button variant={variant}>{variant}</Button>);

      expect(screen.getByRole('button', { name: variant })).toHaveAttribute(
        'data-variant',
        variant,
      );
    },
  );

  it('로딩 중임을 알리고 클릭을 차단한다', async () => {
    const handleClick = vi.fn();
    const user = userEvent.setup();

    render(
      <Button loading onClick={handleClick}>
        저장
      </Button>,
    );

    const button = screen.getByRole('button', { name: '저장' });
    expect(button).toHaveAttribute('aria-busy', 'true');
    expect(button).toBeDisabled();

    await user.click(button);
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('기본 버튼 속성, 외부 클래스와 ref를 전달한다', () => {
    const ref = { current: null as HTMLButtonElement | null };

    render(
      <Button ref={ref} type="submit" className="external" data-testid="button">
        제출
      </Button>,
    );

    expect(screen.getByTestId('button')).toHaveClass('external');
    expect(screen.getByTestId('button')).toHaveAttribute('type', 'submit');
    expect(ref.current).toBe(screen.getByTestId('button'));
  });
});
