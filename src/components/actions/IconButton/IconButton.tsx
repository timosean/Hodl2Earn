import classNames from 'classnames/bind';
import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';

import styles from './IconButton.module.scss';

const cx = classNames.bind(styles);

export type IconButtonVariant = 'primary' | 'secondary' | 'weak';
export type IconButtonSize = 'small' | 'medium' | 'large';

export interface IconButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'aria-label' | 'children'> {
  'aria-label': string;
  icon: ReactNode;
  variant?: IconButtonVariant;
  size?: IconButtonSize;
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  function IconButton(
    {
      'aria-label': ariaLabel,
      className,
      icon,
      size = 'medium',
      type = 'button',
      variant = 'weak',
      ...props
    },
    ref,
  ) {
    return (
      <button
        {...props}
        ref={ref}
        type={type}
        aria-label={ariaLabel}
        data-variant={variant}
        className={cx('button', variant, size, className)}
      >
        <span className={cx('icon')} aria-hidden="true">
          {icon}
        </span>
      </button>
    );
  },
);
