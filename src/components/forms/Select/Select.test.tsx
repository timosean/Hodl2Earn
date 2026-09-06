import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import { Select } from './Select';

describe('Select', () => {
  it('라벨과 설명·오류를 연결하고 네이티브 옵션을 렌더링한다', async () => {
    const user = userEvent.setup();

    render(
      <Select
        label="자산"
        description="보유 자산을 선택해 주세요"
        error="자산을 선택해야 합니다"
        options={[
          { value: '', label: '선택' },
          { value: 'btc', label: '비트코인' },
        ]}
      />,
    );

    const select = screen.getByRole('combobox', { name: '자산' });
    await user.click(screen.getByText('자산'));

    expect(select).toHaveFocus();
    expect(select.tagName).toBe('SELECT');
    expect(screen.getByRole('option', { name: '비트코인' })).toHaveValue('btc');
    expect(select).toHaveAttribute('aria-invalid', 'true');
    expect(select).toHaveAccessibleDescription(
      '보유 자산을 선택해 주세요 자산을 선택해야 합니다',
    );
  });

  it('기본 select 속성, 외부 클래스와 ref를 전달한다', () => {
    const ref = { current: null as HTMLSelectElement | null };

    render(
      <Select
        ref={ref}
        label="통화"
        options={[{ value: 'krw', label: '원화' }]}
        name="currency"
        className="external"
      />,
    );

    const select = screen.getByRole('combobox', { name: '통화' });
    expect(select).toHaveClass('external');
    expect(select).toHaveAttribute('name', 'currency');
    expect(ref.current).toBe(select);
  });
});
