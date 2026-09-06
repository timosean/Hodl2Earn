import classNames from 'classnames/bind';
import { overlay } from 'overlay-kit';
import { useState } from 'react';

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
  showToast,
} from './components';
import styles from './componentBook.module.scss';

const cx = classNames.bind(styles);

const tabItems = [
  { value: 'portfolio', label: '보유 자산' },
  { value: 'calculator', label: '평단가 계산' },
] as const;

function openModal() {
  overlay.open(({ isOpen, close, unmount }) => (
    <Modal
      isOpen={isOpen}
      close={close}
      unmount={unmount}
      title="자산을 삭제할까요?"
      description="삭제한 자산은 복구할 수 없어요."
      footer={
        <div className={cx('buttonRow')}>
          <Button variant="weak" fullWidth onClick={close}>취소</Button>
          <Button variant="danger" fullWidth onClick={close}>삭제</Button>
        </div>
      }
    />
  ));
}

function openBottomSheet() {
  overlay.open(({ isOpen, close, unmount }) => (
    <BottomSheet
      isOpen={isOpen}
      close={close}
      unmount={unmount}
      title="자산 선택"
      description="추가할 자산을 골라 주세요."
    >
      <div className={cx('stack')}>
        <Button variant="weak" fullWidth onClick={close}>비트코인</Button>
        <Button variant="weak" fullWidth onClick={close}>이더리움</Button>
      </div>
    </BottomSheet>
  ));
}

export function ComponentBook() {
  const [tab, setTab] = useState<(typeof tabItems)[number]['value']>('portfolio');

  return (
    <main className={cx('page')}>
      <header className={cx('header')}>
        <p className={cx('eyebrow')}>Hodl2Earn</p>
        <h1 className={cx('title')}>모바일 컴포넌트 북</h1>
        <p className={cx('description')}>공개 API의 변형과 상태를 한 화면에서 확인합니다.</p>
      </header>

      <section className={cx('section')}>
        <h2 className={cx('sectionTitle')}>액션</h2>
        <div className={cx('stack')}>
          {(['primary', 'secondary', 'weak', 'danger'] as const).map((variant) => (
            <Button key={variant} variant={variant} fullWidth>{variant}</Button>
          ))}
          <div className={cx('row')}>
            <Button size="small">작게</Button>
            <Button size="medium">보통</Button>
            <Button size="large">크게</Button>
          </div>
          <div className={cx('row')}>
            <Button loading>처리 중</Button>
            <Button disabled>비활성</Button>
          </div>
          <div className={cx('row')}>
            <IconButton aria-label="추가" icon="＋" variant="primary" />
            <IconButton aria-label="새로 고침" icon="↻" variant="secondary" />
            <IconButton aria-label="더 보기" icon="•••" variant="weak" />
          </div>
          <BottomAction className={cx('inlineAction')}>
            <Button fullWidth>하단 액션 미리보기</Button>
          </BottomAction>
        </div>
      </section>

      <section className={cx('section')}>
        <h2 className={cx('sectionTitle')}>폼과 탐색</h2>
        <div className={cx('stack')}>
          <TextField label="매수 금액" description="원 단위로 입력해 주세요." suffix="원" inputMode="numeric" placeholder="0" />
          <TextField label="보유 수량" error="수량을 입력해 주세요." prefix="BTC" inputMode="decimal" />
          <TextField label="비활성 입력" value="수정할 수 없음" disabled readOnly />
          <Select label="자산" description="보유 자산을 선택해 주세요." defaultValue="btc" options={[{ value: 'btc', label: '비트코인' }, { value: 'eth', label: '이더리움' }]} />
          <Select label="통화" error="통화를 선택해 주세요." defaultValue="" options={[{ value: '', label: '선택' }, { value: 'krw', label: '원화' }]} />
          <Tabs aria-label="기능 선택" items={tabItems} value={tab} onChange={setTab} />
        </div>
      </section>

      <section className={cx('section')}>
        <h2 className={cx('sectionTitle')}>카드와 피드백</h2>
        <div className={cx('stack')}>
          <Card>
            <strong>기본 카드</strong>
            <p className={cx('muted')}>정보를 안정적으로 묶어 보여줍니다.</p>
          </Card>
          <Card pressable>눌림 가능한 카드</Card>
          <div className={cx('row')}>
            {(['neutral', 'blue', 'green', 'red'] as const).map((tone) => <Badge key={tone} tone={tone}>{tone}</Badge>)}
          </div>
          <div className={cx('skeletons')}>
            <Skeleton width={48} height={48} radius="50%" />
            <div className={cx('skeletonText')}>
              <Skeleton width="55%" height={16} />
              <Skeleton width="100%" height={12} />
            </div>
          </div>
          <EmptyState icon="◇" title="아직 보유 자산이 없어요" description="첫 자산을 추가해 포트폴리오를 시작하세요." action={<Button size="small">자산 추가</Button>} />
        </div>
      </section>

      <section className={cx('section')}>
        <h2 className={cx('sectionTitle')}>오버레이</h2>
        <div className={cx('stack')}>
          <Button variant="secondary" fullWidth onClick={openModal}>모달 열기</Button>
          <Button variant="secondary" fullWidth onClick={openBottomSheet}>바텀시트 열기</Button>
          <div className={cx('row')}>
            <Button size="small" variant="weak" onClick={() => showToast({ message: '저장했어요.' })}>기본 토스트</Button>
            <Button size="small" variant="weak" onClick={() => showToast({ message: '추가했어요.', tone: 'success' })}>성공 토스트</Button>
            <Button size="small" variant="weak" onClick={() => showToast({ message: '다시 시도해 주세요.', tone: 'error' })}>오류 토스트</Button>
          </div>
        </div>
      </section>
    </main>
  );
}
