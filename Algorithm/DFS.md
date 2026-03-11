### DFS (깊이 우선 탐색)
> 한 경로를 끝까지 따라간 뒤, 더 이상 갈 수 없으면 이전 지점으로 돌아와 다른 경로를 탐색하는 방식

DFS는 이름 그대로 깊게 먼저 들어가는 탐색이다.

현재 위치에서 갈 수 있는 곳이 있으면 계속 들어가고, 없으면 이전 위치로 돌아와 다른 방향을 탐색한다.

이 과정은 스택(Stack) 구조와 잘 맞는다.

실제로는 두 가지 방식으로 구현한다.
- 재귀 호출
- 명시적인 스택 사용

즉, 재귀 DFS도 내부적으로는 호출 스택을 활용하므로 스택 기반 탐색이라고 볼 수 있다.

### DFS의 핵심 특징
- 한 방향으로 끝까지 탐색한 뒤 돌아온다.
- 경로 탐색, 연결 요소 탐색, 백트래킹에 자주 사용된다.
- 그래프에서는 방문 처리를 하지 않으면 사이클 때문에 버퍼 오버플로우 (or 무한 루프)에 빠질 수 있다.

### DFS 트리 탐색

<img width="931" height="543" alt="image" src="https://github.com/user-attachments/assets/4e14ca6f-3b03-4d93-bbf9-8cc1ed55ec38" />

트리는 사이클이 없기 때문에, 부모에서 자식으로 내려가는 구조라면 방문 배열 없이도 탐색할 수 있다.

#### 탐색 과정
1. 루트 노드를 스택에 넣는다
2. 스택이 빌 때까지 반복한다
3. 스택에서 현재 노드를 꺼낸다
4. 현재 노드의 자식들을 스택에 넣는다

**예시 코드**
``` java
DFS(v) { // v: 루트 노드
  stack.push(v);
  while (!stack.isEmpty()) {
    curr = stack.pop();
    for (w : curr의 자식들) {
      stack.push(w);
    }
  }
}
```

### DFS 그래프 탐색

<img width="1060" height="645" alt="image" src="https://github.com/user-attachments/assets/4d5514ab-abc2-4ad3-8c72-25cfd2388582" />

그래프는 트리와 달리 사이클이 존재할 수 있다.

따라서 이미 방문한 정점을 다시 방문하지 않도록 방문 체크가 필수다.

#### 핵심 차이
- 트리 : 부모-자식 구조라 사이클 걱정이 적다
- 그래프 : 사이클이 발생할 경우가 있어서 무한 반복이 가능하다

**예시 코드 - 재귀 방식**
``` java
DFS(v) {
  visited[v] = true;

  for (int next : graph[v]) {
    if (!visited[next]) {
      DFS(next);
    }
  }
}
```

**예시 코드 - 스택 방식**
```
DFS(v) {
  stack.push(v);
  visited[v] = true;

  while (!stack.isEmpty()) {
    int curr = stack.pop();

    for (int next : graph[curr]) {
      if (!visited[next]) {
        visited[next] = true;
        stack.push(next);
      }
    }
  }
}
```

### DFS 배열 탐색

<img width="1044" height="392" alt="image" src="https://github.com/user-attachments/assets/3dd090f3-a6c8-4490-8d48-9e557af14e26" />

2차원 배열에서 DFS는 그래프 DFS와 본질적으로 같다.

각 칸을 하나의 정점으로 보고, 상하좌우로 연결된 칸을 탐색하는 방식이다.

#### 주요 문제
- 연결된 영역 개수 세기
- 섬의 개수 구하기
- 미로 탐색
- 단지 번호 붙이기

**예시 코드**
``` java
DFS(r, c) {
  visited[r][c] = true;

  for (4방향) {
    int nr = r + dr[i];
    int nc = c + dc[i];

    if (배열 범위를 벗어나면) continue;
    if (이동할 수 없는 칸이면) continue;
    if (visited[nr][nc]) continue;

    DFS(nr, nc);
  }
}
```
