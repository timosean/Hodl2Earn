import { describe, expect, it } from 'vitest';

import { isComponentBookRoute } from './routing';

describe('isComponentBookRoute', () => {
  it('개발 환경의 컴포넌트 북 경로만 허용한다', () => {
    expect(isComponentBookRoute('/component-book', true)).toBe(true);
    expect(isComponentBookRoute('/component-book/', true)).toBe(true);
    expect(isComponentBookRoute('/', true)).toBe(false);
  });

  it('프로덕션 환경에서는 컴포넌트 북 경로를 허용하지 않는다', () => {
    expect(isComponentBookRoute('/component-book', false)).toBe(false);
  });
});
