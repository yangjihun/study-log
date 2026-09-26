## MVC 패턴

#### 기존 문제

- **중복 코드 발생**
- **하드코딩된 경로**
- **단일 책임 원칙(SRP) 위반**

#### MVC 패턴이란

<aside>

**Model - View - Controller** 애플리케이션을 세 가지 역할로 분리하는 소프트웨어 아키텍처 패턴

</aside>

| 구성 요소 | 핵심 역할 | 주요 책임 | Spring 대표 클래스 |
| --- | --- | --- | --- |
| Model | 비즈니스 로직 & 데이터 | 데이터 조회/수정/저장, View에 어떻게 보일지는 신경 x | XxxService / XxxRepository / XxxDao |
| View | 사용자 화면(UI) | Model 데이터를 받아 화면 구성, 자체적으로 데이터를 보관 x | helo.jsp / index.html (JSP, HTML) |
| Controller | 요청 처리 & 연결 | 클라이언트 요청 수신, 비즈니스 로직 호출, Model 결과를 View에 전달 | XxxController.java / @Controller |

<img width="400" height="260" alt="image" src="https://github.com/user-attachments/assets/055da2be-d12f-4ae3-af66-fafc7d60d868" />


## Spring Web MVC

<aside>

> **Servlet API를 기반으로 구축된 Web Framework**

</aside>

#### Spring MVC - 요청 처리 흐름

1. 클라이언트 요청이 들어오면 `DispatcherServlet`이 받는다.
2. `HandlerMapping` 이 어떤 Controller가 요청을 처리할지 결정한다.
3. `DispatcherServlet`은 Controller에 요청을 전달
4. Controller는 요청을 처리한다.
5. 결과 (요청처리를 위한 data, 결과를 보여줄 view의 이름)를 `ModelAndView`에 담아 반환
6. `ViewResolver`에 의해서 실제 결과를 처리할 View를 결정하고 반환
7. 결과를 처리할 View에 `ModelAndView`를 전달
8. `DispatcherServlet`은 View가 만들어낸 결과를 응답

#### Spring MVC 구성요소

| 구성요소 | 역할 유형 | 설명 |
| --- | --- | --- |
| `DispatcherServlet` | 핵심 중추 | Front Controller 역할, 모든 HTTP 요청을 받아 처리하고 클라이언트에 응답을 전달 |
| `HandlerMapping`  | 요청 라우팅 | URL과 Controller 메서드를 매핑, 어떤 핸들러가 요청을 처리할지 결정 |
| `HandlerAdapter`  | 핸들러 실행 | 선택된 Handler를 실제로 실행시키는 어댑터, 다양한 핸들러 타입(어노테이션 기반 등) 지원 |
| `ViewResolver` | 뷰 결정 | Controller가 반환한 뷰 이름 → 실제 View 객체로 변환 (예 : `list`  → `/WEB-INF/views/list.jsp)`  |
| `View`  | 화면 생성 | Model 데이터를 활용하여 실제 응답 HTML을 생성 (JSP 등) |
| `Controller` | 비즈니스 로직 (개발자 작성) | 비즈니스 로직 호출 후 결과를 Model에 저장하고 뷰 이름 반환, @Controller 어노테이션으로 작성 |

## Spring MVC와 3-Tier 아키텍처

<aside>

**기존 Servlet 방식의 한계와 관심사 분리**

하나의 클래스에 혼재된 역할이 많아 비즈니스 로직과 화면(프레젠테이션) 로직의 강결합 문제
→ 유지보수 한계

</aside>

#### 3-Tier 아키텍처

프레젠테이션(Controller), 비즈니스(Service), 데이터 접근(DAO) 계층으로 역할을 나눠 설계 (SRP원칙 준수)

#### DTO를 사용하는 이유

- 메서드의 매개변수가 길어지는 것을 방지 (가독성 향상)
- Controller, Service, DAO 각 계층 간 **의존성을 낮추고 안전하게 데이터만 전달**

#### 계층별 핵심 구현

1. 프레젠테이션 계층 - Controller
- @Controller : 클라이언트 요청(URI) 매핑 및 애플리케이션 흐름 제어
- 요청 데이터 바인딩 및 Service 계층으로의 비즈니스 로직 위임
1. 비즈니스 계층 - Service
- @Service : 도메인 핵심 비즈니스 로직 및 트랜잭션(Transaction) 처리
- 프레젠테이션 계층과 데이터 접근 계층 간의 브릿지 역할 수행
1. 데이터 접근 계층 - DAO
- @Repository : 데이터베이스(DB) 연동 및 데이터의 안전한 저장/조회 전담
- SQL 질의 (CRUD) 수행을 통한 데이터 접근 로직 추상화

#### 3-Tier 아키텍처와 패키지 설계의 원칙
> 3-Tier 아키텍처를 패키지(물리적 디렉토리)에 투영하여 유지보수성을 극대화 (가시성, 예측가능성)

```java
src/main/java/com/ssafy/mvc
  |
  |- dto
  |    |- BoardDto.java
  |
  |- controller
  |    |- BoardController.java // @Controller  - 클라이언트의 요청(URL)을 매핑하고 Service 호출
	|
	|- service
	|    |- BoardService.java  - (Interface) 게시판 비즈니스 로직 명세서
	|    |- BoardServiceImpl.java // @ Service  - Service 인터페이스의 실제 구현체. DAO 호출
	|
	|- dao
	|    |- BoardDao.java
	|    |- BoardDaoImpl.java  // @Repository  - DB 접근 클래스
	|
```

## Spring Web MVC

#### Spring Boot 자동 설정 핵심

- `ViewResolver` , `HandlerMapping` , `HandlerAdapter`  → `Auto-configuration`으로 자동 등록
- main 클래스에 `@SpringBootApplication`  → `@ComponentScan` 포함
- JSP 사용 시 : `tomcat-embed-jasper`  + `spring.mvc.view.prefix/suffix` 설정 필요

#### 컨트롤러(@Controller)

- 핸들러(Handler)의 한 종류로 클라이언트의 요청을 받아들이는 역할의 클래스
- 스테레오타입 어노테이션인 @Controller로 표현 ( @component 상속, 컴포넌트 스캔 대상)
- 컨트롤러 내에는 다양한 요청을 처리할 수 있는 핸들러 메서드(Handler Method)들을 구성

#### @RequestMapping

- URL(value)와 HTTP 메서드(method)를 선언적으로 지정
- DispatcherServlet이 요청을 받으면 이 설정을 참조해 호출
- 클래스 레벨 : 클래스 내에 소속된 모든 메서드 경로의 접두사(prefix)
- 메서드 레벨 : 해당 메서드에만 적용되는 경로

```java
@Controller
@RequestMapping("/simple")
public class SimpleController {
	// @RequestMapping("")
	// @RequestMapping(value = "", method = RequestMethod.GET)
	@RequestMapping(value={"", "/index"}, method=RequestMethod.GET) // 최종 경로 : /simple, /simple/index
	public String index() {
		return "index"; // View 이름
	}
	
	@RequestMapping(value="/hello", method=RequestMethod.GET) // 최종 경로 : /simple/hello
	public String hello() {
		return "hello";
	}
}
```

#### 축약형 어노테이션 - HTTP 메서드를 이름에 명시

- @GetMapping / @PostMapping / @PutMapping 등
@GetMapping = @RequestMapping(method=RequestMethod.GET)의 축약
- 코드 가독성 향상, HTTP 메서드 혼동 방지

| 어노테이션 | HTTP 메서드 | 주요 용도 |
| --- | --- | --- |
| @GetMapping | GET | 조회 (목록, 상세) |
| @PostMapping | POST | 등록 (데이터 전송) |
| @PutMapping | PUT | 전체 수정 |
| @PatchMapping | PATCH | 부분 수정 |
| @DeleteMapping | DELETE | 삭제 |

#### 요청 처리 메서드(Request Handler)의 동작

- Spring MVC에서는 파라미터 추출/변환/바인딩을 HandlerAdapter가 자동 처리합니다.
- 파라미터 자동 추출과 Spring 제공 인자(Model)를 통해서 서블릿 API 의존성을 줄여 코드 생산성 증가

<img width="2279" height="234" alt="image" src="https://github.com/user-attachments/assets/0992691b-665d-4ca6-9d13-12e59fef4eb3" />


#### Handler Method Arguments - 주요 파라미터 타입 & 어노테이션

- 선언적 파라미터 사용 : 복잡한 처리 없이 어노테이션이나 타입 선언만으로 데이터를 가져옴
- 자동 파라미터 매핑 : 클라이언트의 요청 데이터를 자바 객체나 변수로 자동으로 변환

**주요 파라미터 타입**

| 파라미터 타입 | 설명 |
| --- | --- |
| `HttpServletRequest`  | HTTP 요청 정보 접근 (파라미터, 헤더, 속성 등) |
| `HttpServletResponse` | HTTP 응답 직접 조작 (상태코드, 헤더, 바디) |
| `HttpSession`  | 세션 정보 접근 / 속성 저장/조회 |
| `Model`  | 뷰에 전달할 데이터를 키-값으로 추가 |
| `Map`  | 뷰에서 사용할 속성 저장 (Model 동일) |

**주요 바인딩 어노테이션**

| 어노테이션 | 데이터 위치 | URL/요청 예시 |
| --- | --- | --- |
| `@RequestParam`  | 쿼리 파라미터 | ?keyword=스프링 |
| `@PathVariable` | URL 경로 변수 | /boards/{id} |
| `@ModelAttribute`  | 폼 데이터 | POST body |
| `@RequestBody`  | HTTP 본문 (JSON) | {”title” : ”…”} |
| `@RequestHeader`  | 요청 헤더 | User-Agent |
| `@CookieValue`  | 쿠키 값 | JSESSIONID |

#### @RequestParam이란

- URL 쿼리 파라미터 (?key=value)를 메서드 파라미터에 자동 바인딩
    - String → int, long 등 타입 변환도 자동 처리
    - 파라미터 이름이 변수명과 같으면 생략 가능
- 주요 속성(Attributes)
    
    
    | 속성 | 설명 | 기본값 |
    | --- | --- | --- |
    | value / name | 바인딩할 파라미터 이름 | 변수명과 동일 |
    | required | 필수 여부 | true |
    | defaultValue | 파라미터 없을 때 사용할 기본값 | 없음 |
- required & defaultValue 조합
    - required=false : 파라미터 없어도 400 에러 발생 안 함
    - defaultValue 지정 시 required는 자동으로 false 처리
    - keyword 없이 /search 접속 → keyword=”” →  전체 목록 출력

#### @PathVariable

- URL 경로 자체에 포함된 값을 추출하여 메서드 파라미터에 바인딩
    - 매핑 URL에 {변수명} 형태로 경로 변수 선언
    - /boards/3 → id = 3 으로 자동 변환
    - URL만으로 어떤 리소스인지 명확히 전달할 때 활용 (RESTful URL)
- URL 경로 변수 vs 쿼리 파라미터

| 방식 | URL 예시 | 특징 |
| --- | --- | --- |
| `@RequestParam`  | /search?keyword=스프링 | 선택적, 기본값 설정 가능 |
| `@PathVariable` | /boards/3 | 필수, RESTful 리소스 식 |

#### @ModelAttribute

- POST 요청의 폼 데이터를 DTO 객체에 자동 바인딩
    - 폼의 name 속성 = DTO 필드명 → setter 자동 호출
    - 여러 @RequestParam 대신 하나의 DTO로 처리
    - String → int, long 등 타입 자동 변환
- 동작 조건
    - DTO에 기본 생성자(no-arg constructor) 필수
    - DTO의 각 필두에 setter 메서드 필수
    ↔ Spring이 new XXXDto() 생성 후 → setter 호출 방식
    (*DTO 타입이면 @ModelAttribute 생략 가능)

#### 어노테이션 선택 기준

어노테이션 선택 기준은 데이터가 전달되는 위치이다.

- 쿼리 파라미터(?key-value)로 전달 → @RequestParam
- URL 경로(/boards/{id}) 로 전달 → @PathVariable
- POST 폼 데이터로 전달 → @ModelAttribute

| 어노테이션 | 데이터 위치 | URL / 요청 예시 | 주요 사용 사례 |
| --- | --- | --- | --- |
| `@RequestParam`  | 쿼리 파라미터 (?key=value 형태) | /search?keyword=스프링, /search (없으면 전체 목록) | 검색어, 필터 조건, 페이징 파라미터, 선택적 옵션 값 |
| `@PathVariable`  | URL 경로 변수 (/path/{변수} 형태) | /boards/3, /boards/category/공지 | 리소스 식별자(ID), RESTful URL 설계, 계층적 경로 표현 |
| `@ModelAttribute` | 폼 데이터 (POST body 형태) | POST /boards/write (title, content 폼 필드) | 등록/수정 폼 처리, 여러 필드를 DTO로, `@RequestParam` 대체 |

#### 핸들러 메서드 반환타입

컨트롤러 메서드의 실행 결과에 따라서 **뷰 이름/데이터 모델/응답 본문 자체**를 선택적으로 반환할 수 있는 유연성을 가짐

| 반환 타입 | 설명 | 예시 |
| --- | --- | --- |
| String | 뷰 이름 반환 → ViewResolver가 JSP 경로 결정 | `return “search”;` |
| ModelAndView | 뷰 이름 + 모델 데이터를 함께 반환 | `new ModelAndView("search", model)` |
| void | 응답 직접 작성 (HttpServletResponse 사용) | `response.getWriter().write("OK")`  |
| @ResponseBody + Object | 반환값을 HTTP 응답 본문으로 직접 전송 (REST API) | “Hello” / JSON 객체 |
