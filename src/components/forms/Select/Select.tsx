import classNames from 'classnames/bind';
import {
  forwardRef,
  useId,
  type ReactNode,
  type SelectHTMLAttributes,
} from 'react';

import styles from './Select.module.scss';

const cx = classNames.bind(styles);

export interface SelectOption {
  value: string | number;
  label: ReactNode;
  disabled?: boolean;
}

export interface SelectProps
  extends SelectHTMLAttributes<HTMLSelectElement> {
  label: ReactNode;
  description?: ReactNode;
  error?: ReactNode;
  options: readonly SelectOption[];
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  {
    'aria-describedby': ariaDescribedBy,
    'aria-invalid': ariaInvalid,
    className,
    description,
    error,
    id,
    label,
    options,
    ...props
  },
  ref,
) {
  const generatedId = useId();
  const selectId = id ?? `${generatedId}-select`;
  const descriptionId = description ? `${generatedId}-description` : undefined;
  const errorId = error ? `${generatedId}-error` : undefined;
  const describedBy = [ariaDescribedBy, descriptionId, errorId]
    .filter(Boolean)
    .join(' ') || undefined;

  return (
    <div className={cx('field')}>
      <label className={cx('label')} htmlFor={selectId}>
        {label}
      </label>
      <div className={cx('control', { invalid: Boolean(error) })}>
        <select
          {...props}
          ref={ref}
          id={selectId}
          className={cx('select', className)}
          aria-describedby={describedBy}
          aria-invalid={error ? true : ariaInvalid}
        >
          {options.map((option) => (
            <option
              key={String(option.value)}
              value={option.value}
              disabled={option.disabled}
            >
              {option.label}
            </option>
          ))}
        </select>
        <span className={cx('indicator')} aria-hidden="true" />
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
});
