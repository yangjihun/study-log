## State Management (상태관리)
<img width="250" height="250" alt="image" src="https://github.com/user-attachments/assets/fe2ab7bf-8836-422e-9460-3a2ce6104285" />

상태 (State)
- 앱 구동에 필요한 기본 데이터

뷰 (View)
- 상태를 선언적으로 매핑하여 시각화

기능 (Action)
- 뷰에서 사용자 입력에 대해 반응적으로 상태를 변경할 수 있게 정의된 동작

그러나 여러 뷰가 동일한 상태에 종속되는 경우나 서로 다른 뷰의 기능이 동일한 상태를 변경시켜야 하는 경우, 상태 관리의 단순성이 깨진다.

이를 해결하기 위해, 각 컴포넌트의 공유 상태를 추출하여 전역에서 참조할 수 있는 저장소에서 관리하는 중앙 저장소가 등장하게 되었다.

그 중에서도 Vue의 공식 상태 관리 라이브러리는 **Pinia**이다.

<img width="270" height="210" alt="image" src="https://github.com/user-attachments/assets/ad9c07fb-1b39-46e8-a9d4-54e1b31d6b04" />

## Pinia

### Pinia 구성요소
- store
- state
- getters
- actions
- plugin

### store
중앙 저장소로, 모든 컴포넌트가 공유하는 상태, 기능 등이 작성된다.
```
export const useCounterStore = defineStore('counter', () => {
  const count = ref(0)

  const doubleCount = computed(() => count.value * 2)

  const increment = function() {
    count.value++
  }

  return {count, doubleCount, increment }
})
```
### state
반응형 데이터(상태)로, `ref() == state`

store 인스턴스로 state에 접근하여 직접 읽고 쓸 수 있다.

만약 store에 state를 정의하지 않았다면 컴포넌트에서 새로 추가할 수 없다.

```
const count = ref(0)
```
### getters
계산된 값으로 `conputed() === getters`

store의 모든 getters를 state처럼 직접 접근할 수 있다.

```
const doubleCount = computed(() => count.value * 2)
```
### actions
메서드로 `function() === actions`

store의 모든 actions를 직접 접근 및 호출할 수 있다.

getters와 달리 state 조작, 비동기, API 호출이나 다른 로직을 진행할 수 있다.
```
const increment = function () {
  count.value++
}
```

### Appendix
Pinia는 공유된 상태를 관리하는 데 유용하지만, 개념에 대한 이해와 시작하는 비용이 크다.

어플리케이션이 단순하다면 Pinia가 없는 것이 더 효율적일 수 있다.

따라서 상황에 따라 적절하게 사용하는 것이 중요하다.




