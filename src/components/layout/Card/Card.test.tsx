import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Card } from './Card';

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

  it('as로 안전한 비상호작용 요소를 선택한다', () => {
    render(<Card as="section" aria-label="섹션 카드">내용</Card>);

    expect(screen.getByRole('region', { name: '섹션 카드' })).toBeInTheDocument();
  });
});
