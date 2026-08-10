export type ValidationResult = { valid: true } | { valid: false; error: string }

const MAX_NAME_LENGTH = 50
/** Vercel 함수 본문 한도(4.5MB)보다 낮게 잡는다. 브라우저가 3.5MB 이하로 줄여 보낸다 */
export const MAX_PHOTO_BYTES = 4_000_000

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif']

export function validatePhotoUpload(input: {
  name: string
  contentType: string
  byteLength: number
}): ValidationResult {
  if (!input.name?.trim()) {
    return { valid: false, error: '이름을 입력해주세요.' }
  }
  if (input.name.length > MAX_NAME_LENGTH) {
    return { valid: false, error: `이름은 ${MAX_NAME_LENGTH}자를 넘을 수 없습니다.` }
  }
  // 공개 엔드포인트라 아무 파일이나 올라올 수 있으므로 이미지만 받는다
  if (!ALLOWED_TYPES.includes(input.contentType)) {
    return { valid: false, error: '이미지 파일만 보낼 수 있습니다.' }
  }
  if (input.byteLength <= 0) {
    return { valid: false, error: '빈 파일입니다.' }
  }
  if (input.byteLength > MAX_PHOTO_BYTES) {
    return { valid: false, error: '사진 용량이 너무 큽니다.' }
  }
  return { valid: true }
}

/** 노션에 남길 파일명. 사용자가 준 이름을 그대로 믿지 않는다 */
export function safeFilename(raw: string, contentType: string): string {
  const ext = contentType === 'image/png' ? 'png' : contentType === 'image/webp' ? 'webp' : 'jpg'
  const base = (raw || '')
    .replace(/\.[^.]*$/, '')
    .replace(/[^\p{L}\p{N}\-_ ]/gu, '')
    .trim()
    .slice(0, 60)
  return `${base || 'photo'}.${ext}`
}
