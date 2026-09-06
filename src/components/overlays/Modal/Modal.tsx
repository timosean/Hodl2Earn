import classNames from 'classnames/bind';
import { type HTMLAttributes, type ReactNode, type RefObject, type TransitionEvent, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

import { useBodyScrollLock } from '../shared/useBodyScrollLock';
import { useDialogAccessibility } from '../shared/useDialogAccessibility';
import styles from './Modal.module.scss';

const cx = classNames.bind(styles);

export interface ModalProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  isOpen: boolean;
  close: () => void;
  unmount: () => void;
  closeOnBackdrop?: boolean;
  initialFocusRef?: RefObject<HTMLElement | null>;
  title: ReactNode;
  description?: ReactNode;
  footer?: ReactNode;
}

export function Modal({ isOpen, close, unmount, closeOnBackdrop = true, initialFocusRef, title, description, children, footer, className, onTransitionEnd, ...props }: ModalProps) {
  const { dialogRef, titleId, descriptionId, isTopMost } = useDialogAccessibility({ isOpen, close, initialFocusRef });
  const completed = useRef(false);
  const wasOpen = useRef(isOpen);
  useBodyScrollLock(isOpen || wasOpen.current);

  useEffect(() => {
    if (isOpen) { wasOpen.current = true; completed.current = false; return; }
    if (!wasOpen.current) return;
    const finish = () => { if (!completed.current) { completed.current = true; unmount(); } };
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) { finish(); return; }
    const timer = window.setTimeout(finish, 300);
    return () => window.clearTimeout(timer);
  }, [isOpen, unmount]);

  const finishTransition = (event: TransitionEvent<HTMLDivElement>) => {
    onTransitionEnd?.(event);
    if (event.target === event.currentTarget && wasOpen.current && !isOpen && !completed.current) { completed.current = true; unmount(); }
  };

  return createPortal(
    <div className={cx('root', { open: isOpen, closing: !isOpen })} aria-hidden={!isOpen || undefined}>
      <div data-testid="modal-backdrop" className={cx('backdrop')} onClick={(event) => {
        if (event.target === event.currentTarget && closeOnBackdrop && isOpen && isTopMost()) close();
      }}>
        <div {...props} ref={dialogRef} role="dialog" aria-modal="true" aria-labelledby={titleId} aria-describedby={description ? descriptionId : undefined} tabIndex={-1} className={cx('panel', className)} data-testid="modal-panel" onTransitionEnd={finishTransition}>
          <h2 id={titleId} className={cx('title')}>{title}</h2>
          {description ? <p id={descriptionId} className={cx('description')}>{description}</p> : null}
          {children ? <div className={cx('content')}>{children}</div> : null}
          {footer ? <div className={cx('footer')}>{footer}</div> : null}
        </div>
      </div>
    </div>, document.body,
  );
}
