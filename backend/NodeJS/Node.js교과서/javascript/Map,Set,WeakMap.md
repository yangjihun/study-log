### Map/Set
ES2015에 새로 추가된 자료구조들이다.

#### Map
Map은 다양한 자료형을 키(Key)로 사용할 수 있고 삽입 순서를 보장하는 키-값(Key-Value) 쌍의 컬렉션이다.

Map은 속성들 간의 순서를 보장하고 반복문을 사용할 수 있다.

속성명으로 문자열이 아닌 값을 사용할 수 있고 `size` 메서드를 통해 속성의 수를 쉽게 알 수 있다는 특징이 있다.

``` javascript
const m = new Map();

m.set('a', 'b'); // set(키, 값)으로 Map에 속성 추가
m.set(3, 'c'); // 문자열이 아닌 값을 키로 사용 가능
const d = {};
m.set(d, 'e'); // 객체도 가능

m.get(d); // get(키)로 속성값 조회
console.log(m.get(d)); // e

m.size; // size로 속성 개수 조회
console.log(m.size); // 3

for (const [k, v] of m) { // 반복문에 바로 넣어 사용 가능
  console.log(k, v); // 'a', 'b', 3, 'c', {}, 'e'
} // 속성 간의 순서도 보장

m.forEach((v, k) => {
  console.log(k, v); // 결과는 위와 동일
})

m.has(d); // has(키)로 속성 존재 여부를 확인
console.log(m.has(d)); // true

m.delete(d); // delete(키)로 속성을 삭제
m.clear(); // clear()로 전부 제거
console.log(m.size); // 0
```

#### Set
Set은 데이터의 중복을 허용하지 않는 유일한 값(Value)들의 컬렉션이다.

Set은 중복을 허용하지 않는다는 것이 가장 큰 특징이다. 따라서 배열 자료구조를 사용하고 싶으나 중복은 허용하고 싶지 않을 때 Set을 대신 사용하면 된다.

``` javascript
const s = new Set();
s.add(false); // add(요소)로 Set에 추가
s.add(1);
s.add('1');
s.add(1); // 중복이므로 무시
s.add(2);

console.log(s.size); // 중복 제거되어 4

s.has(1); // has(요소)로 요소 존재 여부를 확인
console.log(s.has(1)); // true

for (const a of s) {
  console.log(a); // false 1 '1' 2
}

s.forEach((a) => {
  console.log(a); // false 1 '1' 2
})

s.delete(2); // delete(요소)로 요소를 제거
s.clear(); // clear()로 전부 제거
```

기존 배열에서 중복을 제거하고 싶을 때는 아래와 같이 제거할 수 있다.

``` javascript
const arr = [1, 3, 2, 7, 2, 6, 3, 5];

const s = new Set(arr);
const result = Array.from(s):
console.log(result); // 1, 3, 2, 7, 6, 5
```

### WeakMap
만약 이런 코드가 있다고 해보자.
``` javascript
const m = new Map();
let obj2 = {};
m.set(obj2, '123');
obj2 = null;
```
해당 코드는 `obj2`를 객체로 선언하고, null로 바꾸는 코드이다.

이 경우 `obj2`는 null이 되었음에도 불구하고 메모리에 계속 남아있게 된다. 이유는 `m`이 `obj2`를 참조하고 있기 때문에 `m`이 사라지지 않는 이상 가비지컬렉션이 안되기 때문이다.

만약 `obj2`를 메모리에서 없애고 싶다면 **WeakMap**을 사용하면 된다.

``` javascript
const wm = new WeakMap();
const abj3 = {};
wm.set(obj3, '123'));
obj3 = null;
```

**WeakSet**이라는 것도 있는데, WeakSet 또한 위와 동일한 Set이라고 생각하면 된다.
