# maplestory_assignment1

## 실행 방법 (Docker Compose)

1. **프로젝트 루트(maple_ex) 폴더로 이동합니다.**

   ```bash
   cd maple_ex
   ```

2. **Docker Compose로 모든 서비스를 빌드 및 실행합니다.**

   ```bash
   docker compose up --build
   ```

3. **정상적으로 실행되면 아래와 같이 각 서비스가 기동됩니다.**

   - gateway_server: http://localhost:3001
   - auth_server: http://localhost:3002
   - event_server: http://localhost:3003
   - MongoDB: 내부 컨테이너에서 사용

4. **중지하려면**
   ```bash
   docker compose down
   ```

> 최초 실행 시에는 `--build` 옵션을 붙여주세요.  
> 코드 변경 후 재빌드가 필요할 때도 `--build`를 사용합니다.

---

## VS CODE 내 REST-CLIENT 사용시

1. **VS CODE 확장자 REST CLIENT 설치**

2. **gateway_server 내 gateway.http 사용**
   > MAPLE_EX/gateway_server/gateway_test/gateway.http 파일 사용

---

## POSTMAN 사용시

---

## 개요

유저: 아이디 생성 → 로그인 → 캐릭터 생성 → 보상 요청 → 보상 내역 확인

운영자: 아이디 생성 → 로그인 → 이벤트 생성 → 보상 등록 → 보상 수여(조건 자동 확인)

- 이벤트 설계: 캐릭터 일정 레벨 달성 or 아케인포스 달성

- 조건 검증: 유저가 생성한 캐릭터의 레벨 혹은 아케인포스 등을 운영자가 등록한 수치를 충족하는 유저에게 보상 수여 가능

-구현 중 고민: 기존 spring boot 스택 개발자로서 nestJs를 처음 접해봐서 서버 구현 및 
## 구조

### DB 구조

> USER:\
> 유저 정보 저장(유저 아이디, 비밀번호 등의 개인정보)\
> CHARACTER:\
> 유저 캐릭터 정보(캐릭터 닉네임, 레벨, 아케인포스)\
> EVENT:\
> 운영자가 등록한 이벤트(이벤트명, 서브명, 이벤트 내용, 조건, 보상 등)\
> REWARD:\
> 유저의 보상 요청 정보(참여 이벤트, 참여 캐릭터명 등)
