[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/U_KVj9AE)

# 제출자: 최현성 ( 2022204045 )

## 1. Deploy

> `AWS Learner Lab` 실행 시 자동으로 `FE`, `BE` 배포가 시작되므로 **별다른 명령어를 사용할 필요는 없습니다.**

`FE`: [https://assignment3.nararia03.duckdns.org](https://assignment3.nararia03.duckdns.org)

`BE`: [https://assignment3.nararia03.duckdns.org/api](https://assignment3.nararia03.duckdns.org/api)

### 1-1. Deploy 과정

> FE 배포: `NginX` 5002번 포트

- 서빙 폴더: `/var/www/assignment3/frontend/dist`

> BE 배포: `PM2` 3002번 포트

- `pm2 start /var/www/assignment3/backend/app.js`

> Reverse Proxy: `nginx proxy manager`

- `https://assignment3.nararia03.duckdns.org` -> `172.31.85.127:5002`
- `https://assignment3.nararia03.duckdns.org/api` -> `172.31.85.127:3002`
- `https://assignment3.nararia03.duckdns.org/socket.io` -> `172.31.85.127:3002`

---

## 2. How to start

> `git clone`을 사용한 뒤, `프로젝트 루트`까지 들어왔다고 가정합니다.

> FE 패키지 매니저로 `yarn`을 사용했습니다. 혹시라도 문제가 발생한다면, `yarn`을 사용해주세요.
> `npm install -g yarn`

### 2-1. 초기 설정

`frontend`, `backend` 각각 패키지를 설치해줍니다. (`yarn`, `npm`)

`frontend` 폴더 내에 `.env` 파일을 만들고, `VITE_API_URL`과 `VITE_SOCKET_URL`을 기입합니다. 로컬 테스트 용도로는 두 값 모두 `http://localhost:3002`를 사용하면 됩니다.

배포 시 `VITE_SOCKET_URL`은 `wss://`로 시작하는 주소를 넣어줬습니다.

`backend` 폴더 내에 `.env` 파일을 만들고, `MySQL` 관련 민감 정보들과 `PRIVATE_KEY`를 기입합니다.

`PRIVATE_KEY`는 `JWT` 생성에 사용되는 비밀 키입니다. 로컬 테스트 용도로는 아무 값이나 넣어도 됩니다.

```bash
cd frontend
yarn
echo "VITE_API_URL=http://localhost:3002" >> .env

cd ../backend
npm i
# PRIVATE_KEY, ORIGIN, MYSQL_HOST, MYSQL_PORT,
# MYSQL_USERNAME, MYSQL_PASSWORD, MYSQL_DB, MYSQL_LIMIT 환경 변수가 필요합니다.
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

## 3. Assignment1~3 정리

### 랜딩 페이지

<img src="./docs/landing.png" alt="Landing Page" width="800" />

초기 접속 화면입니다. 로그인 / 회원가입 버튼을 누를 수 있습니다.

만약 이미 로그인 된 상태에서 강제로 `/`, `/login`, `/register` 페이지에 접속하면, 자동으로 `/home`으로 이동됩니다.

---

### 회원가입 페이지

<img src="./docs/register.png" alt="Register Page" width="800" />

아이디를 입력 후, ID 확인 버튼을 통해 아이디 중복 여부를 확인합니다.

다음으로 사용할 비밀번호를 두 번 입력합니다.

좌상단 버튼을 통해 랜딩 페이지로 이동할 수 있습니다.

중복 아이디가 존재하지 않고 비밀번호와 비밀번호 확인 입력이 일치하면, 가입하기 버튼이 활성화됩니다.

아이디 / 비밀번호 안내 메시지가 표시되는 순간 발생하는 **Reflow**를 없애기 위해서, 공백문자인 `"\u00A0"`(Non-Breaking Space)를 안내 메시지가 비어있을 때 렌더링했습니다. `<p>{idMsg || "\u00A0"}</p>`

---

### 로그인 페이지

<img src="./docs/login.png" alt="Login Page" width="800" />

아이디와 비밀번호를 입력하고 로그인 버튼을 눌러 로그인 할 수 있습니다.

로그인에 성공하면 `/home`으로 이동합니다.

우측 하단 회원가입 하기 링크를 클릭하면 `/register`로 이동됩니다.

역시 좌상단 버튼을 통해 랜딩 페이지로 이동할 수 있습니다.

---

### 홈 페이지

<div style="width: 800px; display: flex;">
  <img src="./docs/home1.png" alt="Home Page 1" width="400" />
  <img src="./docs/home2.png" alt="Home Page 2"
  width="400" />
</div>

접속 당시 열려 있는 채팅방이 있다면, 우측 이미지와 같이 방 이름과 인원 수, 입장 가능 여부가 나오게 되고, 클릭 시 해당 채팅방에 접속됩니다.

반대로 열려 있는 채팅방이 없다면, 좌측 이미지와 같이 안내가 나오게 됩니다.

채팅방 목록을 받아오는 기능은 소켓이 아닌 API를 통해 구현했습니다. 따라서 새로운 채팅방이 개설되도 자동으로 목록에 추가되지는 않고, 새로고침 버튼을 클릭해야 합니다.

> 채팅방 목록을 받아오는 기능을 API로 구현한 이유는 `/home`에서 만든 Socket 객체를 `/room`으로 이동하면서 유지하기 어려웠기 때문입니다.

채팅방 목록 아래의 input과 채팅방 만들기 버튼을 사용해서 새로운 채팅방을 개설할 수 있습니다.

---

### 룸 페이지

<img src="./docs/room.png" alt="Login Page" width="800" />

상단에는 채팅방 이름이 나오고, 좌상단의 뒤로가기 버튼을 클릭해서 `/home` 으로 이동할 수 있습니다.

좌측에는 본인의 비디오가 나오게 되고, 중앙에는 상대방들의 비디오가 나오며, 우측에는 채팅창을 배치했습니다.

하단에는 비디오 비활성화 / 마이크 음소거 토글 버튼이 있고, 비디오 / 오디오 장치를 변경하는 드롭다운도 존재합니다.

---

## 4. Socket, Web RTC 코드

FE: `/frontend/src/hooks/useSocket.tsx`에 대부분 존재합니다.

BE: `/backend/socketHandler.js`에 모두 존재합니다.

## 5. Use tech stack

**FE**:

- Build: `Vite`
- Language: `TypeScript`
- Framework: `React`
- Routing: `react-router-dom`
- Icon: `react-icons`
- CSS: `tailwindCSS`, `tailwind-scrollbar`
- Http: `axios`
- Websocket: `socket.io-client`
- Time formatting: `date-fns`

**BE**:

- Devtools: `nodemon`
- Language: `JavaScript`
- Framework: `express`
- Cors handling: `cors`
- Database: `mysql`
- Auth: `jsonwebtoken`
- Env: `dotenv`
- Websocket: `socket.io`

**Deploy**:

- FE: `NginX`
- BE: `PM2`
- Reverse Proxy: `nginx proxy manager`
