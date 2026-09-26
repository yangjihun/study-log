### 프로미스
프로미스는 내용이 실행은 되었지만 결과를 반환하지 않은 객체이다.

``` javascript
const condition = true; // true면 resolve, false면 reject
const promise = new Promise((resolve, reject) => {
  if (condition) {
    resolve('성공');
  } else {
    reject('실패');
  }
});

// 다른 코드가 들어갈 수도 있다
promise
  .then((message) => {
    console.log(message); // 성공(resolve한 경우 실행
  })
  .catch((error) => {
    console.error(error); // 실패(reject)한 경우 실행
  })
```
then을 붙이면 결과를 반환한다. 실행이 완료되지 않았으면 완료된 후에 then 내부 함수가 실행된다.

- resolve(성공리턴값): then으로 연결
- reject(실패리턴값): catch로 연결
- finally 부분은 무조건 실행

#### 콜백 패턴(3중첩)을 프로미스로 바꾸는 예제
``` javascript
function findAndSaveUser(Users) {
  Users.findOne({}, (err, user) => { // 첫 번째 콜백
    if (err) {
      return console.error(err);
    }
    user.name = 'jihun';
    user.save((err) => { // 두 번째 콜백
      if (err) {
        return console.error(err);
      }
      Users.findOne({ gender: 'm' }, (err, user) => { // 세 번째 콜백
        // 생략
      }));
    });
  });
}
```

<img width="400" height="225" alt="image" src="https://github.com/user-attachments/assets/7ca62ca9-0996-430e-b68a-311b92001728" />

(콜백헬이라고도 부른다)

해당 코드를 프로미스로 바꾼 코드는 아래처럼 들여쓰기 없이 일정하게 나온다.
``` javascript
function findAndSaveUser(Users) {
  Users.findOne({})
    .then((user) => {
      user.name = 'jihun';
      return user.save();
    })
    .then((user) => {
      return Users.findOne({ gender: 'm' });
    })
    .then((user) => {
      // 생략
    })
    .catch(err => {
      return console.error(err);
    }
}
```
그러나 이 코드 또한 then이 길어질 경우, 프로미스 지옥으로 볼 수도 있다. (then, then, then, ..., then)

### async/await
async/await으로 한 번 더 축약하면 아래처럼 된다.

``` javascript
async function findAndSaveUser(Users) {
  let user = awiat Users.findOne({});
  user.name = 'jihun';
  user = await user.save();
  user = await Users.findOnt({ gender: 'm' });
  // 생략
}
```
`변수 = await 프로미스;`인 경우 프로미스가 resolve된 값이 변수에 저장된다. 그러나 에러문을 처리하고 싶은 경우, `try-catch`를 활용해야 한다.

화살표 함수도 async/await이 가능하다.
``` javascript
const findAndSaveUser = async (Users) => {
  try {
    let user = await Users.findOne({});
    user.name = 'jihun';
    // 생략
  } catch (error) {
    console.error(error);
  }
};
```

async 함수는 항상 promise를 반환한다. (`then`이나 `await`을 붙일 수 있다.)

``` javascript
async function findAndSaveUser(Users) {
  // 생략
}
findAndSaveUser().then(() => { /* 생략 */ });
// 또는
async function other() {
  const result = await findAndSaveUser();
}
```

#### for await of
`for await`은 노드 10부터 지원한다.

`for await (변수 of 프로미스배열)` 형태로 구성되어 있으며, resolve된 프로미스가 변수에 담겨서 나온다.

await을 사용하기 때문에 async 함수 안에서 해야한다.

``` javascript
const promise1 = Promise.resolve('성공1');
const promise2 = Promise.resolve('성공2');
(async () => {
  for await (promise of [promise1, promise2]) {
    console.log(promise);
  }
})();
```
