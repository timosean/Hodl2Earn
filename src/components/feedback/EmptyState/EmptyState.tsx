import classNames from 'classnames/bind';
import type { ReactNode } from 'react';

import styles from './EmptyState.module.scss';

const cx = classNames.bind(styles);

export interface EmptyStateProps {
  icon?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <section className={cx('emptyState')}>
      {icon ? <div className={cx('icon')}>{icon}</div> : null}
      <h2 className={cx('title')}>{title}</h2>
      {description ? <p className={cx('description')}>{description}</p> : null}
      {action ? <div className={cx('action')}>{action}</div> : null}
    </section>
  );
}
