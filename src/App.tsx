import classNames from 'classnames/bind';

import styles from './App.module.scss';

const cx = classNames.bind(styles);

export default function App() {
  return (
    <main className={cx('page')}>
      <section className={cx('card')}>
        <h1 className={cx('title')}>React Webpack Starter</h1>
        <p className={cx('description')}>
          TypeScript와 CSS Module 설정이 완료되었습니다.
        </p>
      </section>
    </main>
  );
}
