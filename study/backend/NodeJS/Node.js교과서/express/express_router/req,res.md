### req 객체
- **req.app**: req 객체를 통해 app 객체에 접근할 수 있다. `req.app.get('port')`와 같은 식으로 사용할 수 있다.
- **req.body**: body-parser 미들웨어가 만드는 요청의 본문을 해석한 객체이다.
- **req.cookies**: cookie-parser 미들웨어가 만드는 요청의 쿠키를 해석한 객체이다.
- **req.ip**: 요청의 ip 주소가 담겨있다.
- **req.params**: 라우트 매개변수에 대한 정보가 담긴 객체이다.
- **req.query**: 쿼리스트링에 대한 정보가 담긴 객체이다.
- **req.signedCookies**: 서명된 쿠키들은 `req.cookies` 대신 여기에 담겨있다.
- **req.get(헤더 이름)**: 헤더의 값을 가져오고 싶을 때 사용하는 메서드다.

### res 객체
- **res.app**: req.app처럼 res 객체를 통해 app 객체에 접근할 수 있다.
- **res.cookie(키, 값, 옵션)**: 쿠키를 설정하는 메서드다.
- **res.clearCookie(키, 옵션)**: 쿠키를 제거하는 메서드다.
- **res.end()**: 데이터 없이 응답을 보낸다.
- **res.json(JSON)**: JSON 형식의 응답을 보낸다.
- **res.redirect(주소)**: 리다이렉트할 주소와 함께 응답을 보낸다.
- **res.render(뷰, 데이터)**: 템플릿 엔진을 렌더링해서 응답할 때 사용하는 메서드이다.
- **res.send(데이터)**: 데이터와 함께 응답을 보낸다. (문자열, HTML, 버퍼, 객체 등등)
- **res.sendFile(경로)**: 경로에 위치한 파일을 응답한다.
- **res.set(헤더, 값)**: 응답의 헤더를 설정한다.
- **res.status(코드)**: 응답 시의 HTTP 상태 코드를 지정한다.

리다이렉트 시
``` javascript
// raw node.js
res.writeHead(302, {
    Location: '/',
    'Set-Cookie': `session=${uniqueInt}; Expires=${expires.toGMTString()}; HttpOnly; Path=/`
});
res.end();

// express
res.cookie('session', uniqueInt, {
    expires,
    httpOnly: true,
    path: '/'
});
res.redirect('/');
```