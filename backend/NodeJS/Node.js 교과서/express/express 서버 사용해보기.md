http 모듈로 웹 서버를 만들게 되면 코드 가독성이 떨어지고, 확장성도 떨어진다.

이는 프레임워크로 해결할 수 있는데, 대표적인 프레임워크로 Express, Koa, Hapi, Nest.js 등이 있다.

이 중 먼저 express에 대해 알아볼 예정인데, express는 프레임워크 중 다운로드 수가 압도적으로 많다.

<img width="2672" height="1062" alt="image" src="https://github.com/user-attachments/assets/2dd5e595-d2fd-4526-bc07-e0a2d588dc75" />

그만큼 생태계가 크고 참고할 자료가 많아 실무에서도 가장 널리 쓰이는 표준처럼 자리 잡고 있다.
특히 복잡한 주소 처리를 돕는 **라우팅** 기능과 요청과 응답 사이에서 다양한 기능을 처리하는 **미들웨어**를 아주 쉽게 사용할 수 있다는 것이 큰 장점이다.

#### 익스프레스 프로젝트 시작하기
먼저 package.json을 만들겠다.
``` console
npm init -y
```
그 후 express와 nodemon을 설치하면 된다.

``` console
npm i express
npm i -D nodemon
```

node는 코드가 바뀔 때마다 서버를 재시작해야 하지만, nodemon은 코드가 바뀌었을 때 자동으로 서버를 재시작해준다. 개발 단계에서 편리하기 때문에 nodemon을 사용했다.

``` javascript
const express = require('express');

const app = express();

app.get('/', (req, res) => {
    res.send('Hello Express');
})

app.listen(3000, () => {
    console.log('3000번 포트를 시작합니다');
});
```

간단한 express 서버를 만들어보았다.

---

``` javascript
const express = require('express');
```
앞서 npm으로 설치한 `express` 모듈을 불러와 변수에 할당하는 코드다.

``` javascript
const app = express();
```
불러온 `express` 함수를 실행하여 새로운 Express 애플리케이션 객체를 생성한다.

이 객체를 통해 서버의 각종 설정, 미들웨어 추가, 라우팅(경로 설정)등을 관리하게 된다.

``` javascript
app.get('/', (req, res) => { ... })
```
클라이언트(브라우저)가 HTTP GET 메서드로 서버의 기본 주소인 루트 경로(`'/'`)에 요청을 보냈을 때, 어떤 동작을 할지 정의하는 코드이다.

콜백 함수의 매개변수인 `req`(Request)는 클라이언트의 요청 정보를 담고 있고, `res`(Response)는 서버가 클라이언트에게 응답을 보낼 때 사용하는 객체이다.

``` javascript
res.send('Hello Express');
```
해당 경로(`/`)로 접속한 클라이언트에게 `'Hello Express'`라는 텍스트 데이터를 응답으로 보내 화면에 띄워주는 역할을 한다.


``` javascript
app.listen(3000, () => { ... });
```
서버를 3000번 포트에서 대기(Listen) 상태로 만들어 본격적으로 가동하는 코드이다.

서버가 성공적으로 실행되면, 두 번째 인자로 전달된 콜백 함수가 실행되어 터미널에 `'3000번 포트를 시작합니다'`라는 메시지가 출력된다.


