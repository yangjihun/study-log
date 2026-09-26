### multer
enctype은 HTML `<form>` 태그의 속성으로, 폼 데이터를 서버에 전송할 때 어떤 형식으로 인코딩할지 지정하는 값이다.

enctype의 주요 값은 3가지가 있다.

1. `application/x-www-form-urlencoded` (기본값)
- 텍스트 데이터를 `key=value&key2=value2` 형태로 인코딩
- 파일 업로드 불가능

2. `multipart/form-data`
- 데이터를 여러 부분으로 나눠서 전송
- 파일 업로드가 가능한 방식

3. `text/plain`
- 텍스트를 그대로 전송

이 중에서 enctype이 multipart/form-data인 경우 body-parser로는 요청 본문을 해석할 수 없다.



따라서 multer 패키지가 필요하다.

``` bash
npm i multer
```

multer에서 자주 쓰이는 옵션은 크게 storage와 limits가 있다.

storage는 업로드한 파일을 어디에 저장할지 선택할 수 있다. 디스크나 메모리에 저장할 수도 있다.

``` javascript
storage: multer.diskStorage({ // 저장 위치 지정 (하드디스크에 업로드 파일을 저장)
    destination(req, file, done) {
        done(null, 'uploads/'); // 첫번째 인수에는 에러 발생 시 에러를 넣는 인수이다.
    },
}),
filename(req, file, done) { // 파일 이름 지정
    const ext = path.extname(file.originalname);
    done(null, path.basename(file.originalname, ext) + Date.now() + ext);
}
```

실제 서버 운영 시에는 서버 디스크 대신 S3같은 스토리지 서비스에 저장하는 것이 좋다. (Storage 설정만 바꿔주면 된다)

limits는 파일의 크기를 지정하는 옵션이다.

``` javascript
limits: { fileSize: 5 * 1024 * 1024 },
```

### multer 미들웨어
multer에는 single과 none, array, fields 미들웨어가 존재한다.

하나의 파일을 업로드할 때는 single, 파일은 업로드하지 않을 때는 none을 사용한다.

req.file 안에 업로드 정보를 저장한다.

``` javascript
app.post('/upload', upload.single('image'), (req, res) => {
    console.log(req.body);
    res.send('ok');
});
```

single 대신 array와 fields를 사용할 수 있는데, 이는 여러 개의 파일을 업로드 할 때 사용한다.

array는 하나의 요청 body 이름 아래 여러 파일이 있는 경우, fields는 여러 개의 요청 body 이름 아래 파일이 하나씩 있는 경우 사용한다.

두 경우 모두 업로드된 이미지 정보가 `req.files` 아래에 존재한다.

``` javascript
app.post('/upload', upload.fields([{ name: 'image1' }, { name: 'image2' }, { name: 'image3' }]), (req, res) => {
    console.log(req.files.image3);
    res.send('ok');
})
```