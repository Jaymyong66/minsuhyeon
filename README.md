# 민수 ・ 수현 모바일 청첩장

React + Vite + TypeScript + Emotion으로 만든 모바일 청첩장.

## 개발

```bash
npm install
npm run dev
```

## 테스트

```bash
npm test
```

## 빌드

```bash
npm run build
```

## 배포

Cloudflare Pages 사용 (Build command: `npm run build`, Output directory: `dist`). 방명록 API는 Cloudflare Pages Functions(`functions/api/guestbook.ts`)로 구현되어 있으며, `NOTION_TOKEN`/`NOTION_DATABASE_ID` 환경변수가 필요합니다.

## 배포 전 준비사항

`TODO.md` 참고 (Notion 방명록 연동, 네이버 폼/지도 키, 배경음악, 도메인 연결 등).
