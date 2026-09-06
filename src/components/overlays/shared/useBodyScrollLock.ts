import { useEffect, useRef } from 'react';

let lockCount = 0;
let previousOverflow = '';

export function useBodyScrollLock(locked: boolean): void {
  const acquiredRef = useRef(false);

  useEffect(() => {
    if (!locked || acquiredRef.current) return;
    if (lockCount === 0) {
      previousOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
    }
    lockCount += 1;
    acquiredRef.current = true;
  }, [locked]);

  useEffect(() => {
    return () => {
      if (!acquiredRef.current) return;
      acquiredRef.current = false;
      lockCount = Math.max(0, lockCount - 1);
      if (lockCount === 0) document.body.style.overflow = previousOverflow;
    };
  }, []);
}
