import { prepareImage } from './resizeImage'

/*
 * 한 번에 보낼 수 있는 장수.
 *
 * 노션은 커넥션당 평균 초당 3회로 제한하는데 사진 한 장이 3회를 쓴다.
 * 장수가 많으면 그만큼 오래 걸리고(장당 수 초), 그동안 하객이 화면을 닫으면
 * 남은 사진은 올라가지 않는다. 여러 번 나눠 보내는 편이 확실하다.
 */
export const MAX_PHOTOS = 20

/*
 * 진행률에서 "브라우저 → 우리 서버" 구간이 차지하는 몫.
 *
 * 바이트를 다 보냈다고 끝난 게 아니다. 서버가 받은 사진을 다시 노션으로
 * 올리는 시간이 몇 초 더 남아 있는데, 그 구간은 브라우저가 알 방법이 없다.
 * 100% 를 띄워놓고 멈춰 있으면 고장난 것처럼 보이므로 여기까지만 채우고
 * 나머지는 응답이 돌아왔을 때 채운다.
 */
export const SENT_WEIGHT = 0.9

export type PhotoStatus = 'pending' | 'uploading' | 'done' | 'error'

export interface PhotoItem {
  id: string
  file: File
  status: PhotoStatus
  /** 0~1. status 가 uploading 인 동안만 의미가 있다 */
  progress: number
  error?: string
}

/**
 * 전체 진행률(0~1).
 *
 * 장수가 아니라 용량으로 가중치를 준다. 10MB 짜리 한 장과 200KB 짜리 한 장을
 * 똑같이 세면, 큰 사진을 보내는 내내 막대가 멈춰 있는 것처럼 보인다.
 * 실패한 사진은 더 진행되지 않으므로 끝난 것으로 친다(막대가 영영 안 참).
 */
export function overallProgress(items: PhotoItem[]): number {
  const total = items.reduce((sum, item) => sum + item.file.size, 0)
  if (total === 0) return 0

  const sent = items.reduce((sum, item) => {
    const ratio = item.status === 'done' || item.status === 'error' ? 1 : item.progress
    return sum + item.file.size * ratio
  }, 0)

  return Math.min(1, sent / total)
}

/** 화면에 보여줄 정수 퍼센트 */
export function toPercent(progress: number): number {
  return Math.round(progress * 100)
}

/** 고른 사진들의 원본 용량 합계 */
export function totalBytes(items: PhotoItem[]): number {
  return items.reduce((sum, item) => sum + item.file.size, 0)
}

/**
 * 사람이 읽을 크기.
 *
 * 1MB 를 1,000,000 으로 센다. 사진 앱과 파일 탐색기가 보여주는 값과
 * 맞추기 위해서다(1,048,576 로 세면 하객 눈에는 숫자가 달라 보인다).
 */
export function formatBytes(bytes: number): string {
  if (bytes < 1_000) return `${bytes}B`
  if (bytes < 1_000_000) return `${Math.round(bytes / 1_000)}KB`
  return `${(bytes / 1_000_000).toFixed(1)}MB`
}

/**
 * 사진 한 장을 서버로 보낸다.
 *
 * 본문은 raw 바이너리로 보낸다. Vercel 이 Buffer 로 넘겨주는 Content-Type 이
 * application/octet-stream 뿐이라, 실제 이미지 형식은 쿼리로 따로 넘긴다.
 *
 * fetch 가 아니라 XMLHttpRequest 를 쓰는 이유는 업로드 진행률 때문이다.
 * fetch 는 요청 본문이 얼마나 나갔는지 알려주지 않는다.
 */
export async function uploadPhoto(
  file: File,
  name: string,
  onProgress?: (progress: number) => void,
): Promise<void> {
  const prepared = await prepareImage(file)

  const params = new URLSearchParams({
    name,
    filename: file.name,
    type: prepared.type,
  })

  await new Promise<void>((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    xhr.open('POST', `/api/photos?${params}`)
    xhr.setRequestHeader('Content-Type', 'application/octet-stream')

    xhr.upload.addEventListener('progress', (e) => {
      if (e.lengthComputable) onProgress?.((e.loaded / e.total) * SENT_WEIGHT)
    })

    xhr.addEventListener('load', () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        onProgress?.(1)
        resolve()
        return
      }
      let message = '사진을 보내지 못했습니다.'
      try {
        message = JSON.parse(xhr.responseText).error ?? message
      } catch {
        // 본문이 JSON 이 아니면(413, 502 등 플랫폼이 대신 응답한 경우) 기본 문구를 쓴다
      }
      reject(new Error(message))
    })

    xhr.addEventListener('error', () =>
      reject(new Error('연결이 끊겼어요. 잠시 후 다시 시도해주세요.')),
    )
    xhr.addEventListener('abort', () => reject(new Error('전송이 취소되었습니다.')))

    xhr.send(prepared.blob)
  })
}
