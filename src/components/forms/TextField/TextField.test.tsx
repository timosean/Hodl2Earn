import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import { TextField } from './TextField';

describe('TextField', () => {
  it('라벨을 입력과 연결하고 설명과 오류를 함께 안내한다', async () => {
    const user = userEvent.setup();

    render(
      <TextField
        label="매수 금액"
        description="원 단위로 입력해 주세요"
        error="금액을 확인해 주세요"
      />,
    );

    const input = screen.getByRole('textbox', { name: '매수 금액' });
    await user.click(screen.getByText('매수 금액'));

    expect(input).toHaveFocus();
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(input).toHaveAccessibleDescription(
      '원 단위로 입력해 주세요 금액을 확인해 주세요',
    );
  });

  it('접두·접미 요소와 기본 입력 속성, 외부 클래스와 ref를 전달한다', () => {
    const ref = { current: null as HTMLInputElement | null };

    render(
      <TextField
        ref={ref}
        label="수량"
        prefix={<span>BTC</span>}
        suffix={<span>개</span>}
        inputMode="decimal"
        className="external"
      />,
    );

    const input = screen.getByRole('textbox', { name: '수량' });
    expect(screen.getByText('BTC')).toBeInTheDocument();
    expect(screen.getByText('개')).toBeInTheDocument();
    expect(input).toHaveClass('external');
    expect(input).toHaveAttribute('inputmode', 'decimal');
    expect(ref.current).toBe(input);
  });
});
