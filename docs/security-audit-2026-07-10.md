# 보안 감사·수정 리포트 — storage (2026-07-10)

> Workflow(opus·xhigh) 심층 감사 + medium 이상 적대적 검증 + 근본 수정.

## 감사 발견

### STORAGE-001 [medium] CSP script-src 에 'unsafe-inline' + 'unsafe-eval' — CSP 의 XSS 방어가 사실상 무력화 (검증: real=True, 조정 severity=low)
- 파일: `proxy.ts` 7-17 (특히 9행 script-src)
- 설명: proxy(미들웨어)가 모든 응답에 CSP 를 붙이지만 script-src 에 'unsafe-inline' 과 'unsafe-eval' 을 모두 허용한다. 이 두 지시가 함께 있으면 CSP 는 인라인/eval 스크립트 실행을 막지 못해 스크립트 인젝션 방어가 없는 것과 같다. 'unsafe-eval' 은 Next 프로덕션 런타임에 불필요하며(dev/turbopack 에서만 필요), 'unsafe-inline' 은 nonce 방식으로 대체 가능하다. 현재 앱 자체에는 dangerouslySetInnerHTML·innerHTML·eval·document.write 등 주입 sink 가 전혀 없어(grep 결과 0건) 오늘 당장 악용되는 경로는 없다. 그러나 향후 의존성 XSS 가젯이나 마크업 주입이 하나라도 생기면 CSP 가 즉시 방어선이 되지 못한다. object-src 미지정(default-src 'self' 로 fallback)·HSTS·Permissions-Policy 부재도 같은 하드닝 갭이다.
- 시나리오: 현재 코드 기준으로는 직접 실행 가능한 XSS sink 가 없어 즉시 악용 불가(PLAUSIBLE). 가정: 렌더 트리에 주입 sink(예: 미래의 dangerouslySetInnerHTML, 혹은 렌더링 라이브러리 XSS)나 반사형 마크업이 하나라도 유입되면 → 'unsafe-inline' 때문에 삽입된 <script> 가 그대로 실행되고, 'unsafe-eval' 로 문자열 eval 가젯까지 가능해져 세션 쿠키가 걸린 상태에서 임의 스크립트가 hub API(자기 자신 권한)로 요청을 보낼 수 있다.
- 운영영향: 보안 하드닝 갭. 운영 장애는 없음. acknowledge 문서 결정#6(운영·보안에 조금이라도 지장 있으면 즉시 수정)에 해당.

### STORAGE-002 [low] 공개 토글(isPublic)이 만료 없는 무인증 CDN URL 을 생성하지만 UI 가 노출 범위를 전혀 안내하지 않음
- 파일: `features/storage/file-detail-panel.tsx` 65-72 (handleTogglePublic); 근거: hyun-hub service/domain/drive/drive-asset.ts:429, service/shared/storage.ts:48 getUrl
- 설명: 상세 패널의 지구본/자물쇠 아이콘 토글은 asset 의 isPublic 을 뒤집는다. hub 의 getDetail 은 isPublic=true 인 L1 자산에 대해 프리사인(300초 만료) 대신 deps.storage.getUrl(=`${cdnDomain}/${s3Key}`) 즉 만료 없는 무인증 CDN URL 을 반환한다. 즉 토글 한 번으로 파일이 영구·무인증으로 접근 가능해진다. 프론트 UI 는 t.togglePublic 툴팁 한 줄뿐이고, 확인 다이얼로그·'공개 링크가 영구 생성됨' 경고·링크 회수(비공개 복귀 시 캐시/CDN 잔존) 안내가 없다. s3Key 에 UUID 가 포함되어 키 자체는 추측 불가하므로 '링크 공유' 모델이지 전체 공개 리스팅은 아니다.
- 시나리오: 사용자가 의미를 모른 채 토글을 켜면 해당 파일이 만료 없는 공개 URL 로 노출된다. 그 URL 이 로그·리퍼러·공유를 통해 유출되면 인증 없이 영구 접근 가능. 되돌려도(비공개 전환) 이미 노출된 URL 과 CDN 캐시는 무효화되지 않아 사실상 폐기(rotate) 없이는 회수 불가.
- 운영영향: 개인정보/노출 범위 인지 부족으로 인한 의도치 않은 파일 공개 위험. 기능 장애는 아님.

### STORAGE-003 [low] Server Action 경계에서 원시 에러 객체를 throw — 프로덕션에서 에러코드별 UX와 401 자동 리다이렉트가 소실
- 파일: `shared/api/fetch.ts` 25-29 (parseJson: throw json); 소비: entities/drive/query.ts:30-34 (useDriveMutation onError), entities/drive/error.ts:20-37
- 설명: parseJson 은 hub 가 {success:false} 를 주면 원시 객체 {success:false,error:{code,message}} 를 그대로 throw 한다. 이 함수는 'use server'(api.ts) 안에서 실행되어 Server Action 경계를 넘는다. Next.js 는 프로덕션에서 Server Action 이 throw 한 에러를 보안상 제네릭 Error(message 치환 + digest)로 대체해 클라이언트에 전달한다. 따라서 폴더/자산 뮤테이션(createFolder·updateFolder·deleteFolder·updateAsset·move*·deleteAsset — 전부 server action 경유)의 onError 는 원래 shape 를 못 받고, entities/drive/error.ts 의 isApiErrorResponse 가 false → 항상 t.errorUnknown 을 표시한다. 또한 isUnauthorizedError 가 false 가 되어 세션 만료(UNAUTHORIZED) 시 router.push('/login') 리다이렉트가 동작하지 않는다. 반면 업로드 경로(entities/drive/upload.ts)는 브라우저 직접 fetch 라 ApiErrorResponse 가 보존되어 정상 동작 — 경로별 동작 불일치.
- 시나리오: 보안 익스플로잇 아님(운영 결함). 프로덕션에서 사용자가 쿼터 초과·중복 파일·폴더명 중복 등으로 폴더/자산 작업 실패 시 구체 메시지 대신 '알 수 없는 오류' 만 노출된다. 세션 만료 상태에서 이름변경/이동/삭제 시도 시 로그인 페이지로 유도되지 않고 조용히 실패해 사용자가 원인을 알 수 없다.
- 운영영향: 프로덕션 한정 UX 저하 + 만료 세션 미리다이렉트. 결정#6(운영 지장 즉시 수정) 대상. 확신도 PLAUSIBLE(Next 프로덕션 server action 에러 리댁션 동작 기반, 실행 재현은 미수행).

### STORAGE-004 [low] CLI 도구 shadcn 이 dependencies 에 위치 — 대형 취약 의존성 트리 상시 설치 / 직접 의존 postcss 취약
- 파일: `package.json` 12-33 (dependencies 내 "shadcn": "^4.13.0"); "postcss": (devDependencies)
- 설명: bun audit 결과 29건(high 3·moderate 24·low 2). 그러나 fast-uri(high)·hono(다수)·qs·ip-address·js-yaml·@babel/core 등 거의 전부가 dependencies 에 잘못 들어간 shadcn CLI 의 전이 서브트리(shadcn › @modelcontextprotocol/sdk › express/hono/…) 및 eslint 개발 툴체인에서 나온다. shadcn 은 컴포넌트 생성용 CLI 로 런타임 import 그래프에 없어 Next 프로덕션 번들/서버리스에 포함되지 않으므로 실제 런타임 노출은 낮다. 다만 dependencies 위치 탓에 프로덕션 install 시에도 취약 트리+postinstall 표면이 상시 존재하고 audit 신호를 오염시킨다. 런타임 인접한 유일한 직접 의존은 postcss(빌드타임 CSS, moderate: </style> 언이스케이프 XSS advisory)다.
- 시나리오: 런타임 원격 악용 경로는 확인되지 않음(PLAUSIBLE/info 수준). 공급망 관점: shadcn 전이 의존의 postinstall/변조 패키지가 CI·배포 환경에서 실행될 표면이 불필요하게 넓다. postcss 취약은 신뢰되지 않은 CSS 를 빌드 입력으로 넣을 때만 유효한데 본 프로젝트는 자체 CSS 만 처리하므로 실질 위험 낮음.
- 운영영향: 공급망 표면·audit 노이즈. 직접적 운영 장애 없음. 결정#1·#6(의존성 최신화·운영 지장 수정)과 일치.

## 수정 내역

### STORAGE-001 — fixed
- 변경: proxy.ts 의 CSP script-src 에서 production 일 때만 'unsafe-eval' 을 제거하도록 process.env.NODE_ENV 로 분기. SCRIPT_SRC_DIRECTIVE 상수를 도입해 production 은 "script-src 'self' 'unsafe-inline'", dev 는 "script-src 'self' 'unsafe-inline' 'unsafe-eval'" (Turbopack HMR용) 를 사용. 'unsafe-inline' 은 Next 인라인 부트스트랩 때문에 유지. 없던 object-src 'none' 를 CSP_HEADER 배열에 추가.
- 근본원인 해결: Next 16 프로덕션 런타임은 브라우저 eval 을 요구하지 않는데(React Compiler 는 빌드타임, framer-motion·react-query·radix·zustand·better-auth 는 런타임 eval 미사용) CSP 가 무조건 'unsafe-eval' 을 허용해 XSS 완화가 약화돼 있었음. NODE_ENV 분기로 production 에서만 eval 을 차단해 근본 원인(불필요한 eval 허용)을 제거. Next 가 build 시 process.env.NODE_ENV 를 리터럴로 인라인하므로 production 번들에는 분기가 확정되어 baked-in 됨(빌드 번들 grep 으로 확인).
- 파일: /Users/hyunseokbyun/storage/proxy.ts

## 문서 검수 후속 상태 (2026-07-10)

- 이 감사 이후 같은 날 리팩토링 커밋 adc76ab(features 로직 위젯 이관)이 들어가면서, 미수정으로 남은 STORAGE-002·003 의 코드 참조 위치가 이동했다. 발견 자체는 여전히 유효하며, 현재 코드 기준 위치만 아래로 갱신한다.
  - STORAGE-002(isPublic 공개 토글 경고 부재, 미수정): 토글 핸들러가 `features/storage/file-detail-panel.tsx` 에서 presentational `onTogglePublic` prop 으로 바뀌었고, 실제 뮤테이션(`handleToggleDetailPublic`)은 `widgets/storage/storage-layout.tsx` 130-134 로 이관됨. 파일은 여전히 확인 다이얼로그·영구 공개 경고가 없다.
  - STORAGE-003(server action 에러 리댁션, 미수정): throw 지점은 `shared/api/fetch.ts` 27행(`throw json as ApiErrorResponse`)으로 이동. 근본 상황(server action 경계에서 원시 에러 throw)은 그대로.
- STORAGE-004 권고(shadcn 을 devDependencies 로 이동)는 미적용 상태다. `package.json` 에서 shadcn 은 여전히 dependencies 에 있다. postcss 는 8.5.16(devDependencies)로 상향 완료.

## 후속(followUps)

- 'unsafe-inline' 을 nonce 전략으로 대체(Next 인라인 부트스트랩 스크립트에 per-request nonce 적용) — 이번 범위 밖으로 지시받아 미수행.
- 선택적 확인: next start 로 production 서버를 띄우고 브라우저 콘솔에서 실제 CSP 위반 0건을 육안 확인. 이번엔 빌드 번들 실측(production 청크에 unsafe-eval 부재 확정)으로 대체함.
- 레포에 여러 lockfile 존재(/Users/hyunseokbyun/package-lock.json 와 storage/bun.lock)로 Next 가 workspace root 를 오추론하는 경고 발생 — 이번 작업과 무관하나 turbopack.root 설정 또는 불필요 lockfile 정리 검토 필요.

## 검증
- typecheck: bunx tsc --noEmit → exit 0 (에러 없음)
- test: bun test → 102 pass, 0 fail, 520 expect() calls, 17 files (기존 102 pass 유지)

## 의존성 취약점
bun audit 실행 완료(bun v1.3.11). 총 29건: high 3 · moderate 24 · low 2. 분포: (1) 거의 전부가 dependencies 에 잘못 배치된 shadcn CLI 의 전이 트리 — shadcn › @modelcontextprotocol/sdk › express/hono/qs/ip-address/express-rate-limit, 그리고 ts-morph/cosmiconfig. fast-uri(high, path traversal/host confusion)·hono(high CORS wildcard+credentials 외 다수)·qs(moderate DoS)·ip-address(moderate XSS)·js-yaml(moderate DoS)가 여기서 나옴. (2) eslint 개발 툴체인 — brace-expansion·@babel/core(low)·fast-uri. (3) 런타임 인접 직접 의존: postcss <8.5.10 (moderate: </style> 언이스케이프 CSS stringify XSS) — next·tailwindcss 경유도 동일. 판정: shadcn/eslint 서브트리는 Next 앱의 런타임 import 그래프에 없어(빌드/CLI 전용) 프로덕션 서버리스·클라이언트 번들에 포함되지 않음 → 실제 원격 악용 경로는 확인되지 않음. 조치 권고: shadcn 을 devDependencies 로 이동(또는 제거, bunx 사용), bun update 로 postcss 8.5.10+ 및 나머지 compatible 상향 후 재감사. 상세는 STORAGE-004.
