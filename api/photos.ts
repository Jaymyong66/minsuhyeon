import type { VercelRequest, VercelResponse } from '@vercel/node'
// 상대 import 에 .js 를 붙이는 이유는 api/guestbook.ts 주석 참고 ("type": "module" + Node ESM)
import { validatePhotoUpload, safeFilename } from '../lib/photos.validation.js'
import { uploadPhoto, createPhotoEntry } from '../lib/guestbook.notion.js'

/*
 * 사진 한 장 = 요청 하나 = 노션 행 하나.
 * 여러 장을 한 번에 묶지 않는 이유는 한 장이 실패해도 나머지는 남기기 위해서다.
 *
 * 본문은 raw 바이너리로 받는다. Vercel 이 Buffer 로 넘겨주는 Content-Type 은
 * application/octet-stream 뿐이라 그걸로 보내고, 실제 이미지 타입은 쿼리로 받는다.
 * multipart 파서를 붙일 필요가 없고 base64 처럼 33% 부풀지도 않는다.
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'Method Not Allowed' })
  }

  const name = String(req.query.name ?? '')
  const filename = String(req.query.filename ?? '')
  const contentType = String(req.query.type ?? '')

  const body = req.body
  if (!Buffer.isBuffer(body)) {
    return res.status(400).json({ error: '사진 데이터를 읽지 못했습니다.' })
  }

  const validation = validatePhotoUpload({ name, contentType, byteLength: body.length })
  if (!validation.valid) {
    return res.status(400).json({ error: validation.error })
  }

  try {
    const safe = safeFilename(filename, contentType)
    const fileUploadId = await uploadPhoto({ data: body, filename: safe, contentType })
    await createPhotoEntry({ name, fileUploadId, filename: safe })
    return res.status(201).json({ ok: true })
  } catch (err) {
    return res.status(500).json({ error: (err as Error).message })
  }
}
