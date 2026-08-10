import { prepareImage } from './resizeImage'

export type PhotoStatus = 'pending' | 'uploading' | 'done' | 'error'

export interface PhotoItem {
  id: string
  file: File
  status: PhotoStatus
  error?: string
}

/**
 * 사진 한 장을 서버로 보낸다.
 *
 * 본문은 raw 바이너리로 보낸다. Vercel 이 Buffer 로 넘겨주는 Content-Type 이
 * application/octet-stream 뿐이라, 실제 이미지 형식은 쿼리로 따로 넘긴다.
 */
export async function uploadPhoto(file: File, name: string): Promise<void> {
  const prepared = await prepareImage(file)

  const params = new URLSearchParams({
    name,
    filename: file.name,
    type: prepared.type,
  })

  const res = await fetch(`/api/photos?${params}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/octet-stream' },
    body: prepared.blob,
  })

  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body.error ?? '사진을 보내지 못했습니다.')
  }
}
