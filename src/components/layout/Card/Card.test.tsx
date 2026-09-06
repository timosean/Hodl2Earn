import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { Card } from './Card';

const stylesPath = resolve(
  process.cwd(),
  'src/components/layout/Card/Card.module.scss',
);

describe('Card', () => {
  it('기본적으로 article로 렌더링하고 속성, 외부 클래스와 ref를 전달한다', () => {
    const ref = { current: null as HTMLElement | null };

    render(
      <Card ref={ref} aria-label="자산 요약" className="external">
        내용
      </Card>,
    );

    const card = screen.getByRole('article', { name: '자산 요약' });
    expect(card).toHaveClass('external');
    expect(ref.current).toBe(card);
  });

  it('pressable이면 실제 button으로 렌더링한다', () => {
    render(<Card pressable>자세히 보기</Card>);

    expect(screen.getByRole('button', { name: '자세히 보기' })).toHaveAttribute(
      'type',
      'button',
    );
  });

  it('pressable이면 네이티브 button 속성과 ref를 전달한다', () => {
    const ref = { current: null as HTMLButtonElement | null };

    render(
      <Card
        ref={ref}
        pressable
        type="submit"
        form="asset-form"
        name="asset-action"
        value="open"
      >
        자세히 보기
      </Card>,
    );

    const card = screen.getByRole('button', { name: '자세히 보기' });
    expect(card).toHaveAttribute('type', 'submit');
    expect(card).toHaveAttribute('form', 'asset-form');
    expect(card).toHaveAttribute('name', 'asset-action');
    expect(card).toHaveValue('open');
    expect(ref.current).toBe(card);
  });

  it('disabled pressable Card는 포인터와 키보드 활성화를 차단한다', async () => {
    const handleClick = vi.fn();
    const user = userEvent.setup();

    render(
      <Card pressable disabled onClick={handleClick}>
        비활성 카드
      </Card>,
    );

    const card = screen.getByRole('button', { name: '비활성 카드' });
    expect(card).toBeDisabled();

    await user.click(card);
    card.focus();
    await user.keyboard('{Enter}');
    await user.keyboard(' ');

    expect(card).not.toHaveFocus();
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('disabled pressable Card에는 눌림 모션을 적용하지 않는다', () => {
    const styles = readFileSync(stylesPath, 'utf8');

    expect(styles).toContain(".pressable:not(:disabled):active");
  });

  it('as로 안전한 비상호작용 요소를 선택한다', () => {
    render(<Card as="section" aria-label="섹션 카드">내용</Card>);

    expect(screen.getByRole('region', { name: '섹션 카드' })).toBeInTheDocument();
  });
});
