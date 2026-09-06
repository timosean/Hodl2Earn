import classNames from 'classnames/bind';
import { forwardRef, type HTMLAttributes } from 'react';

import styles from './Badge.module.scss';

const cx = classNames.bind(styles);

export type BadgeTone = 'neutral' | 'blue' | 'green' | 'red';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: BadgeTone;
}

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(function Badge(
  { children, className, tone = 'neutral', ...props },
  ref,
) {
  return (
    <span {...props} ref={ref} className={cx('badge', tone, className)} data-tone={tone}>
      {children}
    </span>
  );
});
