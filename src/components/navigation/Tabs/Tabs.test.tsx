import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { Tabs } from './Tabs';

const items = [
  { value: 'portfolio', label: '보유 자산' },
  { value: 'calculator', label: '평단가 계산' },
  { value: 'history', label: '기록' },
] as const;

describe('Tabs', () => {
  it('활성 탭만 선택 가능 순서에 두고 클릭으로 변경한다', async () => {
    const handleChange = vi.fn();
    const user = userEvent.setup();

    render(
      <Tabs
        aria-label="자산 메뉴"
        items={items}
        value="portfolio"
        onChange={handleChange}
      />,
    );

    expect(screen.getByRole('tablist', { name: '자산 메뉴' })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: '보유 자산' })).toHaveAttribute(
      'aria-selected',
      'true',
    );
    expect(screen.getByRole('tab', { name: '보유 자산' })).toHaveAttribute(
      'tabindex',
      '0',
    );
    expect(screen.getByRole('tab', { name: '평단가 계산' })).toHaveAttribute(
      'tabindex',
      '-1',
    );

    await user.click(screen.getByRole('tab', { name: '평단가 계산' }));
    expect(handleChange).toHaveBeenCalledWith('calculator');
  });

  it('좌우 화살표로 순환 이동하며 탭을 선택한다', async () => {
    const handleChange = vi.fn();
    const user = userEvent.setup();

    render(
      <Tabs
        aria-label="자산 메뉴"
        items={items}
        value="portfolio"
        onChange={handleChange}
      />,
    );

    const firstTab = screen.getByRole('tab', { name: '보유 자산' });
    firstTab.focus();
    await user.keyboard('{ArrowLeft}');

    expect(screen.getByRole('tab', { name: '기록' })).toHaveFocus();
    expect(handleChange).toHaveBeenLastCalledWith('history');

    await user.keyboard('{ArrowRight}');
    expect(firstTab).toHaveFocus();
    expect(handleChange).toHaveBeenLastCalledWith('portfolio');
  });

  it('기본 div 속성, 외부 클래스와 ref를 전달한다', () => {
    const ref = { current: null as HTMLDivElement | null };

    render(
      <Tabs
        ref={ref}
        aria-label="자산 메뉴"
        items={items}
        value="portfolio"
        onChange={() => undefined}
        className="external"
        data-testid="tabs"
      />,
    );

    expect(screen.getByTestId('tabs')).toHaveClass('external');
    expect(ref.current).toBe(screen.getByTestId('tabs'));
  });
});
