# React Webpack 스타터 설계

## 목표

Create React App을 사용하지 않고 최소 구성의 React 프로젝트를 만든다. 프로젝트는 TypeScript, Yarn Classic, Webpack, SCSS 기반 CSS Module 및 `classnames/bind`를 사용한다.

## 범위

초기 애플리케이션은 제목과 짧은 설명이 있는 간단한 시작 화면만 표시한다. 개발 서버, 타입 검사, 프로덕션 빌드에 필요한 설정을 포함하며 라우팅, 상태 관리 라이브러리, 테스트 프레임워크 및 애플리케이션 전용 기능은 추가하지 않는다.

## 도구 구성

- React와 React DOM을 UI 런타임으로 사용한다.
- Webpack 5는 `src/index.tsx`를 진입점으로 애플리케이션을 번들링하여 `dist/`에 출력한다.
- Babel은 `@babel/preset-env`, `@babel/preset-react`, `@babel/preset-typescript`를 사용해 TypeScript와 JSX를 변환한다.
- TypeScript는 `tsc --noEmit` 명령으로 정적 타입 검사를 별도로 수행한다.
- `webpack-dev-server`는 개발 빌드를 제공하며 브라우저의 History API 대체 경로를 지원한다.
- `HtmlWebpackPlugin`은 `public/index.html`을 템플릿으로 출력 HTML을 생성한다.
- `MiniCssExtractPlugin`은 프로덕션 빌드에서 스타일을 별도 CSS 파일로 추출한다.

## 스타일링

Webpack에서 모듈 스타일과 전역 스타일이 섞이지 않도록 SCSS 규칙을 분리한다.

- `*.module.scss` 파일은 CSS Module을 활성화한 `css-loader`와 `sass-loader`로 처리한다.
- 그 외 `*.scss` 파일은 CSS Module을 활성화하지 않은 `css-loader`와 `sass-loader`로 처리한다.
- 개발 환경에서는 `style-loader`를 사용해 두 종류의 스타일을 문서에 주입한다.
- 프로덕션 환경에서는 `MiniCssExtractPlugin.loader`를 사용해 두 종류의 스타일을 추출한다.
- 개발 환경에서는 알아보기 쉬운 모듈 클래스 이름을 사용하고, 프로덕션 환경에서는 콘텐츠 해시가 포함된 이름을 사용한다.
- TypeScript가 `*.module.scss` 가져오기를 인식하도록 타입 선언을 추가한다.
- React 컴포넌트는 `classnames/bind`로 가져온 모듈 클래스를 바인딩한다.

## 프로젝트 구조

```text
.
├── public/
│   └── index.html
├── src/
│   ├── App.module.scss
│   ├── App.tsx
│   ├── global.scss
│   ├── index.tsx
│   └── styles.d.ts
├── .babelrc.json
├── .gitignore
├── package.json
├── README.md
├── tsconfig.json
└── webpack.config.cjs
```

## 빌드 동작

개발 설정에서는 소스 맵, `style-loader`, Webpack 개발 서버를 사용한다. 프로덕션 설정에서는 Webpack 최적화를 활성화하고, CSS와 JavaScript 파일명에 콘텐츠 해시를 적용하며, 빌드 전에 `dist/`를 정리한다. 소스 코드에서는 `.ts`, `.tsx`, `.js` 확장자를 생략하여 가져올 수 있다.

## 명령어

- `yarn start`: 개발 서버를 실행한다.
- `yarn build`: `dist/`에 프로덕션 번들을 생성한다.
- `yarn typecheck`: 파일을 출력하지 않고 TypeScript 타입 검사를 실행한다.
- `yarn check`: 타입 검사 후 프로덕션 빌드를 실행한다.

## 오류 처리

Webpack은 개발 중 모듈, 로더 및 Sass 컴파일 오류를 화면과 터미널에 표시하며, 프로덕션 빌드에서는 오류 발생 시 0이 아닌 종료 코드를 반환한다. Babel은 타입 검사 없이 코드를 변환하므로 타입 오류는 별도의 타입 검사 명령에서 보고한다.

## 검증

Yarn Classic으로 의존성을 설치한 후 다음 절차로 검증한다.

1. `yarn typecheck`를 실행하고 TypeScript 오류가 없는지 확인한다.
2. `yarn build`를 실행하고 Webpack이 HTML, JavaScript 및 추출된 CSS를 `dist/`에 생성하는지 확인한다.
3. 생성된 자산을 살펴보고 모듈 스타일과 전역 스타일이 모두 포함되었는지 확인한다.

