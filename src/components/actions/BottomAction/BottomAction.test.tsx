import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { BottomAction } from './BottomAction';

describe('BottomAction', () => {
  it('자식과 기본 div 속성, 외부 클래스와 ref를 전달한다', () => {
    const ref = { current: null as HTMLDivElement | null };

    render(
      <BottomAction ref={ref} aria-label="하단 액션" className="external">
        <button type="button">저장</button>
      </BottomAction>,
    );

    const action = screen.getByLabelText('하단 액션');
    expect(action).toHaveClass('external');
    expect(action).toContainElement(screen.getByRole('button', { name: '저장' }));
    expect(ref.current).toBe(action);
  });
});
