### 병합 정렬 (Merge Sort)
> 분할 정복(Divide and Conquer) 기법을 활용한 안정적인 정렬 알고리즘

시간 복잡도 : $$O(N log N)$$

#### 단계 별 동작
- 분할(Divide) : 주어진 배열은 반으로 나눈다
- 정복(Conquer) : 각 부분 배열을 재귀적으로 병합 정렬을 사용해 정렬한다
- 병합(Combine) : 정렬된 부분 배열들을 합쳐 전체 배열을 정렬한다

### 병합 정렬 과정

<img width="462" height="298" alt="image" src="https://github.com/user-attachments/assets/b796d691-02ca-4cc6-b28a-8ca0d8649eec" />

<img width="462" height="298" alt="image" src="https://github.com/user-attachments/assets/2ea53613-a432-42cc-b574-ab4e453a07f6" />

#### 병합 정렬 코드
``` Java
static void merge(int[] arr, int left, int mid, int right) {
  int L = left;
  int R = mid+1;
  int idx = left;
  int[] sortedArr = new int[arr.length];
  while (L<=mid && R <= right) {
    if (arr[L] <= arr[R]) {
      sortedArr[idx++] = arr[L++];
    }
    else {
      sortedArr[idx++] = arr[R++];
    }
  }
  if (L <= mid) {
    for (int i=L; i<=mid; i++) {
      sortedArr[idx++] = arr[i];
    }
  }
  else {
    for (int i=R; i<=right; i++) {
      sortedArr[idx++] = arr[i];
    }
  }
  for (int i=left; i<=right; i++) {
    arr[i] = sortedArr[i];
  }
}

static void mergeSort(int[] arr, int left, int right) {
  int mid = 0;
  if (left < right) {
    mid = (left + right) / 2;
    mergeSort(arr, left, mid);
    mergeSort(arr,mid+1, right);
    merge(arr, left, mid, right);
  }
}
```

#### 병합 정렬이 좋은 상황
- $$O(N log N)$$ 보장이 필요할 때
- 안정 정렬 (Stable)

#### 병합 정렬이 불리한 상황
- 추가 메모리가 부족할 때 ($$O(N)$$ 메모리가 듦)


### 퀵 정렬 (Quick Sort)
> 피벗(Pivot)이라는 기준 요소를 선택하여 배열을 두 부분으로 분할하고, 재귀적으로 정렬하는 방식

시간 복잡도 : $$O(N log N)$$, 최악에는 $$O(N^2)$$

#### 단계 별 동작
- 피벗(Pivot) 선택 : 배열에서 기준이 될 원소를 하나 선택한다
- 분할 (Divide) : Pivot 보다 작은 요소는 왼쪽에, 큰 요소는 오른쪽에 위치하도록 배열을 나눈다
- 정복 (Conquer) : 분할된 배열을 다시 재귀적으로 정복한다

#### 퀵 정렬 아이디어
퀵 정렬은 하나의 피벗(Pivot)을 기준으로 배열을 두 집합으로 나누는 방식이다.
- 피벗보다 작은 값들은 왼쪽
- 피벗보다 큰 값들은 오른쪽

이렇게 분할이 이루어지면,

각 부분 배열에 대해 같은 작업을 반복하면서 전체 배열이 정렬된다.

병합 정렬과 달리 정렬된 배열을 다시 합치는 과정이 필요하지 않다.

#### 퀵 정렬 과정
```
quickSort(int[] A, int l, int r) {
  if (l < r) {
    int pivot = partition(int[] A, int l, int r);
    quickSort(A, l, pivot-1);
    quickSort(A, pivot+1, r)
  }
}
```

#### 퀵 정렬 과정

예시 배열
```
[7, 2, 1, 6, 8, 5, 3, 4]
```
피벗을 `4`로 선택했다고 가정하면
```
[2, 1, 3] 4 [7, 6, 8, 5]
```
피벗을 기준으로 배열이 두 부분으로 나뉜다.

이후 각각의 부분 배열에 대해 같은 과정을 반복한다.
```
[2, 1, 3] -> 정렬
[7, 6, 8, 5] -> 정렬
```
이 과정을 재귀적으로 반복하면 전체 배열이 정렬된다.

#### 퀵 정렬 코드
``` Java
static void quickSort(int[] arr, int left, int right) {
  if (left >= right) return;

  int pivot = partition(arr, left, right);

  quickSort(arr, left, pivot - 1);
  quickSort(arr, pivot + 1, right);
}

static int partition(int[] arr, int left, int right) {
  int pivot = arr[right];
  int i = left - 1;

  for (int j = left; j < right; j++) {
    if (arr[j] < pivot) {
      i++;
      int temp = arr[i];
      arr[i] = arr[j];
      arr[j] = temp;
    }
  }

  int temp = arr[i + 1];
  arr[i + 1] = arr[right];
  arr[right] = temp;

  return i + 1;
}
```

#### 피벗 선택 방법
1. 첫 번째 요소 선택
2. 마지막 요소 선택
3. 가운데 요소 선택
4. 랜덤 요소 선택
5. 세 값의 중앙값 (Median of Three)

피벗을 어떻게 선택하는지에 따라 성능이 달라질 수 있다.

#### 퀵 정렬이 좋은 상황
- 추가 메모리가 부족할 때 (추가적인 공간을 필요치 않아 함)

#### 퀵 정렬이 불리한 상황
- $$O(N log N)$$ 보장이 필요할 때 (최악에는 $$O(N^2)$$)
- 안정 정렬이 필요할 때 (안정 정렬 x)


### 병합 정렬과 퀵 정렬 비교표

|정렬 | 시간 복잡도 | 메모리 | 안정성|
|-----|-------------|--------|-------|
|병합 정렬|$$O(N log N)$$|O(N)|안정 정렬|
|퀵 정렬|평균 $$O(N log N)$$|O(1)|안정 정렬 x|
