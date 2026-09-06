import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Badge } from './Badge';

describe('Badge', () => {
  it.each(['neutral', 'blue', 'green', 'red'] as const)('%s tone을 표시한다', (tone) => {
    render(<Badge tone={tone}>{tone}</Badge>);

    expect(screen.getByText(tone)).toHaveAttribute('data-tone', tone);
  });

  it('span 기본 속성, 외부 클래스와 ref를 전달한다', () => {
    const ref = { current: null as HTMLSpanElement | null };

    render(<Badge ref={ref} className="external" title="상태">완료</Badge>);

    const badge = screen.getByText('완료');
    expect(badge).toHaveClass('external');
    expect(badge).toHaveAttribute('title', '상태');
    expect(ref.current).toBe(badge);
  });
});
