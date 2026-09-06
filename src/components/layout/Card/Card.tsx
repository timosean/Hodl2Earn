import classNames from 'classnames/bind';
import {
  forwardRef,
  type ButtonHTMLAttributes,
  type ForwardedRef,
  type HTMLAttributes,
  type ReactElement,
  type RefAttributes,
} from 'react';

import styles from './Card.module.scss';

const cx = classNames.bind(styles);

export type CardElement = 'article' | 'div' | 'section';

export interface StaticCardProps extends HTMLAttributes<HTMLElement> {
  as?: CardElement;
  pressable?: false;
}

export interface PressableCardProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  as?: never;
  pressable: true;
}

export type CardProps = StaticCardProps | PressableCardProps;

interface CardComponent {
  (
    props: PressableCardProps & RefAttributes<HTMLButtonElement>,
  ): ReactElement | null;
  (props: StaticCardProps & RefAttributes<HTMLElement>): ReactElement | null;
}

const CardBase = forwardRef<HTMLElement, CardProps>(function Card(
  props,
  ref,
) {
  if (props.pressable) {
    const {
      children,
      className,
      pressable: _pressable,
      type = 'button',
      ...buttonProps
    } = props;

    return (
      <button
        {...buttonProps}
        ref={ref as ForwardedRef<HTMLButtonElement>}
        type={type}
        className={cx('card', 'pressable', className)}
      >
        {children}
      </button>
    );
  }

  const {
    as = 'article',
    children,
    className,
    pressable: _pressable,
    ...staticProps
  } = props;

  if (as === 'div') {
    return (
      <div
        {...staticProps}
        ref={ref as ForwardedRef<HTMLDivElement>}
        className={cx('card', className)}
      >
        {children}
      </div>
    );
  }

  if (as === 'section') {
    return (
      <section {...staticProps} ref={ref} className={cx('card', className)}>
        {children}
      </section>
    );
  }

  return (
    <article
      {...staticProps}
      ref={ref}
      className={cx('card', className)}
    >
      {children}
    </article>
  );
});

export const Card = CardBase as CardComponent;
