# AI Agent

## LLM only
### LLM의 한계
LLM은 텍스트를 생성할 수 있지만, 실제 시스템에서 작업을 수행하는 것은 불가능

해결책: Tool을 연결하여 실제 행동 가능하게 만들기

## LLM + Tool
> Tool-learning : LLM이 외부 함수(도구)를 호출하여 작업을 수행하는 능력

Tool을 연결하여 LLM이 실제 **행동**을 수행할 수 있게 만들기

### Tool-learning의 한계
Agent가 이전 대화의 맥락을 유지 못함

## LLM + Memory - 맥락 유지하기
Memory를 추가하여 대화 맥락 유지

### LLM + Memory의 한계
복잡한 요청에 대해 처리 한계

## LLM + Plan - 의사결정 구조 만들기 + ReAct
복잡한 요청을 처리하기 위한 Plan 로직 추가 + ReAct 프레임워크

해결책 : `create_react_agent`를 사용하여 복잡한 요청 처리 가능
*별도의 Plan 프롬프트 작성 없이도 Thought -> Action -> Observation 순환이 자동으로 처리*

### ReAct(Resoning + Action) 프레임워크
**추론(Thought)**과 **행동(Action)**을 번갈아 수행하며, **관찰 결과(Observation)**를 다음 추론에 반영하는 프레임워크

#### `create_react_agent`의 특징
| 특징 | 설명 |
|------|------|
| 내장 ReAct 패턴 | Thought -> Action -> Observation 순환이 자동으로 처리됨 |
| 간편한 사용 | LLM, Tool, Prompt만 전달하면 Agent 생성 완료 |
| Memory 지원 | checkpointer 파라미터로 대화 기록 유지 가능 |

#### `create_react_agent` vs StateGraph 직접 구현

| 항목 | create_react_agent | StateGraph 직접 구현 |
|------|--------------------|----------------------|
| 구현 난이도 | 쉬움 (1줄) | 중간 (그래프 정의 필요) |
| 커스터마이징 | 프롬프트 수준 | 노드/엣지 수준 |
| 내부 동작 이해 | 블랙박스 | 완전히 파악 가능 |

## StateGraph
> LangGraph에서 제공하는 **Agent 워크플로우 정의 도구**
>
> 노드(Node)와 엣지(Edge)로 Agent의 실행 흐름을 명시적으로 정의 가능

## StateGraph 장점
1. 내부 동작 이해 : 어떻게 동작하는지 파악
2. 커스터마이징 : 노드/엣지 수준의 세밀한 제어 가능
3. 디버깅 : 각 노드에서 무슨 일이 일어나는지 추적 용이

```
┌─────────────────────────────────────────────────────────┐
│                    StateGraph 구조                      │
│                                                          │
│   [START] ──→ [Node A] ──→ [Node B] ──→ [END]          │
│                   │                                      │
│                   └──→ [Node C] ──→ [END]               │
│                                                          │
│   • 노드(Node): 실행할 함수                              │
│   • 엣지(Edge): 노드 간 연결 (무조건/조건부)             │
│   • 상태(State): 노드 간 공유되는 데이터                 │
└─────────────────────────────────────────────────────────┘
```

### StateGraph 핵심 컴포넌트
| 컴포넌트 | 설명 | 예시 |
|---------|------|-------|
| AgentState | 그래프 전체에서 공유되는 상태 정의 | messages, tool_calls |
| add_node() | 노드(함수) 추가 | workflow.add_node("agent", call_agent |
| add_edge() | 노드 간 연결 (무조건 이동) | workflow.add_edge("tools", END) |
| add_conditional_edges() | 조건부 분기 | 도구 호출 여부에 따라 분기 |
| set_entry_point() | 시작 노드 지정 | workflow.set_entry_point("agent") |
| START, END | 특수 노드 (시작/종료) | 그래프의 진입점과 종료점 |

## Direct Graph
> 도구를 1회만 실행하고 종료하는 단순한 워크플로우
>
> Tools -> END 엣지를 통해 반복 없이 즉시 결과를 반환

### Direct 패턴
- 단일 패스(Single-pass) : 도구를 1회 호출 후 바로 종료
- 빠른 응답 : 반복 없이 즉시 결과 반환
- 단순 작업에 최적화 : 주문 조회, 정책 검색 등 1-step 작업에 적합

### Direct 패턴 그래프 구조

```
[START] → [Agent] → [Tools] → [END]
              ↓
          (도구 없음) → [END]

※ 핵심: tools 후 바로 END (반복 없음)
```

### 구현 순서

1. **분기 함수 작성**: 도구 호출 여부 판단
2. **Graph 생성**: `StateGraph(AgentState)`
3. **노드 등록**: `add_node("agent", call_agent)`
4. **엣지 연결**: `add_edge()`, `add_conditional_edges()`
5. **컴파일**: `workflow.compile()`

### Direct Graph 장단점
- 장점 : 단순 요청에서 빠르고 효율적 (도구 1회 실행)
- 한계 : 복잡한 요청에서 여러 단계가 필요한 작업 처리 불가

## ReAct Graph
> Tools -> agent 순환 엣지를 통해 추론과 행동을 반복
>
> 복잡한 멀티스텝 작업을 처리할 수 있음

### Direct vs ReAct 비교표
| 패턴 | 도구 실행 후 | 복잡한 요청 | 그래프 구조 |
|------|-------------|------------|-------------|
| Direct | 바로 종료 | 처리 불가 | tools -> END |
| ReAct | agent로 복귀 | 처리 가능 | tools -> agent (순환) |

### ReAct 패턴 그래프 구조

```
        ┌──────────────┐
        │    START     │
        └──────┬───────┘
               ↓
        ┌──────────────┐
        │   Agent      │ ←──────┐
        │  (LLM 호출)  │        │
        └──────┬───────┘        │
               ↓                │
        ┌──────────────┐        │
        │  조건 분기   │        │
        └──────┬───────┘        │
         ↓           ↓          │
   ┌─────────┐  ┌─────────┐     │
   │  Tool   │  │   END   │     │
   │  실행   │  └─────────┘     │
   └────┬────┘                  │
        └───────────────────────┘  ← ReAct 핵심: 순환
```

### 구현 순서

1. **ReAct 분기 함수 작성**: Direct와 달리 "이미 실행됨" 체크 없음
2. **ReAct 시스템 프롬프트 작성**: Thought -> Action -> Observation 순환 유도
3. **Graph 구성**: `tools -> agent` 순환 엣지 추가
4. **컴파일 및 테스트**

## Trustworthiness
> Agent가 안전하게 행동하도록 신뢰성 확보

### Trustworthiness 구성요소
| 구성요소 | 역할 |
|---------|-------|
| 검증 로직 | 실행 전 정책 준수 확인 |
| 입력 가드레일 | 유해/부적절한 요청 차단 |
| 출력 가드레일 | 민감 정보 필터링 |
| 도구 권한 제한 | 허용된 도구만 실행 |

### Trustworthiness 요약

| 보호 계층 | 역할 | 적용 위치 |
|----------|------|----------|
| **입력 가드레일** | 유해 요청 차단 | Agent 실행 전 |
| **검증 로직** | 정책 준수 확인 | 도구 실행 전 |
| **출력 가드레일** | 민감 정보 필터링 | 응답 반환 전 |

```
[사용자 입력] → [입력 가드레일] → [Agent/ReAct] → [검증 로직] → [도구 실행] → [출력 가드레일] → [응답]
```
