# 사용자가 직접 해야 할 일

## 1. 방명록 (Notion)
- [ ] [notion.so/my-integrations](https://www.notion.so/my-integrations) 에서 Integration 생성 → API 토큰 발급
- [ ] 방명록용 Notion 데이터베이스 생성 (필드: `Name`=Title, `Message`=Rich text, `CreatedAt`=Created time)
- [ ] 생성한 DB에 위 Integration을 "연결"(공유) — 안 하면 API 호출 시 권한 오류 발생
- [ ] `.env.local`에 `NOTION_TOKEN`, `NOTION_DATABASE_ID` 입력 (로컬 개발용, `.env.example` 참고)
- [ ] Vercel 프로젝트 Settings → Environment Variables에도 동일하게 등록 (배포용, 로컬과 별개)

## 2. 사진 업로드 (네이버 폼)
- [ ] 네이버 폼에서 "파일첨부" 질문이 포함된 폼 생성
- [ ] 생성된 폼 URL을 `src/constants/weddingInfo.ts`의 `PHOTO_UPLOAD_FORM_URL`에 붙여넣기

## 3. 지도 (네이버 지도)
- [ ] [네이버 클라우드 플랫폼(NCP)](https://www.ncloud.com/)에서 Maps API 키 발급
- [ ] 서비스 도메인에 `www.minsuhyeon.life`와 로컬 개발용 `localhost` 등록
- [ ] 발급받은 키를 `src/constants/weddingInfo.ts`의 `NAVER_MAP_CLIENT_ID`에 입력 (키 입력 전까지는 placeholder로 표시됨)

## 4. 사진 / 배경음악
- [x] 배경음악 연결 완료 (`walk2.mp4`에서 afconvert로 오디오 추출 → `public/bgm.m4a`, 인트로 터치 시 자동재생)
- [ ] 실제 웨딩 사진이 정해지면 `src/constants/dummyImages.ts`의 배열을 실제 이미지 경로로 교체
- [x] 인트로(시작 장면) 사진 적용 완료 (`src/assets/hero-intro.jpeg`, 웹용으로 리사이즈/압축함)
- [ ] `/Users/jaewi/Downloads/walk2.mp4`가 저작권 문제 없는 음원인지 확인

## 5. 배포
- [ ] GitHub 저장소(`Jaymyong66/minsuhyeon`)에 push
- [ ] Vercel에 프로젝트 연결 후 위 환경변수 등록, 배포
- [ ] Vercel 프로젝트 Settings → Domains에서 `www.minsuhyeon.life` 추가 (호스팅케이알 DNS의 `www` CNAME 레코드는 이미 Vercel 값으로 설정되어 있음 — Invalid Configuration이 계속되면 도메인을 삭제 후 재추가해 재검증 트리거)

## 6. 최종 확인
- [ ] 카카오톡으로 링크를 공유해서 인앱 브라우저에서 실제로 열어보고, 배경음악이 터치 후 재생되는지 확인
- [ ] 신랑측/신부측 연락처 팝업, 계좌 복사, 방명록 작성이 실기기에서 정상 동작하는지 확인
