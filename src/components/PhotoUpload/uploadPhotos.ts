import { prepareImage } from './resizeImage'

/*
 * 한 번에 보낼 수 있는 장수.
 *
 * 노션은 커넥션당 평균 초당 3회로 제한하는데 사진 한 장이 3회를 쓴다.
 * 장수가 많으면 그만큼 오래 걸리고(장당 수 초), 그동안 하객이 화면을 닫으면
 * 남은 사진은 올라가지 않는다. 여러 번 나눠 보내는 편이 확실하다.
 */
export const MAX_PHOTOS = 20

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
