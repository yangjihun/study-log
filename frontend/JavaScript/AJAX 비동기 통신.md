### AJAX (Asynchronous JavaScript and XML)

> 페이지를 새로고침하지 않고 브라우저가 서버에 비동기 요청을 보내 데이터만 받아 화면 일부를 갱신하는 방식

서버와 통신을 하기 위해서 `XMLHttpRequest` 객체를 활용하며 JSON, XML, HTML, txt 형식 등을 포함한 다양한 포맷을 주고 받을 수 있다.

### 동기 (Synchronous)

> 서버가 요청한 데이터가 도착할 때까지 클라이언트는 대기

### 비동기 (Asynchronous)

> 서버에 요청한 데이터가 도착할 동안 클라이언트는 멈추지 않고 동작

### 순차적인 비동기 처리
**Async Callbacks** : 백그라운드에서 실행을 시작할 함수를 호출할 때 인자로 지정

``` JavaScript
// 예시 코드

setTimeout(() => {
  console.log("B");
  setTimeout(() => console.log("C"), 300);
}, 500);
```

**Promise-Style** : Modern Web APIs에서의 새로운 코드 스타일


``` JavaScript
// 예시 코드

wait(500)
  .then(() => {
    console.log("B");
    return wait(300);
  })
  .then(() => console.log("C"))
  .catch(console.error);
```

### XMLHttpRequest 객체
> AJAX 요청을 생성하는 JavaScript API

서버와 상호작용하기 위해 사용된다.

대부분의 브라우저에서 지원하고 XML이라는 이름과 달리 모든 종류의 데이터를 받아 오는데 사용 가능하다.

**XMLHttpRequest 객체의 메서드 (method)**
``` JavaScript
open("HTTP method", "URL", sync/async)
```
- 요청의 초기화 작업
- GET / POST 지정
- 서버 URL 지정
- 동기/비동기 설정

``` JavaScript
send(content)


// - GET 방식은 URL에 필요 정보를 추가하기 때문에 null 사용
// - POST 방식에서 파라미터 설정 처리
```

### XMLHttpRequest 프로퍼티 (Property)
``` JavaScript
onreadystatechange

// - 서버에서 응답이 도착했을 때 호출될 콜백함수 지정
// - 콜백함수는 상태(readyState)가 변경될 때마다 호출
```

``` JavaScript
readyState
```

| 0  |  UNSENT | 객체 생성 후 open 메서드 호출 전  |
|----|---------|-----------|
| 1 | OPENED | open 메서드가 호출되고 send 호출 전 |
| 2 | HEADERS_RECEIVED | send 메서드가 호출되었지만 서버 응답 전, 헤더와 상태 확인 가능 |
| 3 | LOADING | 다운로드 중, 데이터의 일부가 전송된 상태 |
| 4 | DONE | 모든 데이터 전송 완료 |

### XMLHttpRequest 프로퍼티 (Property)

status
- 서버 처리 결과 상태 코드

|  범위  |  이름  | 의미 | 대표 예시 |
|--------|--------|------|-----------|
|100-199 |Informational|진행/정보 응답|100 Continue|
|200-299 |Success|요청 성공|200 OK, 201 Created, 204 No Content|
|300-399 | Redirection | 다른 위치로 이동/재요청 필요 | 301 Moved Permanently, 302 Found, 304 Not Modified |
|400-499 | Client Error | 잘못된 요청 | 400 Bad Request, 401 Unauthorized, 403 Forbidden, 404 Not Found |
|500-599 | Server Error | 서버 오류 | 500 Internal Server Error, 502 Bad Gateway,  503 Service Unavailable |


responseText
- 서버의 응답결과를 문자열로 받기

responseXML
- 서버의 응답결과를 XML Document로 받기

### AJAX 프로그래밍 순서
1. 클라이언트 이벤트 발생
2. XMLHttpRequest 객체 생성
3. XMLHttpRequest 객체 콜백함수 설정
4. XMLHttpRequest 객체를 통한 비동기화 요청
5. 서버 응답결과를 생성하여 클라이언트로 전송
6. XMLHttpRequest 객체는 서버 결과를 처리할 콜백함수 호출
7. 결과를 클라이언트 화면에 반영

**1. 클라이언트 이벤트 발생**
이벤트 발생 -> 사용자가 버튼을 클릭 시 js함수 - requestMsg를 호출한다.

``` html
<input id="myBtn" type="button" value="서버에 자료 요청"> // 표준 방식
<input type="button" value="서버에 자료 요청" onclick="requestMsg()"> // 고전 방식
```

``` JavaScript
const myBtn = document.getElementById("myBtn");
myBtn.addEventListener("click", requestMsg);
```

``` JavaScript
function requestMsg() {
  ... // 구현부
}
```

**2. XMLHttpRequest 객체 생성**
requestMsg 함수 구현부에 작성

``` JavaScript
let xhr = new XMLHttpRequest();
console.log(xhr);
console.log("UNSENT", xhr.readyState); // readyState: 0
```

**3. XMLHttpRequest 콜백함수 설정**
onreadystatechange에 콜백함수의 이름 지정
``` JavaScript
xhr.onreadystatechange = responseMsg
console.log(xhr)
console.log(xhr.onreadystatechange)
```

**4. XMLHttpRequest 객체를 통한 비동기화 요청**
open 메서드에 요청방식, 호출페이지 등록

``` JavaScript
xhr.open("GET", "profile.json", true);
console.log("OPENED", xhr.readyState) // readyState: 1
```
send 메서드로 전송
``` JavaScript
xhr.send(null);
console.log('*STILL OPENED', xhr.readyState) // readyState: 1
```

**5,6,7. 서버 응답 결과를 처리할 콜백함수 호출**
readyState가 4이면 모든 데이터 전송 완료
state가 200이면 서버 데이터 요청 결과 성공
결과 출력

``` JavaScript
if (xhr.readyState == 4) {
  console.log('DONE', xhr.readyState) // readyState: 4
  if (xhr.status == 200) {
    let msg = document.getElementById("msg")
    msg.innerHTML += xhr.responseText
  }
}
```

### Promise
비동기 작업의 결과(성공/실패)를 나중에 다루기 위한 객체

``` JavaScript
new Promise ( function (resolve, reject) {} )

resolve // - 성공 시 사용
reject  // - 실패 시 사용
```

``` JavaScript
const promise = new Promise((resolve, reject) => {
  resolve('resolve'); // -> then 부분을 실행
  // reject('reject');
  }
)

promise
  .then((data) => {
    console.log(data);
  })
  .catch((data) => {
    console.log(data);
  })
```

### Promise Methods
`.then(callback)`

Promise 객체를 리턴하고 두 개의 콜백 함수를 인수로 받는다. (이행 했을 때, 거부했을 때)

콜백 함수는 이전 작업의 성공 결과를 인자로 전달 받는다.

`.catch(callback)`

.then이 하나라도 실패하면 (거부 되면) 동작 (예외 처리 구문 유사)

이전 작업의 실패로 인해 생성된 error 객체는 catch 블록 안에서 사용 가능

`.finally(callback)`

Promise 객체 반환

결과 상관없이 무조건 실행

### fetch API
>HTTP 응답을 나타내는 Response 객체를 래핑한 Promise 객체를 반환

BOM (Browser Object Model) 객체 중 하나로, XMLHttpRequest보다 강력하고 유연한 조작이 가능하다.

Promise를 지원하므로 콜백 패턴에서 자유롭다.

### fetch 메서드
- resource : 리소스가 위치한 URL 지정
- options : 옵션을 지정
  - method : HTTP method
  - headers : 요청 헤더 지정
  - body : 요청 본문 지정
- fetch 메서드는 Promise 객체를 반환

### fetch() 가 반환하는 Promise 객체
- 성공 시 then()을 이용해 처리
- 실패 시 catch()를 이용해 처리
- fetch는 404/500 같은 HTTP 에러도 Promise가 reject되지 않을 수 있기 때문에, `response.ok`로 직접 상태 확인 필요

```
fetch(url)
  .then(res => {
    if (!res.ok) throw new Error(res.status);
    return res.json();
  })
  .catch(console.error);
```

``` JavaScript
fetch("https://jsonplaceholder.typicode.com/posts/1")
  .then((response) => response.text())
  .then((text) => JSON.parse(text))
  .then((body) => console.log(body))

// response.text() : Response의 Body를 텍스트의 형태로 반환
// response.json() : Response의 Body를 JSON 파싱하여 반환
```






























