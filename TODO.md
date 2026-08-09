# 사용자가 직접 해야 할 일

## 1. 방명록 (Notion)
- [x] Notion 커넥션 생성 → 액세스 토큰 발급 (Developer portal → New token). 노션이 UI 명칭을 "Integration"에서 "Connection"으로 바꿔서 예전 문서와 이름이 다름
- [x] 방명록 DB 생성 — 페이지 "민수현" 안의 인라인 표 "방명록", 속성은 `Name`(Title) + `Message`(Text) 두 개
- [x] DB에 커넥션 연결 (DB `···` → 연결 → 커넥션 이름으로 검색). 안 하면 토큰이 유효해도 `object_not_found`가 남 — 노션은 권한 없음과 존재하지 않음을 구분해주지 않음
- [x] `.env.local`에 `NOTION_TOKEN`, `NOTION_DATABASE_ID` 입력
- [x] 실제 읽기/쓰기 동작 확인 (테스트 행 1건 작성 후 조회됨 — 노션에서 지우면 됨)
- [ ] Vercel 프로젝트 Settings → Environment Variables에도 동일하게 등록 (배포용, 로컬과 별개)
- **토큰 권한**: Read content + Insert content 만 켜고 Update content와 사용자 정보 접근은 끔. 토큰이 새어도 기존 메시지를 고치거나 워크스페이스 멤버 이메일을 읽을 수 없게 하기 위함. 대신 DB 스키마를 API로 못 고치니 속성 변경은 노션에서 직접 해야 함
- **`CreatedAt` 속성은 불필요**: 코드가 노션 내장 메타데이터 `page.created_time`을 읽고 정렬도 `timestamp: "created_time"`으로 함. 별도 속성을 참조하는 곳이 없음
- **속성 이름은 대소문자까지 정확해야 함**: `page.properties.Name` / `page.properties.Message`로 직접 찾기 때문에 `이름`이나 `name`이면 조회 시 실패
- **로컬 테스트는 `npm run dev`로 안 됨**: `api/`는 Vercel 서버리스 함수라 vite가 실행하지 않고 소스를 그대로 텍스트로 반환함. 방명록 조회 실패는 `Guestbook.tsx`에서 조용히 무시되어 화면상 티도 안 나니 주의. `vercel dev`를 쓰거나 `npx vite-node`로 `api/guestbook.notion.ts`를 직접 호출해 확인할 것
- **삭제 정책**: 사이트에는 삭제 버튼을 두지 않음(하객이나 임의 사용자가 지울 수 있게 되는 걸 방지). 지워야 할 메시지가 생기면 Notion 데이터베이스에 접근 권한이 있는 개발자/혼주가 Notion에서 직접 해당 행을 삭제하면 됨

## 2. 사진 업로드 (네이버 폼)
- [ ] 네이버 폼에서 "파일첨부" 질문이 포함된 폼 생성
- [ ] 생성된 폼 URL을 `src/constants/weddingInfo.ts`의 `PHOTO_UPLOAD_FORM_URL`에 붙여넣기

## 3. 지도 (네이버 지도)
- [x] NCP Maps API 키(Dynamic Map) 발급 완료, `NAVER_MAP_CLIENT_ID`에 반영함
- [ ] NCP 콘솔 → 해당 애플리케이션 → 서비스 URL에 `https://www.minsuhyeon.life`와 로컬 개발용 `http://localhost:5173` 등록 확인 (등록 안 하면 지도가 401 에러로 안 뜸)
- [x] 지도 렌더링 코드 구현 완료 (`LocationMap.tsx` + `naverMapLoader.ts`), 서울올림픽파크텔 위치에 마커 표시

## 4. 사진 / 배경음악
- [x] 배경음악 연결 완료 (`Work2.mp4`에서 afconvert로 오디오 추출 → `public/bgm.m4a`, 첫 상호작용 시 자동재생 + 상단 배너)
- [x] 갤러리 사진 27장 적용 완료 (`민수현` 폴더 → `src/assets/gallery/000~026.jpg`, 손 뽀뽀 사진을 맨 앞으로 재배치), 클릭 시 원본 라이트박스로 확대 없이 보기 가능
- [x] 인트로(시작 장면) 사진 적용 완료, og:image는 별도로 1200×630 가로 비율로 재크롭
- [ ] `/Users/jaewi/Downloads/Work2.mp4`가 저작권 문제 없는 음원인지 확인

## 5. 폰트 라이선스
- [x] 본문 폰트는 조선일보명조체(ChosunMyungjo) — 눈누(noonnu.cc) 기준 상업적 이용 무료 확인, jsDelivr CDN으로 로드
- [x] 강조 문구("We're getting Married!")는 Google Fonts `Dancing Script` 사용 (라이선스 문제 없음)

## 6. 배포
- [x] GitHub 저장소(`Jaymyong66/minsuhyeon`)에 push
- [x] Vercel 프로젝트 연결 및 배포 — **`main`에 push하면 자동 배포됨**. 따로 할 일 없음
- [x] Vercel 프로젝트 Settings → Domains에서 `www.minsuhyeon.life` 추가 (호스팅케이알 DNS의 `www` CNAME 레코드는 이미 Vercel 값으로 설정되어 있음 — Invalid Configuration이 계속되면 도메인을 삭제 후 재추가해 재검증 트리거)
- [ ] Vercel Settings → Environment Variables에 `NOTION_TOKEN`, `NOTION_DATABASE_ID` 등록 ← **이것만 남음**. 안 하면 배포본 방명록만 500
- **`api/` 에는 실제 엔드포인트 파일만 둘 것**: Vercel은 `api/` 안의 모든 파일을 서버리스 함수로 만든다. 공유 모듈이나 테스트 파일을 여기 두면 default export가 없어서 각각 500을 뱉는 공개 엔드포인트가 된다. 그래서 공유 코드는 `lib/`에 둔다
- **`api/`는 타입체크 대상이 아님**: `tsconfig.app.json`이 `src`만 포함해서 `npm run build`가 `api/`의 오류를 잡지 못한다. 이쪽을 고칠 때는 `npx vite-node`로 직접 실행해 확인할 것

## 7. 최종 확인
- [ ] 카카오톡으로 링크를 공유해서 인앱 브라우저에서 실제로 열어보고, 배경음악이 첫 상호작용 후 재생되는지 확인
- [ ] 신랑측/신부측 계좌 아코디언, 복사 토스트, 갤러리 라이트박스, 방명록 작성이 실기기에서 정상 동작하는지 확인
- [ ] 카카오 공유 디버거(https://developers.kakao.com/tool/clear/og)로 새 썸네일/문구가 반영되는지 확인
