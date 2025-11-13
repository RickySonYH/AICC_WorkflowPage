# AICC 시나리오 빌더 프론트엔드

Docker 컨테이너에서 Vite 개발 서버를 실행해 UI를 바로 확인할 수 있도록 구성한 프로젝트입니다. 아래 가이드를 따라 환경을 준비하고 실행하세요.

## 1. 요구 사항

- Docker & Docker Compose 설치
- 포트 `5173` 사용 가능 상태 확인

## 2. 실행 방법

```bash
# 프로젝트 루트에서 이미지 빌드 및 컨테이너 실행
docker compose up --build
```

- 브라우저에서 `http://localhost:5174` 접속
- 코드 변경 시 컨테이너가 자동으로 반영 (볼륨 마운트 설정)

종료 시에는 `Ctrl + C`로 중단하거나 다음 명령을 실행하세요.

```bash
docker compose down
```

## 3. 폴더 구조

- `Dockerfile`: Vite 개발 서버용 Node 18 베이스 이미지 정의
- `docker-compose.yml`: 개발용 서비스(포트/볼륨/환경 변수) 선언
- `src/`: React + TypeScript 기반 UI 코드
- `src/data/mockData.ts`: 화면 시연을 위한 더미 데이터

## 4. 기타

- 컨테이너 내에서 Vite는 `npm run dev -- --host 0.0.0.0 --port 5174`로 실행됩니다.
- 추가 패키지 설치가 필요하면 `docker compose run --rm web npm install <package>` 명령을 사용하세요.
