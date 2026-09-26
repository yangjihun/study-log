> 해당 내용은 Vue.js 기준으로 설명

# Routing
> 네트워크에서 경로를 선택하는 프로세스
> 
> (웹 어플리케이션에서 다른 페이지 간의 전환과 경로를 관리하는 기술)

Routing이 없다면
1. 유저가 URL을 통한 페이지의 변화를 감지할 수 없다.
2. 페이지가 무엇을 렌더링 중인지에 대한 상태를 알 수 없다. (URL이 1개이기 때문에 새로고침 시 처음 페이지로 되돌아감, 링크 공유 시 첫 페이지만 공유 가능)
3. 브라우저의 뒤로 가기 기능을 사용할 수 없다.

SSR에서 Routing은 다음과 같은 방식으로 이루어진다.

<img width="554" height="180" alt="image" src="https://github.com/user-attachments/assets/c2f6c325-fa7c-428b-a565-418204a641e0" />

1. 서버가 사용자가 방문한 URL 경로를 기반으로 응답을 전송
2. 링크를 클릭하면 브라우저는 서버로부터 HTML 응답을 수신하고 새 HTML로 전체 페이지를 다시 로드


CSR/SPA에서의 Routing은 다음과 같은 방식으 이루어진.
<img width="554" height="180" alt="image" src="https://github.com/user-attachments/assets/0bd2b6ac-66b4-49c8-b1bb-bce6dc6694ba" />
1. SPA에서 routing은 브라우저의 클라이언트 측에서 수행
2. 클라이언트 측 JavaScript가 새 데이터를 동적으로 가져와 전체 페이지를 다시 로드하지 않음
3. 페이지는 1개이지만, 링크에 따라 여러 컴포넌트를 렌더링하여 마치 여러 페이지를 사용하는 것처럼 보이도록 해야 함

## routinr 사용 예시
### RoutinrLink
페이지를 다시 로드하지 않고 URL을 변경하고 URL 생성 및 관련 로직을 처리
``` html
<!---App.vue-->
<template>
  <header>
    <nav>
      <RouterLink to="/">Home</RouterLink>
      <RouterLink to="/about">About</RouterLink>
    </nav>
  </header>
  <RouterView />
</template>
<!--
RouterView
- URL에 해당하는 컴포넌트를 표시
- 어디에나 배치하여 레이아웃에 맞출 수 있음
-->
```

## Navigation Guard
> Router를 통해 특정 URL에 접근할 때 다른 URL로 redirect를 하거나 취소하여 네비게이션을 보호

### Navigation Guard 종류
### 1. Globally (전역 가드)
- 어플리케이션 전역에서 동작
- index.js에서 정의

### 2. Per-route (라우터 가드)
- 특정 route에서만 동작
- index.js의 각 routes에 정의
### 3. In-component (컴포넌트 가드)
- 특정 컴포넌트 내에서만 동작
- 컴포넌트 script에 정의

### `router.beforeEach()` - Globally Guard
> 다른 URL로 이동하기 직전에 실행되는 함수 (Global Before Guards)

``` javascript
router.beforeEach((to, from) => {
  ...
  return false
})
```
to : 이동할 URL 정보가 담긴 Route 객체

from : 현재 URL 정보가 담긴 Route 객체

선택적 반환 (return) 값
1. false - 현재 네비게이션을 취소, from 경로의 URL로 재설정
2. Route Location - `router.push()`를 호출하는 것처럼 경로 위치를 전달하여 다른 위치로 redirect

### `router.beforeEnter()` - Per-route Guard
> route에 진입했을 때만 실행되는 함수

매개변수, 쿼리 값이 변경될 때는 실행되지 않고 다른 경로에서 탐색할 때만 실행된다.

``` javascript
// router.beforeEnter 구조
{
  path: '/user/:id',
  name: 'user',
  component: UserView,
  beforeEnter: (to, from) => {
    ...,
    return false
  }
},
```
routes 객체에서 정의

함수의 to, from, 선택 반환 인자는 beforeEach와 동일

### 컴포넌트 가드 종류
`onBeforeRouteLeave`
현재 라우트에서 다른 라우트로 이동하기 전에 실행

사용자가 현재 페이지를 떠나는 동작에 대한 로직을 처리

`onBeforeRouteUpdate`
이미 렌더링된 컴포넌트가 같은 라우트 내에서 업데이트 되기 전에 실행

라우트 업데이트 시 추가적인 로직을 처리







