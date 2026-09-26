### 탐욕(Greedy) 알고리즘
> 매 순간 가장 최선이라고 생각되는 선택을 하는 방법

지역적으로는 최적이지만, 최종적으로 최적이라는 보장은 없다

### 탐욕 알고리즘 사용 조건
1. 탐욕 선택 속성 (Greedy Choice Property)
  - 매 순간의 최선 선택이 전체 최적해의 일부가 되어야 한다.
2. 최적 부분 구조 (Optimal Substructure)
  - 전체 문제의 최적해가 부분 문제의 최적해로 구성되어야 한다.

### 탐욕 가능 여부 판단
- 현재 상황에 가장 좋은 선택을 하면 추후에 더 좋은 선택을 못하는가? (Yes)
- 선택을 되돌릴 필요가 있는가? (No)
- 개별 점수보다 조합 효과가 중요한가? (No)

### 대표적인 Greedy 알고리즘
- 거스름돈 문제
- 회의실 배정
- 대기시간 최소화 문제
- 배낭문제(Fractional Knapsack)
- 최소 신장 트리(MST)
- 최단경로(Dijkstra)

### 예제 문제
S마켓에서 손님에게 거슬러 주어야 할 금액 N이 입력되면 거슬러주는 돈의 최소 개수를 출력하라.

[입력]

32850

[출력]

10


#### 예제 풀이 코드
```
import java.util.Scanner;
 
public class Solution {
    public static void main(String[] args) {
    Scanner sc = new Scanner(System.in);
        int N = sc.nextInt(); // 거슬러 주어야 할 금액
        int[] money = {50000,10000,5000,1000,500,100,50,10}; // 돈 종류
        int answer = 0;
        for (int i=0; i<8; i++) {
            answer += N/money[i]; // 큰 금액부터 계산
            N %= money[i]; // 주고 남은 금액을 N에 재할당
        }
        System.out.println(answer);
    }
}
```
