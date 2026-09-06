# Hodl2Earn

CRA 없이 구성한 React, TypeScript, Webpack 스타터 프로젝트입니다. 컴포넌트 스타일은 SCSS 기반 CSS Module과 `classnames/bind`를 사용합니다.

## 요구사항

- Node.js
- Yarn Classic 1.x

## 설치

```bash
yarn install
```

## 개발 서버

```bash
yarn start
```

브라우저에서 `http://localhost:3000`으로 접속합니다.

개발 환경에서 공통 컴포넌트를 시각적으로 확인하려면 다음 경로로 접속합니다.

```text
http://localhost:3000/component-book
```

컴포넌트 북 경로와 코드는 프로덕션 빌드에 포함되지 않습니다.

## 타입 검사

```bash
yarn typecheck
```

## 프로덕션 빌드

```bash
yarn build
```

타입 검사와 프로덕션 빌드를 한 번에 실행하려면 다음 명령을 사용합니다.

```bash
yarn validate
```

`yarn validate`는 타입 검사, 전체 테스트, 프로덕션 빌드를 차례로 실행합니다. 테스트만 실행하려면 `yarn test`, 변경을 감시하며 테스트하려면 `yarn test:watch`를 사용합니다.

## 공통 컴포넌트

공통 컴포넌트는 `src/components` 아래에서 역할별로 관리합니다.

```text
components/
├── actions/       # 버튼과 하단 액션
├── feedback/      # 빈 상태, 배지, 스켈레톤, 토스트
├── forms/         # 입력과 선택
├── layout/        # 카드
├── navigation/    # 탭
├── overlays/      # 모달과 바텀시트
└── index.ts       # 컴포넌트와 공개 Props 타입 배럴
```

애플리케이션에서는 `src/components/index.ts`의 단일 공개 배럴을 통해 컴포넌트와 Props 타입을 가져옵니다.

`src/componentBook.tsx`는 모든 변형과 상태, `overlay-kit` 사용 예시를 모아 둔 개발용 타입 검증 파일입니다. 앱 진입점이나 라우트에서 가져오지 않으므로 프로덕션 번들에는 포함되지 않습니다.
