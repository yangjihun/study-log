### UTXO 모델이란?
> UTXO 모델이란 Unspent Transaction Output의 줄임말로, 계정의 잔액을 직접 저장하는 대신, 아직 사용되지 않은 거래의 결과물을 추적하여 자산의 소유와 거래를 관리하는 방식이다.

### UTXO 모델 등장 배경
일반적인 은행 시스템은 **계정의 잔액을 직접 관리하는 방식**을 사용한다.

예를 들어 Alice 계좌에 10만 원이 있고 3만 원을 송금하면,

``` plaintext
송금 전
Alice: 100,000원

3만원 송금

송금 후
Alice: 70,000원
```

처럼 하나의 계정에 저장된 잔액을 수정하면 된다.

이 방식에서는 은행이라는 중앙기관이 계좌의 현재 잔액을 관리하면서 같은 돈을 두 번 사용하는 **이중 지불(Double Spending)** 문제를 걱정하지 않아도 된다.

하지만 비트코인은 중앙기관 없이 사용자끼리 직접 디지털 화폐를 주고받는 시스템을 만들고자 했다.

여기서 문제가 발생하는데, Alice가 1 BTC를 가지고 있다고 가정해보겠다.

Alice가 동일한 1 BTC에 대해
``` plaintext
Alice → Bob       : 1 BTC
Alice → Charlie   : 1 BTC
```
라는 두 개의 거래를 동시에 만든다면 어떤 거래를 인정해야 하는지 문제가 발생한다.

따라서 비트코인은 **UTXO 모델**을 적용하여 **이전에 발생한 거래 중 아직 사용되지 않은 결과물이 무엇인지 추적하는 방식**을 사용했다.


### UTXO 모델 동작 원리

UTXO 모델은 기본적으로 다음과 같은 구조를 가진다

``` plaintext
기존 UTXO
    ↓
Transaction Input
    ↓
Transaction
    ↓
Transaction Output
    ↓
새로운 UTXO
```

UTXO 모델은 **입력(Input)**과 **출력(Output)**으로 나누어 생각하면 쉽다.


#### Alice 잔액 조회

예를 들어 Alice가 이전 거래를 통해 다음 UTXO를 받았다고 해보겠다.
``` plaintext
UTXO #1
소유자: Alice
금액: 10 BTC
상태: Unspent
```

Alice의 잔액을 조회하면 **Alice가 사용할 수 있는 UTXO**들을 찾아서 합산한다.

Alice의 UTXO가 3개라고 한다면 다음과 같다.
``` plaintext
Alice
└── UTXO #1 : 10 BTC
└── UTXO #2 : 7 BTC
└── UTXO #3 : 2.5 BTC

잔액 = 19.5 BTC
```

#### Alice 송금
Alice가 Bob에게 3 BTC를 보낸다고 한다면 Alice가 가지고 있는 10 BTC짜리 UTXO 전체를 사용한다.

``` plaintext
Input
10 BTC UTXO

Output 1
Bob → 3 BTC

Output 2
Alice → 7 BTC
```

기존 UTXO가 사라지고 새로운 UTXO가 2개 생성되는 구조다.

전체 구조를 보면 다음과 같다.

``` plaintext
Alice
UTXO 10 BTC
      │
      │ 사용
      ▼
┌──────────────────┐
│   Transaction    │
└──────────────────┘
      │
      ├──────────────→ Bob   3 BTC
      │
      └──────────────→ Alice 7 BTC
```

### UTXO 모델 장단점

#### 장점 1. 이중 지불을 확인하기 쉽다

사용된 UTXO를 다시 Input으로 사용하려는 거래는 유효하지 않은 거래가 된다.

``` plaintext
UTXO #100

Transaction A에서 사용
→ Spent

Transaction B에서 다시 사용 시도
→ Invalid
```

따라서 거래의 유효성을 비교적 명확하게 판단할 수 있다.

#### 장점 2. 거래 추적이 명확하다

UTXO는 항상 이전 거래의 Output을 Input으로 사용한다

따라서 코인의 이동 경로를 연결해서 볼 수 있다.

``` plaintext
Transaction A
    ↓
UTXO
    ↓
Transaction B
    ↓
UTXO
    ↓
Transaction C
```

각 UTXO가 **어떤 거래에서 생성됐고, 어떤 거래에서 사용됐는지**가 명확하게 연결된다.

#### 장점 3. 병렬 처리에 유리하다

서로 다른 UTXO를 사용하는 거래라면 독립적으로 처리할 수 있다.

``` plaintext
Transaction A
UTXO #1 사용

Transaction B
UTXO #2 사용
```

다음과 같다면 두 거래가 동일한 상태를 수정하지 않는다.

반면 Account Model에서는 하나의 계정 잔액을 여러 거래가 동시에 수정할 수 있기 때문에 처리 순서와 상태 관리가 더 중요해진다.

#### 장점 4. 프라이버시 측면에서 활용할 여지가 있다

UTXO 모델에서는 하나의 사용자가 여러 주소와 여러 UTXO를 사용할 수 있다.

``` plaintext
주소 A → 1 BTC
주소 B → 2 BTC
주소 C → 3 BTC
```

위처럼 자산을 분산해서 가지고 있을 수 있다.

따라서 하나의 계정 잔액이 계속 갱신되는 Account Model보다 주소를 분리해서 사용하는 방식이 가능하다.

다만 비트코인 거래는 공개 원장에 기록되기 때문에 UTXO를 사용한다고 해서 익명성이 자동으로 보장되는 것은 아니다.

#### 단점 1. 구조가 직관적이지 않다

사용자 입장에서는 단순히 "내 잔액이 얼마인가?"만 보고 싶지만, 지갑 프로그램 내부에서는 여러 UTXO를 관리하고 합산해야 한다.

#### 단점 2. UTXO 선택 과정이 필요하다

여러 개의 UTXO가 있을 때 어떤 UTXO를 사용할 것인지 결정해야 한다.

예를 들어

``` plaintext
1 BTC
2 BTC
3 BTC
5 BTC
8 BTC
```

를 가지고 있고 6 BTC를 보내려 한다면

``` plaintext
1 + 5 BTC
2 + 5 BTC
3 + 5 BTC
8 BTC
```
등 여러 방법이 존재한다.

어떤 조합을 선택하느냐에 따라
- 거스름돈
- 거래 데이터 크기
- 거래 수수료
등이 달라질 수 있는데, 이를 **Coin Selection**이라고 한다.

그래서 실제 비트코인 지갑은 사용자 대신 적절한 UTXO 조합을 선택하는 알고리즘을 사용한다.

#### 단점 3. UTXO가 너무 많이 쌓일 수 있다

아주 작은 금액의 UTXO가 계속 생성되면 하나의 사용자가 수많은 UTXO를 가지게 될 수 있다.

``` plaintext
0.001 BTC
0.001 BTC
0.001 BTC
0.001 BTC
...
```
처럼 작은 UTXO가 수백 개 존재할 수 있다.

이럴 경우 큰 금액을 보내기 위해 많은 UTXO를 Input으로 사용하게 되는데, 트랜잭션 크기가 커져서 수수료가 증가할 수 있게 된다.

