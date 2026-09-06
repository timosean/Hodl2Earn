import classNames from 'classnames/bind';
import { forwardRef, type ForwardedRef, type HTMLAttributes } from 'react';

import styles from './Card.module.scss';

const cx = classNames.bind(styles);

export type CardElement = 'article' | 'div' | 'section';

export interface CardProps extends HTMLAttributes<HTMLElement> {
  as?: CardElement;
  pressable?: boolean;
}

export const Card = forwardRef<HTMLElement, CardProps>(function Card(
  {
    as = 'article',
    children,
    className,
    pressable = false,
    ...props
  },
  ref,
) {
  if (pressable) {
    return (
      <button
        {...props}
        ref={ref as ForwardedRef<HTMLButtonElement>}
        type="button"
        className={cx('card', 'pressable', className)}
      >
        {children}
      </button>
    );
  }

  if (as === 'div') {
    return (
      <div
        {...props}
        ref={ref as ForwardedRef<HTMLDivElement>}
        className={cx('card', className)}
      >
        {children}
      </div>
    );
  }

  if (as === 'section') {
    return (
      <section {...props} ref={ref} className={cx('card', className)}>
        {children}
      </section>
    );
  }

  return (
    <article
      {...props}
      ref={ref}
      className={cx('card', className)}
    >
      {children}
    </article>
  );
});
