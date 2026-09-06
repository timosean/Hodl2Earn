# Hodl2Earn 에이전트 지침 구현 계획

> **에이전트 작업자용:** 필수 하위 스킬: 이 계획을 작업별로 구현할 때 `superpowers:subagent-driven-development`(권장) 또는 `superpowers:executing-plans`를 사용한다. 진행 상황은 체크박스(`- [ ]`)로 추적한다.

**목표:** 프로젝트 공통 규칙, 소스 공통 규칙, 포트폴리오 규칙, 계산기 규칙을 경로별 `AGENTS.md`로 분리한다.

**아키텍처:** 루트 규칙을 하위 경로가 상속하는 계층형 구조를 사용한다. 각 파일은 자기 경로에 필요한 규칙만 소유하며 다른 기능의 도메인 규칙을 반복하지 않는다.

**기술 스택:** Markdown, React, TypeScript, Yarn Classic, Webpack, SCSS CSS Module

**설계 문서:** `docs/superpowers/specs/2026-09-06-agents-guidelines-design.md`

## 전역 제약사항

- 모든 Markdown 문서는 한글로 작성한다.
- `/Users/seungwoo/Projects/Hodl2Earn` 로컬 저장소에서 작업한다.
- 별도 worktree를 만들지 않는다.
- 병합은 rebase 기반 선형 기록을 기본으로 한다.
- 기존 애플리케이션 코드는 이동하거나 수정하지 않는다.

---

### 작업 1: 저장소 및 소스 공통 지침 작성

**파일:**
- 생성: `AGENTS.md`
- 생성: `src/AGENTS.md`

**인터페이스:**
- 입력: 저장소 전체와 `src/` 아래의 작업
- 출력: 프로젝트 전체 정책과 프런트엔드 공통 정책

- [ ] **1단계: 지침 파일이 아직 없음을 확인**

실행: `rg --files -g 'AGENTS.md'`

예상 결과: 아무 파일도 출력되지 않는다.

- [ ] **2단계: 루트 `AGENTS.md` 작성**

다음 섹션을 실제 문장과 명령어로 작성한다.

```markdown
# Hodl2Earn 프로젝트 지침

## 프로젝트 목적
보유 코인 목록을 관리하고 가정한 추가 매수 조건에 따른 변경 평단가를 계산하는 모바일 웹이다.

## 공통 기술
TypeScript, React, Yarn Classic, Webpack, SCSS CSS Module, classnames/bind를 사용한다.

## 작업 및 Git 원칙
지정된 로컬 경로에서 worktree 없이 작업하며 rebase 기반 선형 기록을 유지한다. Markdown은 한글로 작성한다.

## 명령어와 완료 기준
yarn install, yarn start, yarn typecheck, yarn build, yarn validate의 목적과 완료 전 검증 의무를 설명한다.
```

- [ ] **3단계: `src/AGENTS.md` 작성**

다음 규칙을 문장으로 작성한다.

```markdown
# 프런트엔드 소스 지침

## UI
모바일 전용 단일 열 화면이며 넓은 화면에서도 모바일 너비를 유지한다.

## 코드 구조
엄격한 TypeScript 타입을 사용하고 UI, 도메인 계산, 영속성 로직을 분리한다.

## 스타일
컴포넌트는 *.module.scss와 classnames/bind를 사용하고 전역 스타일은 최소화한다.

## 정밀도와 문구
금액·수량 정밀도 정책을 명시하고 사용자 문구와 오류는 한글로 작성한다.
```

- [ ] **4단계: 공통 지침 자체 검사**

실행: `rg -n '모바일|classnames/bind|yarn validate|rebase' AGENTS.md src/AGENTS.md`

예상 결과: 각 규칙이 소유 파일에서 검색되고 기능 전용 계산식은 검색되지 않는다.

### 작업 2: 기능별 지침 작성

**파일:**
- 생성: `src/features/portfolio/AGENTS.md`
- 생성: `src/features/calculator/AGENTS.md`

**인터페이스:**
- 입력: 각 기능 디렉터리 아래의 향후 구현 작업
- 출력: 포트폴리오 데이터 규칙과 평단가 계산 규칙

- [ ] **1단계: 포트폴리오 지침 작성**

다음 내용을 `src/features/portfolio/AGENTS.md`에 작성한다.

```markdown
# 포트폴리오 기능 지침

## 책임
보유 코인의 등록·수정·삭제와 모바일 카드 목록을 담당한다.

## 데이터 규칙
티커를 대문자로 정규화하고 KRW/USD만 허용하며 티커+통화 중복을 금지한다.

## 저장소
버전이 있는 localStorage 데이터를 저장소 인터페이스 뒤에 두고 향후 API 교체를 지원한다.

## 표시
티커, 통화, 평단가, 수량, 총 매수금액을 표시하며 환율 변환과 비중 차트는 제외한다.
```

- [ ] **2단계: 계산기 지침 작성**

다음 내용을 `src/features/calculator/AGENTS.md`에 작성한다.

```markdown
# 평단가 계산기 기능 지침

## 입력
저장 코인을 선택하고 가정 매수 단가를 직접 입력한다. 투자 금액 입력을 우선하며 수량 입력도 지원한다.

## 정밀도와 수수료
수량은 소수점 8자리까지 지원하고 기본 수수료율 0.05%를 수정할 수 있다. 투자 금액은 수수료 포함 총지출액이다.

## 계산
수수료 = 투자 금액 × 수수료율
실제 매수 금액 = 투자 금액 × (1 - 수수료율)
추가 수량 = 실제 매수 금액 ÷ 매수 단가
변경 후 총수량 = 기존 수량 + 추가 수량
변경 후 총투자금 = 기존 평단가 × 기존 수량 + 투자 금액
변경 후 평단가 = 변경 후 총투자금 ÷ 변경 후 총수량

## 결과
평단가와 증감, 총수량·총투자금, 수수료, 실제 매수 금액, 추가 수량을 같은 통화로 표시하고 투자 권유로 표현하지 않는다.
```

- [ ] **3단계: 기능 규칙의 분리 검사**

실행:

```bash
rg -n 'localStorage|중복' src/features/portfolio/AGENTS.md
rg -n '0.05%|변경 후 평단가' src/features/calculator/AGENTS.md
rg -n '변경 후 평단가' src/features/portfolio/AGENTS.md
```

예상 결과: 첫 두 명령은 성공하고 마지막 명령은 결과가 없어 종료 코드 1을 반환한다.

### 작업 3: 전체 검증 및 커밋

**파일:**
- 검증: `AGENTS.md`
- 검증: `src/AGENTS.md`
- 검증: `src/features/portfolio/AGENTS.md`
- 검증: `src/features/calculator/AGENTS.md`

**인터페이스:**
- 입력: 네 경로의 지침 계층
- 출력: 검증된 한글 에이전트 지침 커밋

- [ ] **1단계: 파일 구조와 금지된 미완성 표현 검사**

실행:

```bash
rg --files -g 'AGENTS.md'
rg -n '미정|추후 작성|내용 필요' AGENTS.md src
```

예상 결과: 네 파일이 출력되고 미완성 표현은 검색되지 않는다.

- [ ] **2단계: 기존 프로젝트 회귀 검증**

실행:

```bash
git diff --check
yarn validate
```

예상 결과: 공백 오류, TypeScript 오류, Webpack 빌드 오류가 없다.

- [ ] **3단계: 변경 사항 커밋**

```bash
git add AGENTS.md src/AGENTS.md src/features/portfolio/AGENTS.md src/features/calculator/AGENTS.md
git commit -m "docs: 기능별 에이전트 지침 추가"
```

- [ ] **4단계: 최종 상태 확인**

실행: `git status --short --branch`

예상 결과: 커밋되지 않은 변경이 없다.
