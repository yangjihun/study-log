# blog

[Quartz v5](https://quartz.jzhao.xyz)로 만든 study-log 블로그입니다.
콘텐츠는 레포 루트(`..`)의 마크다운 노트를 그대로 사용합니다.

## 로컬 실행

```bash
cd blog
npm ci
npx quartz build --serve -d ..
```

http://localhost:8080 에서 확인할 수 있습니다.

## 배포

`main` 브랜치에 push하면 `.github/workflows/deploy.yml`이 빌드 후 GitHub Pages에 배포합니다.

## Jupyter 노트북

`study/` 아래의 `.ipynb` 파일은 배포할 때 자동으로 같은 위치의 `.md`와 이미지 파일로 변환됩니다.
코드를 다시 실행하지 않고 노트북에 저장된 실행 결과를 사용하므로, 출력과 그래프를 표시하려면 실행 결과를 저장한 뒤 push하세요.
숨김 폴더와 `.ipynb_checkpoints`는 변환 대상에서 제외됩니다.

원본 `.ipynb`만 커밋하면 됩니다. 변환된 Markdown과 이미지는 CI 빌드 중 생성되므로 커밋할 필요가 없습니다.
같은 이름의 직접 작성한 `.md`가 이미 있으면 덮어쓰지 않고 변환을 중단합니다. 자동 생성 표시가 있는 파일만 다시 변환할 수 있습니다.

로컬에서도 Python 3.12로 변환한 뒤 미리 볼 수 있습니다.

```bash
cd blog
python -m pip install -r scripts/requirements-notebooks.txt
python scripts/convert-notebooks.py
npx quartz build --serve -d ..
```

## 설정

- 사이트 설정: `quartz.config.yaml`
- 사이트에서 제외할 파일/폴더: `quartz.config.yaml`의 `ignorePatterns`
- 홈 화면: 레포 루트의 `index.md`

## 그래프 뷰

- `folder-links.ts`: 노트 → 상위 폴더 → 홈 링크를 그래프 데이터에 추가해 폴더 트리로 연결
- `plugins/graph`: [quartz-community/graph](https://github.com/quartz-community/graph)를 복사해 수정한 버전
  (`package.json`에서 `file:./plugins/graph`로 연결)
  - `categoryColors`: 최상위 폴더별 노드 색 (`quartz.config.yaml`의 graph 옵션)
  - `showLabels`: `all` / `folders` / `none` — 확대하지 않아도 보일 라벨

`plugins/graph/src`를 수정했다면 빌드한 `dist`를 커밋해야 반영된다.
빌드용 `node_modules`가 남아 있으면 preact가 중복 로드될 수 있어 빌드 후 지운다.

```bash
cd blog/plugins/graph
npm install && npm run build
rm -rf node_modules
```
