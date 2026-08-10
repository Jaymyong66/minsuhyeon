import { describe, it, expect } from 'vitest'
import { validatePhotoUpload, safeFilename, MAX_PHOTO_BYTES } from './photos.validation'

const ok = { name: '홍길동', contentType: 'image/jpeg', byteLength: 1000 }

describe('validatePhotoUpload', () => {
  it('정상 입력을 통과시킨다', () => {
    expect(validatePhotoUpload(ok)).toEqual({ valid: true })
  })

  it('이름이 없으면 거부한다', () => {
    expect(validatePhotoUpload({ ...ok, name: '   ' })).toMatchObject({ valid: false })
  })

  it('이름이 50자를 넘으면 거부한다', () => {
    expect(validatePhotoUpload({ ...ok, name: 'ㄱ'.repeat(51) })).toMatchObject({ valid: false })
  })

  it('이미지가 아니면 거부한다', () => {
    // 공개 엔드포인트라 아무 파일이나 올라올 수 있다
    for (const type of ['application/pdf', 'text/html', 'application/zip', '']) {
      expect(validatePhotoUpload({ ...ok, contentType: type })).toMatchObject({ valid: false })
    }
  })

  it('아이폰 사진 형식도 받는다', () => {
    for (const type of ['image/heic', 'image/heif', 'image/png', 'image/webp']) {
      expect(validatePhotoUpload({ ...ok, contentType: type })).toEqual({ valid: true })
    }
  })

  it('빈 파일을 거부한다', () => {
    expect(validatePhotoUpload({ ...ok, byteLength: 0 })).toMatchObject({ valid: false })
  })

  it('한도를 넘는 용량을 거부한다', () => {
    expect(validatePhotoUpload({ ...ok, byteLength: MAX_PHOTO_BYTES + 1 })).toMatchObject({
      valid: false,
    })
  })

  it('한도는 Vercel 본문 제한(4.5MB)보다 낮다', () => {
    // 서버에 닿기도 전에 413 이 나면 우리 에러 메시지를 보여줄 수 없다
    expect(MAX_PHOTO_BYTES).toBeLessThan(4_500_000)
  })
})

describe('safeFilename', () => {
  it('확장자를 실제 타입에 맞춘다', () => {
    expect(safeFilename('사진.heic', 'image/jpeg')).toBe('사진.jpg')
    expect(safeFilename('shot.jpg', 'image/png')).toBe('shot.png')
  })

  it('경로 구분자나 특수문자를 남기지 않는다', () => {
    // 사용자가 준 이름이 그대로 파일명이 되지 않게 한다
    const inputs = ['../../etc/passwd', 'a<b>c:d"e', '..\\..\\win.ini', '/absolute/path.jpg']
    for (const raw of inputs) {
      const out = safeFilename(raw, 'image/jpeg')
      expect(out).toMatch(/^[\p{L}\p{N}\-_ ]+\.jpg$/u)
      expect(out).not.toContain('/')
      expect(out).not.toContain('\\')
    }
  })

  it('특수문자만 있는 이름은 기본값이 된다', () => {
    expect(safeFilename('../../etc/passwd', 'image/jpeg')).toBe('photo.jpg')
  })

  it('이름이 비면 기본값을 쓴다', () => {
    expect(safeFilename('', 'image/jpeg')).toBe('photo.jpg')
    expect(safeFilename('!!!', 'image/jpeg')).toBe('photo.jpg')
  })

  it('한글 이름은 살린다', () => {
    expect(safeFilename('결혼식 사진.jpg', 'image/jpeg')).toBe('결혼식 사진.jpg')
  })

  it('너무 긴 이름을 자른다', () => {
    expect(safeFilename('가'.repeat(200) + '.jpg', 'image/jpeg').length).toBeLessThanOrEqual(64)
  })
})
