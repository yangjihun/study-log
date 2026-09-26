### 익스프레스의 단점
익스프레스는 폴더와 파일 구조에 제약이 없기 때문에 이를 사용자가 직접 생성해야 한다는 것이 익스프레스의 장점이자 단점이다.

또 익스프레스의 라우터를 구성하는 대부분의 요소가 미들웨어인데, 미들웨어는 단순히 `(req, res, next) => {}` 구조의 함수일 뿐이다.
따라서 각각의 역할과 제약을 사용자가 직접 부여해야 한다는 단점이 있다.

이를 해결한 노드 서버 프레임워크가 있다. 네스트는 타입스크립트와 객체 지향 프로그래밍을 적극적으로 활용한 프레임워크이다.

``` javascript
// 익스프레스 코드
router.post('/join', isNotLoggedIn, join);
```

``` javascript
// 네스트 코드
@UseGuards(isNotLoggedIn)
@Post('join')
join(@Req() req: Request, @Res() res: Response) {
    // req와 res를 사용한 회원 가입 로직
}
```

### NestJS 설치하기
``` console
npm i -g @nest/cli
npst new node-cat
```

파일 생성 과정과 패키지 설치 과정이 다 끝나면 다음 명령어를 순차적으로 입력해 서버를 실행한다.

``` console
cd node-cat
npm run start
```

