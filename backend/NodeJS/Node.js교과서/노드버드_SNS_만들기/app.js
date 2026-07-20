const express = require('express'); // express: 웹 서버를 쉽게 만들 수 있게 도와주는 모듈 불러오기
const cookieParser = require('cookie-parser'); // cookie-parser: 쿠키를 해석해 req.cookies 객체로 만들어주는 모듈 불러오기
const morgan = require('morgan'); // morgan: 로그 기록 모듈 불러오기
const path = require('path'); // path: 경로 관련 모듈 불러오기
const session = require('express-session'); // express-session: 세션 관리 모듈 불러오기
const nunjucks = require('nunjucks');// nunjucks: 템플릿 엔진 모듈 불러오기
const dotenv = require('dotenv'); // dotenv: 환경변수 설정 모듈 불러오기

dotenv.config(); // 환경변수 설정 파일(.env) 불러오기
const pageRouter = require('./routes/page'); // pageRouter: 페이지 라우터 모듈 불러오기

const app = express(); // express 객체 생성
app.set('port', process.env.PORT || 8001); // 포트 설정: 환경변수 PORT가 있으면 그 값을 사용하고, 없으면 8001번 포트를 사용
app.set('view engine', 'html'); // 뷰 엔진 설정: nunjucks를 사용하기 위해 html로 설정
nunjucks.configure('views', { // nunjucks 설정: views 폴더를 템플릿 파일이 있는 폴더로 설정
    express: app, // express 객체를 nunjucks에 연결
    watch: true, // 템플릿 파일 변경 시 자동으로 반영되도록 설정
})

app.use(morgan('dev')); // morgan 설정: 개발 환경에서 로그를 콘솔에 출력하도록 설정
app.use(express.static(path.join(__dirname, 'public'))); // 정적 파일 제공: public 폴더를 정적 파일 제공 폴더로 설정
app.use(express.json()); // express.json(): 요청 본문이 JSON 형식일 때, req.body 객체로 만들어주는 미들웨어
app.use(express.urlencoded({ extended: false })); // express.urlencoded(): 요청 본문이 URL 인코딩 형식일 때, req.body 객체로 만들어주는 미들웨어
app.use(cookieParser(process.env.COOKIE_SECRET)); // cookieParser: 쿠키를 해석해 req.cookies 객체로 만들어주는 미들웨어
app.use(session({ // 세션 설정
    resave: false, // 세션을 항상 저장할지 여부: false로 설정하면 세션이 수정되지 않으면 저장하지 않음
    saveUninitialized: false, // 세션이 저장되기 전에 uninitialized 상태로 저장할지 여부: false로 설정하면 세션이 수정되지 않으면 저장하지 않음
    secret: process.env.COOKIE_SECRET, // 세션을 암호화할 때 사용할 비밀 키: 환경변수 COOKIE_SECRET 값을 사용
    cookie: { // 쿠키 설정
        httpOnly: true, // httpOnly: true로 설정하면 클라이언트에서 쿠키에 접근할 수 없음
        secure: false, // secure: false로 설정하면 HTTPS가 아닌 HTTP에서도 쿠키를 전송할 수 있음
    },
}))

app.use('/', pageRouter); // 라우터 설정: '/' 경로로 들어오는 요청은 pageRouter에서 처리하도록 설정
app.use((req, res, next) => { // 404 처리 미들웨어: 라우터에 없는 경로로 들어오는 요청은 404 에러를 발생시키도록 설정
    const error = new Error(`${req.method} ${req.url} 라우터가 없습니다.`); // 에러 객체 생성: 요청 메서드와 요청 URL을 포함한 에러 메시지를 생성
    error.status = 404; // 에러 상태 코드 설정: 404로 설정
    next(error); // 에러 처리 미들웨어로 에러 객체 전달
})

app.use((err, req, res, next) => {
    res.locals.message = err.message; // 에러 메시지를 locals 객체에 저장: 템플릿에서 사용할 수 있도록 설정
    res.locals.error = process.env.NODE_ENV !== 'production' ? err : {}; // 개발 환경이면 에러 객체를 locals 객체에 저장, 배포 환경이면 빈 객체를 저장
    res.status(err.status || 500); // 에러 상태 코드 설정: 에러 객체에 상태 코드가 있으면 그 값을 사용하고, 없으면 500으로 설정
    res.render('error'); // error.html 템플릿 렌더링: 에러 페이지를 렌더링
});

app.listen(app.get('port'), () => { // 서버 실행: 설정한 포트에서 서버를 실행
    console.log(app.get('port'), '번 포트에서 대기 중'); // 서버 실행 시 콘솔에 포트 번호 출력
});