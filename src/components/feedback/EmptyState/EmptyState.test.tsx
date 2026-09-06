import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { EmptyState } from './EmptyState';

describe('EmptyState', () => {
  it('제목과 선택적으로 제공된 요소만 보여준다', () => {
    const { rerender } = render(<EmptyState title="보유 코인이 없어요" />);

    expect(screen.getByRole('heading', { name: '보유 코인이 없어요' })).toBeInTheDocument();
    expect(screen.queryByText('목록 설명')).not.toBeInTheDocument();

    rerender(
      <EmptyState
        icon={<span aria-label="빈 지갑">○</span>}
        title="보유 코인이 없어요"
        description="목록 설명"
        action={<button type="button">추가하기</button>}
      />,
    );

    expect(screen.getByLabelText('빈 지갑')).toBeInTheDocument();
    expect(screen.getByText('목록 설명')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '추가하기' })).toBeInTheDocument();
  });
});
