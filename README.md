# Artune 🎵

Artune은 우아한테크코스 8기 프리코스 오픈미션 프로젝트로, 사용자의 감정을 분석하여 맞춤형 음악 플레이리스트와 AI 생성 아트워크를 제공하는 서비스입니다.

## 프로젝트 소개

사용자가 작성한 텍스트를 OpenAI Assistant API로 감정 분석하고, 그 결과를 바탕으로 Spotify 플레이리스트와 DALL-E로 생성한 픽셀 아트를 함께 제공합니다. 감정에 따라 두 가지 옵션(감정 심취 / 감정 완화)을 제공하여 사용자가 원하는 방향으로 음악을 선택할 수 있습니다.

### 주요 기능

- **감정 분석**: OpenAI Assistant API를 활용한 텍스트 감정 분석
- **플레이리스트 큐레이션**: Spotify API를 통한 감정 기반 음악 추천
  - 감정 심취: 현재 감정을 더 깊이 느끼고 싶을 때
  - 감정 완화: 현재 감정을 완화하고 전환하고 싶을 때
- **음악 미리듣기**: 각 플레이리스트의 30초 미리듣기 기능
- **AI 아트워크**: DALL-E로 생성한 플레이리스트 맞춤 픽셀 아트 디저트 & 커피(티) 이미지
- **모바일 목업 UI**: 핸드폰 목업 내에서 토글 형태로 옵션 전환

## 기술 스택

### 아키텍처

- **모노레포**: Turborepo를 활용한 효율적인 멀티 패키지 관리

### Frontend

- **Framework**: React 19.1
- **Build Tool**: Vite 7.1
- **Language**: JavaScript (ES6+)
- **State Management**: Zustand 5.0
- **Styling**: Emotion 11.14

### Backend

- **Framework**: NestJS 11.0
- **Runtime**: Node.js 18+
- **Language**: JavaScript (with Babel transpilation)
- **Testing**: Jest

### 외부 API

- **OpenAI Assistant API**: 텍스트 감정 분석
- **Spotify Web API**: 음악 플레이리스트 검색 및 미리듣기
- **DALL-E API**: AI 픽셀 아트 이미지 생성

### 개발 도구

- **Code Quality**: ESLint, Prettier
- **Version Control**: Git
- **Package Manager**: npm 11.6.2

## 프로젝트 구조

```
artune/
├── apps/
│   ├── backend/          # NestJS 백엔드 서버
│   │   ├── src/
│   │   ├── test/
│   │   └── package.json
│   └── frontend/         # React 프론트엔드
│       ├── src/
│       ├── public/
│       └── package.json
├── package.json          # 루트 패키지 설정
├── turbo.json           # Turborepo 설정
└── README.md
```

## 시작하기

### 사전 요구사항

- Node.js 18 이상
- npm 11.6.2 이상
- OpenAI API 키
- Spotify API 자격증명 (Client ID, Client Secret)

## 개발 가이드

### 코드 스타일

프로젝트는 ESLint와 Prettier를 사용하여 일관된 코드 스타일을 유지합니다.

```bash
# 린트 실행
npm run lint

# 포맷팅
npm run format
```

### 커밋 컨벤션

- `feat`: 새로운 기능 추가
- `fix`: 버그 수정
- `docs`: 문서 수정
- `style`: 코드 포맷팅
- `refactor`: 코드 리팩토링
- `test`: 테스트 코드
- `chore`: 빌드 프로세스, 설정 파일 수정

## 라이센스

이 프로젝트는 우아한테크코스 8기 프리코스 오픈미션 제출용 프로젝트입니다.

## 기여자

- 이세민 ([@isemin](https://github.com/isemin))
