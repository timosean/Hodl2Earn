import classNames from 'classnames/bind';
import { forwardRef, type CSSProperties, type HTMLAttributes } from 'react';

import styles from './Skeleton.module.scss';

const cx = classNames.bind(styles);

type SkeletonStyle = CSSProperties & {
  '--skeleton-width'?: string;
  '--skeleton-height'?: string;
  '--skeleton-radius'?: string;
};

export interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  width?: number | string;
  height?: number | string;
  radius?: number | string;
}

function toCssSize(value: number | string | undefined): string | undefined {
  return typeof value === 'number' ? `${value}px` : value;
}

export const Skeleton = forwardRef<HTMLDivElement, SkeletonProps>(function Skeleton(
  { className, height, radius, style, width, ...props },
  ref,
) {
  const skeletonStyle: SkeletonStyle = {
    ...style,
    '--skeleton-width': toCssSize(width),
    '--skeleton-height': toCssSize(height),
    '--skeleton-radius': toCssSize(radius),
  };

  return (
    <div
      {...props}
      ref={ref}
      aria-hidden="true"
      className={cx('skeleton', className)}
      style={skeletonStyle}
    />
  );
});
