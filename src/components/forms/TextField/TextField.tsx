import classNames from 'classnames/bind';
import {
  forwardRef,
  useId,
  type InputHTMLAttributes,
  type ReactNode,
} from 'react';

import styles from './TextField.module.scss';

const cx = classNames.bind(styles);

export interface TextFieldProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'prefix'> {
  label: ReactNode;
  description?: ReactNode;
  error?: ReactNode;
  prefix?: ReactNode;
  suffix?: ReactNode;
}

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(
  function TextField(
    {
      'aria-describedby': ariaDescribedBy,
      'aria-invalid': ariaInvalid,
      className,
      description,
      error,
      id,
      label,
      prefix,
      suffix,
      ...props
    },
    ref,
  ) {
    const generatedId = useId();
    const inputId = id ?? `${generatedId}-input`;
    const descriptionId = description ? `${generatedId}-description` : undefined;
    const errorId = error ? `${generatedId}-error` : undefined;
    const describedBy = [ariaDescribedBy, descriptionId, errorId]
      .filter(Boolean)
      .join(' ') || undefined;

    return (
      <div className={cx('field')}>
        <label className={cx('label')} htmlFor={inputId}>
          {label}
        </label>
        <div className={cx('control', { invalid: Boolean(error) })}>
          {prefix ? <span className={cx('affix')}>{prefix}</span> : null}
          <input
            {...props}
            ref={ref}
            id={inputId}
            className={cx('input', className)}
            aria-describedby={describedBy}
            aria-invalid={error ? true : ariaInvalid}
          />
          {suffix ? <span className={cx('affix')}>{suffix}</span> : null}
        </div>
        {description ? (
          <div id={descriptionId} className={cx('description')}>
            {description}
          </div>
        ) : null}
        {error ? (
          <div id={errorId} className={cx('error')}>
            {error}
          </div>
        ) : null}
      </div>
    );
  },
);
