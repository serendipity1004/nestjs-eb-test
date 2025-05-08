# Node.js LTS 기반 이미지
FROM node:18

# 앱 디렉터리 설정
WORKDIR /usr/src/app

# 패키지 설치
COPY package*.json ./
RUN npm install

# 앱 소스 복사
COPY . .

# 포트 열기
EXPOSE 3000

# 개발용 실행 명령 (ts-node 기반)
CMD ["npm", "run", "start:dev"]
