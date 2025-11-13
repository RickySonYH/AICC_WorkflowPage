# [advice from AI] Vite 7은 Node.js 20 이상이 필요하므로 Node 20 LTS 이미지를 사용합니다.
FROM node:20 AS base

WORKDIR /app

# [advice from AI] 의존성 정의 파일을 먼저 복사하여 캐시 효율을 높입니다.
COPY package.json package-lock.json* ./

# [advice from AI] 프로젝트에 필요한 패키지를 설치합니다.
RUN npm install

# [advice from AI] 애플리케이션 소스를 컨테이너로 복사합니다.
COPY . .

# [advice from AI] 서버 포트를 5174로 노출해 호스트와 충돌을 방지합니다.
EXPOSE 5174

# [advice from AI] 변경된 포트로 Vite 개발 서버를 실행합니다.
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "5174"]

