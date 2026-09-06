import classNames from 'classnames/bind';
import { overlay } from 'overlay-kit';
import { useEffect, useRef } from 'react';

import styles from './Toast.module.scss';

const cx = classNames.bind(styles);

export type ToastTone = 'neutral' | 'success' | 'error';

export interface ToastProps {
  isOpen: boolean;
  message: string;
  tone?: ToastTone;
  duration?: number;
  close: () => void;
  unmount: () => void;
}

export type ShowToastOptions = Pick<ToastProps, 'message' | 'tone' | 'duration'>;

export function Toast({
  isOpen,
  message,
  tone = 'neutral',
  duration = 3000,
  close,
  unmount,
}: ToastProps) {
  const wasOpenRef = useRef(isOpen);

  useEffect(() => {
    if (!isOpen) {
      if (wasOpenRef.current) {
        unmount();
      }
      return undefined;
    }

    wasOpenRef.current = true;
    const timeoutId = window.setTimeout(close, duration);
    return () => window.clearTimeout(timeoutId);
  }, [close, duration, isOpen, unmount]);

  if (!isOpen) {
    return null;
  }

  return (
    <div className={cx('viewport')}>
      <div className={cx('toast', tone)} data-tone={tone} role="status">
        {message}
      </div>
    </div>
  );
}

export function showToast(options: ShowToastOptions): void {
  overlay.open(({ isOpen, close, unmount }) => (
    <Toast {...options} isOpen={isOpen} close={close} unmount={unmount} />
  ));
}
