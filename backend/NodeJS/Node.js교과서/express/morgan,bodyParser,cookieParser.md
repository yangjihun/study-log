[next 활용법](https://github.com/yangjihun/study-log/blob/main/backend/NodeJS/Node.js%20%EA%B5%90%EA%B3%BC%EC%84%9C/express/next%20%ED%99%9C%EC%9A%A9%EB%B2%95.md)에 이어서

미들웨어는 다른 사람이 만들어놓은 미들웨어를 사용할 수 있다는 장점이 있다.

``` plaintext
npm i morgan cookie-parser express-session
```

### morgan
morgan은 요청과 응답에 대한 정보를 콘솔에 기록할 때 사용한다.

``` javascript
const morgan = require('morgan');

app.use(morgan('dev'));
```
상단에 morgan 미들웨어를 추가하면 요청마다 콘솔에 아래 텍스트가 출력된다.
``` javascript
GET / 304 42.631 ms - -
```
인수로 dev 외에 combined, common, short, tiny 등을 넣을 수 있다.
#### combined
표준 Apache 결합 로그 포맷이다. 가장 상세한 정보를 제공하므로, 주로 배포 환경에서 방문자 통계나 오류 추적을 위해 사용된다.

접속자 IP, 날짜/시간, HTTP 메서드, URL, HTTP 버전, 상태 코드, 응답 크기, 유입 경로, User-Agent(브라우저 및 OS 정보)가 출력된다.
``` plaintext
::1 - - [03/Jul/2026:05:14:37 +0000] "GET / HTTP/1.1" 304 - "-" "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36"
```

#### common
combined 포멧에서 Referer와 User-Agent 정보만 제외된 형태이다.
``` plaintext
::1 - - [03/Jul/2026:05:16:32 +0000] "GET / HTTP/1.1" 304 -
```

#### short
접속자 IP와 요청 정보, 그리고 응답 시간을 포함하여 비교적 짧게 출력하는 포맷이다.
``` plaintext
::1 - GET / HTTP/1.1 304 - - 7.538 ms
```

#### tiny
최소한의 정보만 출력하는 포맷으로, HTTP 메서드, URL, 상태 코드, 응답 크기, 응답 시간을 포함한다.

``` plaintext
GET / 304 - - 4.580 ms
```

#### dev
개발 중 가독성을 극대화하기 위한 포맷이다.

HTTP 메서드, URL, 상태 코드, 응답 시간, 응답 크기를 포함한다.
``` plaintext
GET /morgan 200 2.686 ms - 4
```

### bodyParser
bodyParser는 요청의 본문 데이터를 해석해서 `req.body` 객체로 만들어주는 미들웨어이다. 단, 멀티파트(이미지, 동영상, 파일) 데이터는 처리하지 못하기 때문에 이 경우에는 multer 모듈을 사용하면 된다.

express 4.16.0 버전부터는 body-parser 미들웨어 기능이 내장되었으므로 따로 설치할 필요는 없다.
``` javascript
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
```


### cookieParser
cookie-parser는 요청에 동봉된 쿠키를 `req.cookies` 객체로 만든다.

``` javascript
app.use(cookieParser());
```
쿠키들은 `req.cookies` 객체에 들어간다.

그 외에도 쿠키를 설정하고 삭제하는 방법은 아래와 같다.
``` javascript
app.get('/', (req, res, next) => {
  // setCookie
  req.cookies('name', encodeURIComponent(name), {
    expires: new Date(),
    httpOnly: true,
    path: '/',
  })
  // Clear Cookie
  res.clearCookie('name', encodeURIComponent(name), {
    httpOnly: true,
    path: '/',
  })
});
```

또 쿠키를 암호화하는 방법이 있다.

``` javascript
app.use(cookieParser(비밀키));
```

암호화된 쿠키는 `req.cookies`가 아닌 `req.signedCookies`로 들어간다.





