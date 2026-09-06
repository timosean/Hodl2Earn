# Hodl2Earn 프로젝트 지침

## 프로젝트 목적

보유 코인 목록을 관리하고 가정한 추가 매수 조건에 따른 변경 평단가를 계산하는 모바일 웹이다.

## 공통 기술

- TypeScript와 React를 사용한다.
- 패키지 관리는 Yarn Classic, 번들링은 Webpack을 사용한다.
- 스타일은 SCSS CSS Module과 `classnames/bind`를 사용한다.

## 작업 및 Git 원칙

- 로컬 작업 경로는 `/Users/seungwoo/Projects/Hodl2Earn`이며 별도 worktree를 만들지 않는다.
- 병합은 rebase 기반의 선형 기록을 기본으로 한다.
- 모든 Markdown 문서는 한글로 작성한다.

## 명령어와 완료 기준

- `yarn install`: 프로젝트 의존성을 설치한다.
- `yarn start`: 로컬 개발 서버를 실행한다.
- `yarn typecheck`: TypeScript 타입 오류를 검사한다.
- `yarn build`: 배포용 번들을 생성한다.
- `yarn validate`: 타입 검사와 빌드를 한 번에 검증한다.
- 작업을 완료하기 전에 `yarn validate`를 실행하고 성공을 확인한다.
