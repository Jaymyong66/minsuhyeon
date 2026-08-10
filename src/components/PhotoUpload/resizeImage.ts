/*
 * 하객이 고른 사진을 업로드 가능한 크기로 만든다.
 *
 * Vercel 함수는 요청 본문이 4.5MB 로 막혀 있고(초과 시 413), 노션 업로드는
 * 우리 토큰이 필요해 브라우저가 직접 올릴 수 없다. 반드시 서버를 거치므로
 * 한도를 넘는 사진은 브라우저에서 줄여야 한다.
 *
 * 다만 한도 안에 드는 사진은 손대지 않고 그대로 보낸다. 재인코딩은
 * 화질을 한 번 더 깎고 EXIF(촬영 일시 등)를 지우며, 이미 강하게 압축된
 * 사진은 오히려 커지기도 한다.
 */

/** 줄여야 할 때 맞출 긴 변. 보기에 충분하고 7인치 인화까지 되는 크기 */
export const MAX_EDGE = 2048
/** 4.5MB 한도에 여유를 두고 잡은 목표치 */
export const MAX_BYTES = 3_500_000

/** 그대로 통과시킬 형식. 노션과 브라우저가 모두 다룰 수 있는 것만 둔다 */
const PASSTHROUGH_TYPES = ['image/jpeg', 'image/png', 'image/webp']

const QUALITY_STEPS = [0.85, 0.75, 0.65, 0.55, 0.45]

export interface PreparedImage {
  blob: Blob
  /** 서버에 알려줄 실제 형식 */
  type: string
  /** 손대지 않고 원본을 그대로 보내는지 */
  untouched: boolean
}

/** 긴 변이 maxEdge 를 넘지 않도록 비율을 유지해 줄인 크기 */
export function fitWithin(
  width: number,
  height: number,
  maxEdge: number = MAX_EDGE,
): { width: number; height: number } {
  const longest = Math.max(width, height)
  if (longest <= maxEdge) return { width, height }

  const scale = maxEdge / longest
  return {
    width: Math.max(1, Math.round(width * scale)),
    height: Math.max(1, Math.round(height * scale)),
  }
}

/** 원본을 그대로 보내도 되는지. 한도 안에 들고 다룰 수 있는 형식이면 손대지 않는다 */
export function canSendAsIs(file: { size: number; type: string }): boolean {
  return file.size <= MAX_BYTES && PASSTHROUGH_TYPES.includes(file.type)
}

function toBlob(canvas: HTMLCanvasElement, quality: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error('이미지를 변환하지 못했습니다.'))),
      'image/jpeg',
      quality,
    )
  })
}

async function loadBitmap(file: File): Promise<ImageBitmap | HTMLImageElement> {
  // createImageBitmap 은 EXIF 회전을 반영해준다. 없으면 <img> 로 폴백한다.
  if (typeof createImageBitmap === 'function') {
    try {
      return await createImageBitmap(file, { imageOrientation: 'from-image' })
    } catch {
      // 아래 폴백으로 넘어간다
    }
  }

  const url = URL.createObjectURL(file)
  try {
    return await new Promise<HTMLImageElement>((resolve, reject) => {
      const img = new Image()
      img.onload = () => resolve(img)
      img.onerror = () => reject(new Error('이미지를 읽지 못했습니다.'))
      img.src = url
    })
  } finally {
    URL.revokeObjectURL(url)
  }
}

/**
 * 보낼 수 있는 형태로 준비한다.
 * 한도 안에 드는 사진은 원본 그대로, 넘는 사진만 줄여서 JPEG 로 다시 뽑는다.
 */
export async function prepareImage(file: File): Promise<PreparedImage> {
  if (canSendAsIs(file)) {
    return { blob: file, type: file.type, untouched: true }
  }

  const source = await loadBitmap(file)
  const { width, height } = fitWithin(source.width, source.height)

  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height

  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('이미지를 변환하지 못했습니다.')
  ctx.drawImage(source as CanvasImageSource, 0, 0, width, height)

  if ('close' in source) source.close()

  let last: Blob | null = null
  for (const quality of QUALITY_STEPS) {
    last = await toBlob(canvas, quality)
    if (last.size <= MAX_BYTES) break
  }

  // 줄였는데 원본보다 커졌다면 원본이 낫다 (한도 안에 든다는 전제 하에)
  if (last!.size > file.size && file.size <= MAX_BYTES) {
    return { blob: file, type: file.type, untouched: true }
  }

  return { blob: last!, type: 'image/jpeg', untouched: false }
}
