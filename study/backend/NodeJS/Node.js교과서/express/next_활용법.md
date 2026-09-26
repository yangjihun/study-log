## next 활용법

### next(error)

``` javascript
app.use((req, res, next) => {
  console.log('요청에 실행');
  next();
}, (req, res, next) => {
  try {
    console.log('에러 발생');
  } catch (error) {
    next(error);
  }
}
```

해당 코드에서처럼 `next`에 인수가 들어가면 이는 에러라고 처리돼서 다음 미들웨어로 넘어가는 게 아닌, 에러처리 미들웨어로 넘어간다.
``` javascript
app.use((err, req, res, next) => {
  console.log(err);
  res.status(200).send('에러 발생');
}
```

### next('route')
또 `next` 인수 안에 `'route'`라는 키워드를 넣을 수 있다.
``` javascript
app.get('/', (req, res, next) => {
  res.sendFile(path.join(__dirname, 'index.html');
  next('route');
}, (req, res) => {
  console.log('실행 1');
});

app.get('/', (req, res) => {
  console.log('실행 2');
});
```
라우터에 `next('route')`가 있다면, 같은 라우터에 내용이 실행되지 않고 다른 라우터로 넘어가서 실행된다. `next('route')` 아래 부분은 실행이 안되는 것이다.

이는 실무적으로 if문 안에 넣는 경우가 발생한다. if문에 따라서 어떤 미들웨어를 실행할지 선택할 수 있게 된다.

``` javascript
app.get('/', (req, res, next) => {
    if (true) {
        next('route');
    }
    else {
        next();
    }
}, (req, res) => {
    console.log('실행되나요?');
})

app.get('/', (req, res) => {
    res.send('Hello Express');
})

// Hello Express만 전달 (콘솔 출력 x)
```

### req 객체 저장
`next()` 함수 자체에 데이터를 담아 보낼 수는 없지만, `next()`로 다음 미들웨어를 호출하기 전에 `req` 객체나 `res.locals`에 데이터를 저장해서 넘겨주는 패턴도 있다. (로그인 유저 검증, 권한 확인 등)

``` javascript
const checkUser = (req, res, next) => {
  // DB에서 유저 정보를 조회했다고 가정
  const user = { name: 'jihun', role: 'admin' };
  // 다음 미들웨어에서 쓸 수 있게 req 객체에 저장
  req.currentUser = user;
  // 또는 res.locals.user = user;
  next();
};

app.get('profile', checkUser, (req, res) => {
  // 이전 미들웨어에서 넘겨준 데이터 사용
  res.send(`${req.currentUser.name}님 환영합니다.`);
});
```
