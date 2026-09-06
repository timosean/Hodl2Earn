import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Skeleton } from './Skeleton';

describe('Skeleton', () => {
  it('크기와 둥글기를 CSS 변수로 전달하고 보조 기술에서 숨긴다', () => {
    render(<Skeleton data-testid="skeleton" width={120} height="2rem" radius={8} />);

    expect(screen.getByTestId('skeleton')).toHaveStyle({
      '--skeleton-width': '120px',
      '--skeleton-height': '2rem',
      '--skeleton-radius': '8px',
    });
    expect(screen.getByTestId('skeleton')).toHaveAttribute('aria-hidden', 'true');
  });

  it('div 기본 속성, 외부 클래스와 ref를 전달한다', () => {
    const ref = { current: null as HTMLDivElement | null };

    render(<Skeleton ref={ref} className="external" data-testid="skeleton" />);

    expect(screen.getByTestId('skeleton')).toHaveClass('external');
    expect(ref.current).toBe(screen.getByTestId('skeleton'));
  });
});
