### 순열
> 서로 다른 원소들을 특정한 순서로 나열하는 것

$$nPr = n * (n-1) * (N-2) * ... * (n-r+1)$$

#### N의 범위에 따른 순열의 수

| N | 순열의 수 | Million/sec | Billion/sec | Trillion/sec |
|---|----------|--------------|-------------|---------------|
|10|3,628,800| - | - | - |
|11|39,916,800| seconds | - | - |
|12|479,001,600| minutes | - | - |
|13|6,227,020,800| Hours | seconds | - |
|14|87,178,291,200| Day | Minute | - |
|15|1,307,674,368,000| weeks | Minutes | - |
|16|20,922,789,888,000| Months | Hours | Seconds |
|17|355,687,428,096,000| Years | Days | Minutes |
|18|6,402,373,705,728,000| - | Months | Hours |
|19|121,645,100,408,832,000| - | Years | Days |
|20|2,432,902,008,176,640,000| - | - | Month |

n > 12인 경우, 시간 복잡도가 기하급수적으로 증가하는 걸 알 수 있다.

### 순열 구현 (반복문)
``` Java
int[] arr = {1,2,3};
for (int x : arr) {
  for (int y : arr) {
    if (x!=y) {
      for (int z : arr) {
        if (x!=z && y!=z) {
          System.out.println(x + " " + y + " " + z);
        }
      }
    }
  }
}
```

### 순열 구현 (swap)
``` Java
// arr[] : 데이터가 저장된 배열
// n :원소의 개수
// k : 현재까지 교환된 원소의 개수

permutation (int n, int k) {
  if (k==n) {
    System.out.println(Arrays.toString(arr);
  }
  else {
    for (int i=k; i<n-1; i++) {
      swap(k, i);
      permutation(n, k+1);
      swap(k, i);
    }
  }
}
```

### 순열 구현 (방문체크)
```
// int[] nums : 데이터
// int[] result : 결과 저장 배열
// boolean[] check : 해당 원소를 사용했는지 체크하기 위한 배열

permutation(int idx) {
  if (idx==N) {
    System.out.println(Arrays.toString(result));
  }
  for (int i=0; i<N-1; i++) {
    if (check[i]) continue;
    result[idx] = nums[i];
    check[i] = true;
    permutation(idx+1);
    check[i] = false;
  }
}
```

### 순열 구현 (비트마스킹)
```
// int[] nums : 데이터
// int[] result : 결과 저장 배열
// int visited : 해당 원소 사용했는지 체크

static void permutation (int idx, int visited) {
  if (idx==N) {
    System.out.println(Arrays.toString(result));
    return;
  }
  for (int i=0; i<N; i++) {
    if ((visited & (1<<i)) != 0) continue;
    result[idx] = nums[i];
    permutation(idx+1, visited | (1 << i));
  }
}
```


### 순열 구현 (Next Permutation)
현재 순열을 사전순(오름차순)으로 나열했을 때, 바로 다음 순열로 바꿔주는 알고리즘

정렬된 시작 상태에서 한 번에 다음으로 이동하는 형태 (중복된 원소는 한 번만 등장)

#### Next Permutation 알고리즘 순서
1. 뒤에서부터 기울기가 음수로 바뀌는 값 NP를 찾는다.
2. NP 뒤 중에서 NP-1번째 index보다 크면서 가장 작은 값을 찾는다.
3. Swap
4. 뒤쪽을 최소로 정리 (오름차순 정렬)

#### 예시 코드
```
public class np {
	static int N = 4;
	static int[] nums = {0,1,2,3}; // 오름차순으로 되어 있어야 함
	
	public static void main(String[] args) {
		do {
			System.out.println(Arrays.toString(nums));
		} while (nextPermutation());
	}
	static boolean nextPermutation() {
		// 1. 뒤에서부터 바꿀 위치 찾기 (기울기가 음수가 되는 지점 찾기)
		int idx = N-1;
		while (idx > 0 && nums[idx-1] >= nums[idx]) {
			idx--;
		}
		// 꺾이는 지점이 없다면 false를 반환
		if (idx==0) return false;
		
		// 2. 바꿀 위치
		int pivot = idx - 1;
		
		// 3. pivot보다 큰 값 중 가장 뒤에 있는 값 찾기
		int i = N-1;
		while (nums[i] <= nums[pivot]) {
			i--;
		}
		
		// 4. Swap
		int tmp = nums[pivot];
		nums[pivot] = nums[i];
		nums[i] = tmp;
		
		// 5. 꺾이는 지점을 기준으로 뒤쪽은 내림차순 정렬과 같으니 뒤집어서 정리한다.
		int left = idx, right = N-1;
		while (left < right) {
			tmp = nums[left];
			nums[left] = nums[right];
			nums[right] = tmp;
			left++;
			right--;
		}
		return true;
	}
}
```
