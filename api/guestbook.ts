import type { VercelRequest, VercelResponse } from '@vercel/node'
// 공유 모듈은 api/ 밖에 둔다.
// Vercel 은 api/ 안의 모든 파일을 서버리스 함수로 만들기 때문에,
// 여기 두면 default export 도 없는 모듈들이 공개 엔드포인트가 되어 500 을 뱉는다.
//
// 확장자 .js 를 붙이는 이유: package.json 이 "type": "module" 이라
// 이 함수는 Node 네이티브 ESM 으로 실행된다. ESM 은 상대 경로에 확장자를
// 요구해서, 없으면 모듈 로드 단계에서 ERR_MODULE_NOT_FOUND 로 죽는다
// (핸들러에 닿지도 못하므로 FUNCTION_INVOCATION_FAILED 로 보인다).
// 소스는 .ts 지만 컴파일 후 기준이라 .js 로 적는 것이 맞다.
import { validateGuestbookEntry } from '../lib/guestbook.validation.js'
import { createEntry, listEntries } from '../lib/guestbook.notion.js'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'GET') {
    try {
      const entries = await listEntries()
      return res.status(200).json({ entries })
    } catch (err) {
      return res.status(500).json({ error: (err as Error).message })
    }
  }

  if (req.method === 'POST') {
    const { name, message } = req.body ?? {}
    const validation = validateGuestbookEntry({ name, message })
    if (!validation.valid) {
      return res.status(400).json({ error: validation.error })
    }
    try {
      await createEntry({ name, message })
      return res.status(201).json({ ok: true })
    } catch (err) {
      return res.status(500).json({ error: (err as Error).message })
    }
  }

  res.setHeader('Allow', 'GET, POST')
  return res.status(405).json({ error: 'Method Not Allowed' })
}
