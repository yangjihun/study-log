### 서버와 클라이언트
클라이언트가 서버로 요청(request)을 보내면 서버는 요청을 처리한다. 처리 후 클라이언트로 응답(response)을 보낸다.

<img width="488" height="200" alt="image" src="https://github.com/user-attachments/assets/122394b2-fb97-40ac-8265-ec8704420b36" />

### http 요청에 응답하는 노드 서버
`createServer`로 요청 이벤트에 대기한다.

req 객체는 요청에 관한 정보, res 객체는 응답에 관한 정보가 담겨있다.
``` javascript
const http = require('http');

http.createServer((req, res) => {
  // 응답 내용
});
```

이를 기반으로 8080 포트에 연결해보겠다.

``` javascript
const http = require('http');

http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
  res.write('<h1>Hello Node!</h1>');
  res.end('<p>Hello Server!</p>');
})
  .listen(8080, () => {// 서버 연결
    console.log('8080번 포트에서 서버 대기 중입니다');
  });
```
res 메서드로 응답을 보낸다. (write로 응답 내용을 적고 end로 응답 마무리)

에러처리까지 하면 아래와 같이 코드를 수정할 수 있다.

``` javascript
const http = require('http');

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
  res.write('<h1>Hello Node!</h1>');
  res.end('<p>Hello Server!</p>');
})
  .listen(8080)
server.on('listening', () => {
  console.log('8080번 포트에서 서버 대기 중입니다');
});
server.on('error', (error) => {
  console.error(error);
});
```

### localhost와 포트
localhost는 컴퓨터 내부 주소로, 외부에서는 접근이 불가능하다.

포트는  서버 내에서 프로세스를 구분하는 번호로, 기본적으로 http 서버는 80번 포트를 사용한다. (생략 가능, https는 443)

다른 포트로 데이터베이스나 다른 서버 동시에 연결이 가능하다.










