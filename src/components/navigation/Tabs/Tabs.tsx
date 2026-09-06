import classNames from 'classnames/bind';
import {
  forwardRef,
  useRef,
  type ForwardedRef,
  type HTMLAttributes,
  type KeyboardEvent,
  type ReactElement,
} from 'react';

import styles from './Tabs.module.scss';

const cx = classNames.bind(styles);

export interface TabItem<T extends string> {
  value: T;
  label: string;
}

export interface TabsProps<T extends string>
  extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  items: readonly TabItem<T>[];
  value: T;
  onChange: (value: T) => void;
  'aria-label': string;
}

function TabsInner<T extends string>(
  { className, items, onChange, value, ...props }: TabsProps<T>,
  ref: ForwardedRef<HTMLDivElement>,
) {
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const move = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
    if (items.length === 0) return;

    event.preventDefault();
    const offset = event.key === 'ArrowRight' ? 1 : -1;
    const nextIndex = (index + offset + items.length) % items.length;
    const nextItem = items[nextIndex];

    tabRefs.current[nextIndex]?.focus();
    onChange(nextItem.value);
  };

  return (
    <div {...props} ref={ref} role="tablist" className={cx('tabs', className)}>
      {items.map((item, index) => {
        const selected = item.value === value;

        return (
          <button
            key={item.value}
            ref={(element) => {
              tabRefs.current[index] = element;
            }}
            type="button"
            role="tab"
            className={cx('tab', { selected })}
            aria-selected={selected}
            tabIndex={selected ? 0 : -1}
            onClick={() => onChange(item.value)}
            onKeyDown={(event) => move(event, index)}
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
}

export const Tabs = forwardRef(TabsInner) as <T extends string>(
  props: TabsProps<T> & { ref?: ForwardedRef<HTMLDivElement> },
) => ReactElement;
