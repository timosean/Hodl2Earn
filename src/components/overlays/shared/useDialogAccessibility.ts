import { type RefObject, useEffect, useId, useLayoutEffect, useRef } from 'react';

interface OverlayEntry {
  id: symbol;
  dialog: HTMLElement;
  restoreTarget: HTMLElement | null;
}

const overlayStack: OverlayEntry[] = [];
const focusableSelector = [
  'a[href]', 'button:not([disabled])', 'input:not([disabled])',
  'select:not([disabled])', 'textarea:not([disabled])',
  '[tabindex]', '[contenteditable]:not([contenteditable="false"])',
  'audio[controls]', 'video[controls]', 'summary',
].join(',');

function isVisible(element: HTMLElement, dialog: HTMLElement): boolean {
  if (element.matches(':disabled') || element.closest('fieldset:disabled')) return false;
  if (element instanceof HTMLInputElement && element.type === 'hidden') return false;
  if (element.closest('[hidden], [aria-hidden="true"], [inert]')) return false;

  let current: HTMLElement | null = element;
  while (current) {
    const style = window.getComputedStyle(current);
    if (
      style.display === 'none'
      || style.visibility === 'hidden'
      || style.visibility === 'collapse'
      || style.contentVisibility === 'hidden'
    ) return false;
    if (current === dialog) break;
    current = current.parentElement;
  }
  return true;
}

function getFocusableElements(dialog: HTMLElement): HTMLElement[] {
  return Array.from(dialog.querySelectorAll<HTMLElement>(focusableSelector))
    .filter((element) => element.tabIndex >= 0 && isVisible(element, dialog));
}

export interface DialogAccessibilityOptions {
  isOpen: boolean;
  close: () => void;
  initialFocusRef?: RefObject<HTMLElement | null>;
}

export function useDialogAccessibility({ isOpen, close, initialFocusRef }: DialogAccessibilityOptions) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const overlayId = useRef(Symbol('overlay'));
  const closeRef = useRef(close);
  const previouslyFocusedRef = useRef<HTMLElement | null>(null);
  const restoreTargetRef = useRef<HTMLElement | null>(null);
  const titleId = useId();
  const descriptionId = useId();

  const isTopMost = () => overlayStack[overlayStack.length - 1]?.id === overlayId.current;
  closeRef.current = close;

  useLayoutEffect(() => {
    if (!isOpen) return;
    previouslyFocusedRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const id = overlayId.current;

    const dialog = dialogRef.current;
    if (!dialog) return;
    overlayStack.push({ id, dialog, restoreTarget: previouslyFocusedRef.current });
    const focusable = dialog ? getFocusableElements(dialog) : [];
    const requestedInitial = initialFocusRef?.current;
    const initial = requestedInitial
      && dialog?.contains(requestedInitial)
      && requestedInitial.matches(focusableSelector)
      && requestedInitial.tabIndex >= 0
      && isVisible(requestedInitial, dialog)
      ? requestedInitial
      : focusable[0] ?? dialog;
    initial?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (!isTopMost()) return;
      if (event.key === 'Escape') {
        event.preventDefault();
        closeRef.current();
        return;
      }
      if (event.key !== 'Tab' || !dialog) return;
      const focusable = getFocusableElements(dialog);
      if (focusable.length === 0) {
        event.preventDefault(); dialog.focus(); return;
      }
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const focusIsOutside = !dialog.contains(document.activeElement);
      if (event.shiftKey && (document.activeElement === first || focusIsOutside)) {
        event.preventDefault(); last.focus();
      } else if (!event.shiftKey && (document.activeElement === last || focusIsOutside)) {
        event.preventDefault(); first.focus();
      }
    };
    document.addEventListener('keydown', onKeyDown);

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      const index = overlayStack.findIndex((entry) => entry.id === id);
      if (index < 0) return;
      const removed = overlayStack[index];
      const wasTopMost = index === overlayStack.length - 1;
      for (let upperIndex = index + 1; upperIndex < overlayStack.length; upperIndex += 1) {
        const upper = overlayStack[upperIndex];
        if (upper.restoreTarget && removed.dialog.contains(upper.restoreTarget)) {
          upper.restoreTarget = removed.restoreTarget;
        }
      }
      overlayStack.splice(index, 1);
      restoreTargetRef.current = wasTopMost ? removed.restoreTarget : null;
    };
  }, [initialFocusRef, isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    return () => {
      const restoreTarget = restoreTargetRef.current;
      restoreTargetRef.current = null;
      if (restoreTarget?.isConnected) restoreTarget.focus();
    };
  }, [isOpen]);

  return { dialogRef, titleId, descriptionId, isTopMost };
}
