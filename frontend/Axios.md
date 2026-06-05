## Axios
Axios는 브라우저와 Node.js 환경 모두에서 사용할 수 있는 Promise 기반 HTTP 비동기 통신 라이브러리이다.

### Axios 특징
1. Promise 기반
`async/await`랑 같이 쓰게 좋다.
``` typescript
const response = await axios.get("/users");
console.log(response.data);
```
비동기 APi 호출 코드를 비교적 깔끔하게 작성할 수 있다.

2. JSON 자동 처리
요청 body를 JSON으로 보내거나, 응답 JSON을 JavaScript 객체로 바꾸는 처리를 편하게 해준다.
``` typescript
await axios.post("/users", {
  name: "jihun",
  email: ""jihun@example.com",
});
```
`fetch`를 쓰면 아래와 같이 직접 처리해야한다.
``` typescript
await fetch("/users", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    name: "jihun",
    email: "jihun@example.com",
  }),
});
```

3. 인터셉터 지원
요청을 보내기 전이나 응답을 받은 후에 공통 로직을 추가할 수 있다.
``` typescript
// JWT 토큰을 모든 요청에 자동으로 추가한 예시 코드
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});
```

4. axios 인스턴스 생성 가능
API 서버 주소, timeout, header 같은 설정을 공통으로 묶을 수 있다.
``` typescript
const axiosInstance = axios.create({
  baseURL: "http://localhost:8080/api",
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
  },
});
```

5. HTTP 에러 처리
fetch는 HTTP 404나 500이어도 Promise 자체가 reject되지 않는다.

`fetch()` Promise는 네트워크 실패 같은 경우에만 reject되고, HTTP 에러 상태는 직접 `Response.ok`나 `Response.status`로 확인해야 한다.

Axios는 HTTP 에러 응답을 `catch`에서 다루기 좋다.
``` typescript
try {
  const response = await axios.get("/users");
  console.log(response.data);
} catch (error: any) {
  if (error.response) {
    console.log("서버 응답 에러:", error.response.status);
  } else if (error.request) {
    console.log("응답 없음");
  } else {
    console.log("요청 설정 에러:", error.message);
  }
}
```

### Axios 사용 방법
1. axios 설치
``` bash
npm install axios
```

2. API 인스턴스 만들기
``` typescript
// src/api/axiosInstance.ts
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:8080/api",
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
  },
});

// 요청 인터셉터
axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("accessToken");

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 응답 인터셉터
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      console.error("응답 에러:", error.response.status, error.response.data);
    } else if (error.request) {
      console.error("요청은 보냈지만 응답 없음:", error.request);
    } else {
      console.error("요청 설정 중 에러:", error.message);
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
```

3. API 함수 분리
``` typescript
// src/api/userApi.ts
import axiosInstance from "./axiosInstance";

export interface User {
  id: number;
  name: string;
  email: string;
}

export interface CreateUserRequest {
  name: string;
  email: string;
}

// 회원 목록 조회
export const getUsers = async (): Promise<User[]> => {
  const response = await axiosInstance.get<User[]>("/users");
  return response.data;
};

// 회원 단건 조회
export const getUserById = async (userId: number): Promise<User> => {
  const response = await axiosInstance.get<User>(`/users/${userId}`);
  return response.data;
};

// 회원 생성
export const createUser = async (
  data: CreateUserRequest
): Promise<User> => {
  const response = await axiosInstance.post<User>("/users", data);
  return response.data;
};

// 회원 삭제
export const deleteUser = async (userId: number): Promise<void> => {
  await axiosInstance.delete(`/users/${userId}`);
};
```

4. React 컴포넌트에서 사용
``` typescript
// src/pages/UserPage.tsx
import { useEffect, useState } from "react";
import { createUser, getUsers, User } from "../api/userApi";

function UserPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const fetchUsers = async () => {
    try {
      const data = await getUsers();
      setUsers(data);
    } catch (error) {
      console.error("회원 목록 조회 실패:", error);
    }
  };

  const handleCreateUser = async () => {
    try {
      await createUser({
        name,
        email,
      });

      setName("");
      setEmail("");

      fetchUsers();
    } catch (error) {
      console.error("회원 생성 실패:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div>
      <h1>회원 목록</h1>

      <div>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="이름"
        />

        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="이메일"
        />

        <button onClick={handleCreateUser}>회원 생성</button>
      </div>

      <ul>
        {users.map((user) => (
          <li key={user.id}>
            {user.name} / {user.email}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default UserPage;
```
핵심 흐름은 아래와 같다.
```
컴포넌트
  ↓
API 함수 호출
  ↓
axiosInstance 사용
  ↓
요청 인터셉터에서 토큰 추가
  ↓
백엔드 API 요청
  ↓
응답 인터셉터에서 공통 에러 처리
  ↓
response.data 반환
```

폴더 구조
```
src/
 ├─ api/
 │   ├─ axiosInstance.ts
 │   └─ userApi.ts
 ├─ pages/
 │   └─ UserPage.tsx
 └─ App.tsx
```
### Axios 장점
- `get`,`post`,`put`,`delete` 등 직관적인 메서드
- JSON 처리 (요청/응답 JSON 변환을 편하게 처리한다)
- 토큰 추가, 401 처리, 공통 에러 처리가 편리
- 서버별 `baseURL`,`header`,`timeout` 설정, 즉 인스턴스 관리가 가능
- 브라우저와 Node.js 환경 모두 지원

### Axios 단점
- `npm install axios`로 별도 설치 필요
- 요청이 단순하다면 오버엔지니어링 발생 가능
- 라이브러리 의존성 발생
- SSR/쿠키 인증 시 `withCredentials`, CORS, 쿠키 전달 설정을 주의

### Axios를 사용하면 좋은 경우
- JWT 토큰을 모든 요청에 자동으로 붙일 때
- access token 만료 시 refresh token으로 재발급해야 할 때
- API 에러 처리를 공통으로 관리할 때
- baseURL, timeout, header를 공통 설정할 때
- API 함수를 분리하고 싶을 때









