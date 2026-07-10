# PROCESS — storage (의존성 최신화 · 버그 수정 · 보안 · 컨벤션 리팩토링)

> 베이스 룰: `~/.claude/convention/*`. 합의: [docs/acknowledge/2026-07-10-hub-sync-decisions.md](./acknowledge/2026-07-10-hub-sync-decisions.md)
> 런타임 bun. 커밋: 영어 명령형 평문(하이픈 불릿 본문), 브랜치 vercel.

## 작업 1 — 의존성 최신화 · 기준선 green 화 (Phase 1)

- [x] a. 전체 의존성 최신화 (typescript 5.x 유지 · @types/node major 유지 · eslint peer 범위 내)
- [x] b. next 16.2.x (정확버전 고정 갱신) + eslint-config-next 동반 갱신
- [x] c. stale 테스트 수정: upload.test.ts 의 100MB 상한 가정을 env 기반(NEXT_PUBLIC_MAX_UPLOAD_SIZE_BYTES) 현행 코드에 맞게 갱신
- [x] d. 검증: `bunx tsc --noEmit` → `bun run build` → `bun test` (102 전부 pass 목표)
- [x] e. 커밋 (영어 평문)

## 작업 2 — mimeFilter dead path 버그 수정 (합의 9번)

- [x] a. hub 의 GET /api/drive/assets 쿼리 스키마에 mimeType 지원 여부 확인
- [x] b. 지원 시: AssetListParams · listAssets 에 mimeType 배선. 미지원 시: hub 쪽 스키마 확장과 함께 수정 (hub 작업으로 연계)
- [x] c. 테스트 + 커밋

## 작업 3 — 보안 (Phase 2)

- [x] a. Workflow(opus·xhigh) 심층 보안 감사
- [x] b. 발견 이슈 중 심각·운영 지장 이슈 즉시 수정 (CSP unsafe-inline/unsafe-eval 하드닝 검토 포함)
- [x] c. 리포트 docs/ 기록 + 커밋

## 작업 4 — 컨벤션 리팩토링 (합의 11번)

- [x] a. zustand(shared/store/storage-store.ts) 유지 결정. 당초 합의 11번(전면 리팩토링)에서 제거 대상이었으나, 사용자가 유지로 확정하고 컨벤션도 조건부 허용으로 갱신됨. 코드 변경 없음. 결정 근거: [docs/acknowledge/2026-07-10-hub-sync-decisions.md](./acknowledge/2026-07-10-hub-sync-decisions.md) 15번
- [x] b. features 레이어 비즈니스 로직 위젯 이관: delete-confirm-dialog(직접 api 호출+무효화) · file-detail-panel(useEffect raw fetch → useQuery)
- [x] c. shared/ui/virtual-scroll.tsx useCallback 제거 + 매직넘버 상수화
- [x] d. dead constant 정리 (ASSET_DOWNLOAD)
- [x] e. 검증(tsc → build → test) + 커밋

## 진행 로그

- 2026-07-10: 정찰 완료(기준선 tsc PASS · test 101/1 fail — stale 테스트), 합의 문서 기록, 체크리스트 작성.
- 2026-07-10: 작업 1 완료 — 의존성 최신화 · stale 업로드 테스트 env 기반 수정 · test 102 pass · 커밋 b5375a6.
- 2026-07-10: 보안 감사 완료. production CSP unsafe-eval 제거+object-src none(test 102 pass). 커밋 2bf9fdb. 리포트: docs/security-audit-2026-07-10.md
- 2026-07-10: 작업 2(mimeFilter, hub 지원 확인 후 배선) + 작업 4 부분(virtual-scroll useCallback, features 로직 이관, dead constant) 완료. test 102 pass. 커밋 adc76ab.
- 2026-07-10: zustand 제거는 사용자 판단으로 철회 — 유지 결정. 컨벤션이 전역 상태 라이브러리를 조건부 허용으로 갱신됨. 작업 4a 를 "유지 결정"으로 정정, acknowledge 15번 기록. 코드 무변경.
- 2026-07-10: docs 검수. PROCESS·security-audit·acknowledge 를 실제 코드(git log·파일)와 대조. 드리프트 정정: (1) zustand 유지로 정정, (2) security-audit STORAGE-002/003 참조 위치가 adc76ab 리팩토링으로 이동한 사실을 각 항목에 명시. 모든 커밋 반영 확인, 작업트리 clean.
