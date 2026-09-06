import classNames from 'classnames/bind';
import { forwardRef, type HTMLAttributes } from 'react';

import styles from './BottomAction.module.scss';

const cx = classNames.bind(styles);

export interface BottomActionProps extends HTMLAttributes<HTMLDivElement> {}

export const BottomAction = forwardRef<HTMLDivElement, BottomActionProps>(
  function BottomAction({ children, className, ...props }, ref) {
    return (
      <div {...props} ref={ref} className={cx('root', className)}>
        {children}
      </div>
    );
  },
);
