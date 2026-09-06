# React Webpack 스타터 구현 계획

> **에이전트 작업자용:** 필수 하위 스킬: 이 계획을 작업별로 구현할 때 `superpowers:subagent-driven-development`(권장) 또는 `superpowers:executing-plans`를 사용한다. 진행 상황은 체크박스(`- [ ]`)로 추적한다.

**목표:** CRA 없이 TypeScript, Yarn Classic, Webpack, SCSS 기반 CSS Module 및 `classnames/bind`를 사용하는 최소 React 프로젝트를 만든다.

**아키텍처:** Webpack 5가 React 진입점과 스타일을 개발·프로덕션 파이프라인으로 묶는다. Babel이 TypeScript와 JSX를 변환하고, `tsc --noEmit`이 타입을 별도로 검사한다. SCSS는 파일명에 따라 CSS Module과 전역 스타일 규칙으로 분리하고 프로덕션에서는 CSS 파일로 추출한다.

**기술 스택:** React, React DOM, TypeScript, Yarn Classic, Webpack 5, Babel, Sass, CSS Modules, `classnames/bind`

**설계 문서:** `docs/superpowers/specs/2026-09-06-react-webpack-starter-design.md`

## 전역 제약사항

- Create React App을 사용하지 않는다.
- 패키지 관리자는 Yarn Classic 1.x를 사용한다.
- 애플리케이션 코드는 TypeScript와 TSX로 작성한다.
- 빌드 도구는 Webpack 5를 사용한다.
- 컴포넌트 스타일은 `*.module.scss`와 `classnames/bind`를 사용한다.
- Babel은 코드 변환만 담당하고 타입 검사는 `tsc --noEmit`으로 분리한다.
- 모든 Markdown 문서는 한글로 작성한다.

---

## 파일 구성과 책임

- `package.json`: 명령과 의존성을 정의한다.
- `yarn.lock`: 설치된 의존성 버전을 고정한다.
- `.babelrc.json`: JavaScript, JSX, TypeScript 변환을 설정한다.
- `tsconfig.json`: 엄격한 TypeScript 타입 검사를 설정한다.
- `webpack.config.cjs`: 번들, 로더, 플러그인, 개발 서버를 설정한다.
- `public/index.html`: HTML 템플릿을 제공한다.
- `src/styles.d.ts`: SCSS Module 타입을 선언한다.
- `src/index.tsx`: React 앱을 문서에 마운트한다.
- `src/App.tsx`: 최소 시작 화면을 렌더링한다.
- `src/App.module.scss`: 앱 전용 모듈 스타일을 제공한다.
- `src/global.scss`: 문서 전체 기본 스타일을 제공한다.
- `.gitignore`: 생성물과 임시 파일을 제외한다.
- `README.md`: 한글 사용 방법을 설명한다.

### 작업 1: 빌드 도구 구성

**파일:**
- 생성: `package.json`
- 생성: `.babelrc.json`
- 생성: `tsconfig.json`
- 생성: `webpack.config.cjs`
- 생성: `.gitignore`

**인터페이스:**
- 입력: `src/index.tsx`, `public/index.html`, SCSS 파일
- 출력: `yarn start`, `yarn typecheck`, `yarn build`, `yarn validate` 및 `dist/`

- [ ] **1단계: 실행 환경 확인**

실행: `node --version && yarn --version`

예상 결과: Node.js 버전과 Yarn `1.x` 버전이 출력된다.

- [ ] **2단계: 프로젝트 명령이 아직 없음을 확인**

실행: `yarn typecheck`

예상 결과: `package.json` 또는 스크립트가 없어 실패한다.

- [ ] **3단계: `package.json` 작성**

```json
{
  "name": "hodl2earn",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "start": "webpack serve --mode development",
    "build": "webpack --mode production",
    "typecheck": "tsc --noEmit",
    "validate": "yarn typecheck && yarn build"
  },
  "dependencies": {
    "classnames": "^2.5.1",
    "react": "^19.0.0",
    "react-dom": "^19.0.0"
  },
  "devDependencies": {
    "@babel/core": "^7.0.0",
    "@babel/preset-env": "^7.0.0",
    "@babel/preset-react": "^7.0.0",
    "@babel/preset-typescript": "^7.0.0",
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0",
    "babel-loader": "^10.0.0",
    "css-loader": "^7.0.0",
    "html-webpack-plugin": "^5.0.0",
    "mini-css-extract-plugin": "^2.0.0",
    "sass": "^1.0.0",
    "sass-loader": "^16.0.0",
    "style-loader": "^4.0.0",
    "typescript": "^5.0.0",
    "webpack": "^5.0.0",
    "webpack-cli": "^6.0.0",
    "webpack-dev-server": "^5.0.0"
  }
}
```

- [ ] **4단계: Babel과 TypeScript 설정 작성**

`.babelrc.json`:

```json
{
  "presets": [
    ["@babel/preset-env", { "targets": "defaults" }],
    ["@babel/preset-react", { "runtime": "automatic" }],
    "@babel/preset-typescript"
  ]
}
```

`tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["DOM", "DOM.Iterable", "ES2020"],
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    "strict": true,
    "skipLibCheck": true,
    "jsx": "react-jsx",
    "noEmit": true
  },
  "include": ["src"]
}
```

- [ ] **5단계: Webpack 설정 작성**

`webpack.config.cjs`:

```javascript
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = (_, argv) => {
  const isProduction = argv.mode === 'production';
  const styleLoader = isProduction
    ? MiniCssExtractPlugin.loader
    : 'style-loader';

  return {
    entry: path.resolve(__dirname, 'src/index.tsx'),
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: isProduction
        ? 'assets/js/[name].[contenthash:8].js'
        : 'bundle.js',
      clean: true,
      publicPath: '/',
    },
    devtool: isProduction ? 'source-map' : 'eval-cheap-module-source-map',
    resolve: { extensions: ['.tsx', '.ts', '.js'] },
    module: {
      rules: [
        {
          test: /\.[jt]sx?$/,
          exclude: /node_modules/,
          use: 'babel-loader',
        },
        {
          test: /\.module\.scss$/i,
          use: [
            styleLoader,
            {
              loader: 'css-loader',
              options: {
                modules: {
                  namedExport: false,
                  localIdentName: isProduction
                    ? '[hash:base64:8]'
                    : '[name]__[local]--[hash:base64:5]',
                },
                importLoaders: 1,
                sourceMap: true,
              },
            },
            {
              loader: 'sass-loader',
              options: { sourceMap: true },
            },
          ],
        },
        {
          test: /\.scss$/i,
          exclude: /\.module\.scss$/i,
          use: [
            styleLoader,
            {
              loader: 'css-loader',
              options: {
                modules: false,
                importLoaders: 1,
                sourceMap: true,
              },
            },
            {
              loader: 'sass-loader',
              options: { sourceMap: true },
            },
          ],
        },
      ],
    },
    plugins: [
      new HtmlWebpackPlugin({ template: 'public/index.html' }),
      ...(isProduction
        ? [
            new MiniCssExtractPlugin({
              filename: 'assets/css/[name].[contenthash:8].css',
            }),
          ]
        : []),
    ],
    devServer: {
      static: path.resolve(__dirname, 'public'),
      historyApiFallback: true,
      hot: true,
      port: 3000,
      open: false,
    },
  };
};
```

두 SCSS 규칙은 `*.module.scss`를 CSS Module로 처리하고 그 외 `*.scss`를 전역 스타일로 처리한다. 개발에서는 `style-loader`, 프로덕션에서는 `MiniCssExtractPlugin.loader`를 선택한다.

- [ ] **6단계: Git 제외 규칙 작성**

`.gitignore`:

```gitignore
node_modules/
dist/
*.log
.DS_Store
.idea/
.vscode/
```

- [ ] **7단계: 의존성 설치와 설정 구문 확인**

실행:

```bash
yarn install
node --check webpack.config.cjs
```

예상 결과: `yarn.lock`이 생성되고 구문 검사가 성공한다.

- [ ] **8단계: 빌드 도구 구성 커밋**

```bash
git add package.json yarn.lock .babelrc.json tsconfig.json webpack.config.cjs .gitignore
git commit -m "build: React Webpack 도구 구성"
```

### 작업 2: 최소 React 화면과 SCSS Module 구현

**파일:**
- 생성: `public/index.html`
- 생성: `src/styles.d.ts`
- 생성: `src/index.tsx`
- 생성: `src/App.tsx`
- 생성: `src/App.module.scss`
- 생성: `src/global.scss`

**인터페이스:**
- 입력: Webpack의 `src/index.tsx` 진입점과 Babel의 자동 JSX 런타임
- 출력: `#root`에 마운트되는 `App` 컴포넌트와 `.page`, `.card`, `.title`, `.description` 클래스

- [ ] **1단계: 소스가 없어 타입 검사가 실패하는지 확인**

실행: `yarn typecheck`

예상 결과: `tsconfig.json`의 입력 파일이 없어 실패한다.

- [ ] **2단계: HTML과 스타일 타입 선언 작성**

`public/index.html`:

```html
<!doctype html>
<html lang="ko">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content="React Webpack TypeScript 스타터" />
    <title>Hodl2Earn</title>
  </head>
  <body>
    <div id="root"></div>
  </body>
</html>
```

`src/styles.d.ts`:

```typescript
declare module '*.module.scss' {
  const classes: Readonly<Record<string, string>>;
  export default classes;
}
```

- [ ] **3단계: React 진입점과 앱 컴포넌트 작성**

`src/index.tsx`:

```tsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import App from './App';
import './global.scss';

const container = document.getElementById('root');

if (!container) {
  throw new Error('React 루트 요소를 찾을 수 없습니다.');
}

createRoot(container).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
```

`src/App.tsx`:

```tsx
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
```

- [ ] **4단계: 전역 및 모듈 스타일 작성**

`src/global.scss`:

```scss
* {
  box-sizing: border-box;
}

html {
  color-scheme: dark;
  font-family: Inter, ui-sans-serif, system-ui, -apple-system,
    BlinkMacSystemFont, "Segoe UI", sans-serif;
  background: #0f172a;
}

body {
  margin: 0;
}

button,
input,
textarea,
select {
  font: inherit;
}
```

`src/App.module.scss`:

```scss
.page {
  display: grid;
  min-height: 100vh;
  place-items: center;
  padding: 24px;
}

.card {
  width: min(100%, 560px);
  padding: 48px;
  border: 1px solid rgb(148 163 184 / 25%);
  border-radius: 24px;
  background: rgb(30 41 59 / 80%);
  box-shadow: 0 24px 80px rgb(0 0 0 / 25%);
  text-align: center;
}

.title {
  margin: 0;
  color: #f8fafc;
  font-size: clamp(2rem, 7vw, 3.5rem);
  line-height: 1.1;
}

.description {
  margin: 20px 0 0;
  color: #cbd5e1;
  font-size: 1.125rem;
  line-height: 1.7;
}
```

- [ ] **5단계: 타입 검사와 프로덕션 빌드 실행**

실행: `yarn validate`

예상 결과: TypeScript 오류가 없고 Webpack이 `dist/index.html` 및 콘텐츠 해시가 적용된 JavaScript와 CSS를 생성한다.

- [ ] **6단계: 두 종류의 SCSS가 산출물에 포함됐는지 확인**

```bash
find dist -maxdepth 4 -type f -print
rg "box-sizing|place-items" dist/assets/css
```

예상 결과: HTML, JavaScript, CSS와 소스 맵 파일이 보이고 CSS에서 전역 스타일의 `box-sizing`과 모듈 스타일의 `place-items`가 모두 검색된다.

- [ ] **7단계: 화면 구현 커밋**

```bash
git add public src
git commit -m "feat: 최소 React 시작 화면 추가"
```

### 작업 3: 한글 사용 문서와 최종 검증

**파일:**
- 생성: `README.md`

**인터페이스:**
- 입력: `package.json`의 Yarn 스크립트
- 출력: 설치, 개발, 타입 검사, 빌드 방법을 설명하는 한글 문서

- [ ] **1단계: `README.md` 작성**

다음 내용을 작성한다.

    # Hodl2Earn

    CRA 없이 구성한 React, TypeScript, Webpack 스타터 프로젝트입니다.
    컴포넌트 스타일은 SCSS 기반 CSS Module과 `classnames/bind`를 사용합니다.

    ## 요구사항

    - Node.js
    - Yarn Classic 1.x

    ## 설치

        yarn install

    ## 개발 서버

        yarn start

    브라우저에서 `http://localhost:3000`으로 접속합니다.

    ## 타입 검사

        yarn typecheck

    ## 프로덕션 빌드

        yarn build

    타입 검사와 빌드를 한 번에 실행하려면 `yarn validate`를 사용합니다.

- [ ] **2단계: 전체 검증 재실행**

```bash
yarn validate
git diff --check
git status --short
```

예상 결과: 타입 검사와 빌드가 성공하고 공백 오류가 없으며 `README.md`만 커밋되지 않은 상태다.

- [ ] **3단계: 문서 커밋**

```bash
git add README.md
git commit -m "docs: 프로젝트 사용 방법 추가"
```

- [ ] **4단계: 최종 상태 확인**

```bash
yarn validate
git status --short
```

예상 결과: 타입 검사와 프로덕션 빌드가 성공하고 작업 트리가 깨끗하다.
