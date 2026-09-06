import classNames from 'classnames/bind';
import { forwardRef, type ButtonHTMLAttributes } from 'react';

import styles from './Button.module.scss';

const cx = classNames.bind(styles);

export type ButtonVariant = 'primary' | 'secondary' | 'weak' | 'danger';
export type ButtonSize = 'small' | 'medium' | 'large';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  loading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    children,
    className,
    disabled = false,
    fullWidth = false,
    loading = false,
    size = 'medium',
    type = 'button',
    variant = 'primary',
    ...props
  },
  ref,
) {
  return (
    <button
      {...props}
      ref={ref}
      type={type}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      data-variant={variant}
      className={cx('button', variant, size, { fullWidth, loading }, className)}
    >
      <span className={cx('content')}>{children}</span>
      {loading ? <span className={cx('loader')} aria-hidden="true" /> : null}
    </button>
  );
});
