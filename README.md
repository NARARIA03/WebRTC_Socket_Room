[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/U_KVj9AE)

# 제출자: 최현성 ( 2022204045 )

## 1. Deploy

> `AWS Learner Lab` 실행 시 자동으로 `FE`, `BE` 배포가 시작되므로 **별다른 명령어를 사용할 필요는 없습니다.**

`FE`:

`BE`:

### 1-1. Deploy 과정

> FE 배포: `NginX`

- 서빙 폴더: `/var/www/assignment3/frontend/dist`

> BE 배포: `PM2`

- `pm2 start /var/www/assignment3/backend/app.js`

---

## 2. How to start

> `git clone`을 사용한 뒤, `프로젝트 루트`까지 들어왔다고 가정합니다.

> FE 패키지 매니저로 `yarn`을 사용했습니다. 혹시라도 문제가 발생한다면, `yarn`을 사용해주세요.
> `npm install -g yarn`

### 2-1. 초기 설정

`frontend`, `backend` 각각 패키지를 설치해줍니다. (`yarn`, `npm`)

`frontend` 폴더 내에 `.env` 파일을 만들고, `VITE_API_URL`을 기입합니다. 로컬 테스트 용도로는 `http://localhost:3001`을 사용하면 됩니다.

`backend` 폴더 내에 `.env` 파일을 만들고, `MySQL` 관련 민감 정보들과 `PRIVATE_KEY`를 기입합니다.

`PRIVATE_KEY`는 `JWT` 생성에 사용되는 비밀 키입니다. 로컬 테스트 용도로는 아무 값이나 넣어도 됩니다.

```bash
cd frontend
yarn
echo "VITE_API_URL=http://localhost:3001" >> .env

cd ../backend
npm i
# BE .env 생성 방법은 명시하지 않겠습니다.
cd ..
```

### 2-2. FE 실행

`frontend` 폴더에서 `yarn dev` 명령어를 사용합니다.

```bash
cd frontend
yarn dev
```

### 2-3. BE 실행

`backend` 폴더에서 `npm start` 명령어를 사용합니다.

```bash
cd backend
npm start
```

---

## 3. Use tech stack

**FE**:

- Vite
- React
- TypeScript
- react-router-dom
- react-icons
- tailwindCSS
- axios

**BE**:

- cors
- express
- mysql
- nodemon
- jsonwebtoken
- dotenv

**Deploy**:

- NginX
- PM2
