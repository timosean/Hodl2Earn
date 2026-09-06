import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import {
  Badge,
  BottomAction,
  BottomSheet,
  Button,
  Card,
  EmptyState,
  IconButton,
  Modal,
  Select,
  Skeleton,
  Tabs,
  TextField,
  Toast,
  showToast,
  type BadgeProps,
  type BottomActionProps,
  type BottomSheetProps,
  type ButtonProps,
  type CardProps,
  type EmptyStateProps,
  type IconButtonProps,
  type ModalProps,
  type SelectProps,
  type SkeletonProps,
  type TabsProps,
  type TextFieldProps,
  type ToastProps,
} from '.';

type PublicProps =
  | BadgeProps
  | BottomActionProps
  | BottomSheetProps
  | ButtonProps
  | CardProps
  | EmptyStateProps
  | IconButtonProps
  | ModalProps
  | SelectProps
  | SkeletonProps
  | TabsProps<'assets'>
  | TextFieldProps
  | ToastProps;

const acceptsPublicProps = (_props: PublicProps): void => undefined;

describe('컴포넌트 공개 배럴', () => {
  it('오버레이를 제외한 공개 컴포넌트를 배럴에서 렌더링한다', () => {
    acceptsPublicProps({ tone: 'blue' });

    render(
      <>
        <Button>저장</Button>
        <IconButton aria-label="메뉴" icon="≡" />
        <BottomAction>하단 액션</BottomAction>
        <TextField label="금액" />
        <Select label="자산" options={[{ value: 'btc', label: '비트코인' }]} />
        <Card>카드</Card>
        <Tabs
          aria-label="메뉴 탭"
          items={[{ value: 'assets', label: '자산' }]}
          value="assets"
          onChange={vi.fn()}
        />
        <EmptyState title="비어 있음" />
        <Toast isOpen message="저장됨" close={vi.fn()} unmount={vi.fn()} />
        <Badge>상승</Badge>
        <Skeleton data-testid="공개 스켈레톤" />
        <Modal isOpen={false} title="공개 모달" close={vi.fn()} unmount={vi.fn()} />
        <BottomSheet isOpen={false} title="공개 바텀시트" close={vi.fn()} unmount={vi.fn()} />
      </>,
    );

    expect(screen.getByRole('button', { name: '저장' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '메뉴' })).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: '금액' })).toBeInTheDocument();
    expect(screen.getByRole('combobox', { name: '자산' })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: '자산' })).toBeInTheDocument();
    expect(screen.getByRole('status')).toHaveTextContent('저장됨');
    expect(screen.getByTestId('modal-panel')).toBeInTheDocument();
    expect(screen.getByTestId('bottom-sheet-panel')).toBeInTheDocument();
    expect(showToast).toBeTypeOf('function');
  });
});
