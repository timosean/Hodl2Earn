import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { describe, expect, it } from 'vitest';

const tokensPath = resolve(process.cwd(), 'src/styles/tokens.scss');

describe('디자인 토큰', () => {
  it('핵심 색상과 컨트롤 크기를 CSS 변수로 제공한다', () => {
    const tokens = readFileSync(tokensPath, 'utf8');

    expect(tokens).toContain('--color-blue-500: #3182f6');
    expect(tokens).toContain('--color-grey-900: #191f28');
    expect(tokens).toContain('--touch-target-min: 44px');
    expect(tokens).toContain('--control-height: 48px');
  });

  it('눌림과 복귀 모션 시간을 CSS 변수로 제공한다', () => {
    const tokens = readFileSync(tokensPath, 'utf8');

    expect(tokens).toContain('--motion-press-duration: 100ms');
    expect(tokens).toContain('--motion-release-duration: 180ms');
  });
});
