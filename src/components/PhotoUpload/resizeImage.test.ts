import { describe, it, expect } from 'vitest'
import { fitWithin, canSendAsIs, MAX_EDGE, MAX_BYTES } from './resizeImage'
import { MAX_PHOTOS } from './uploadPhotos'

describe('fitWithin', () => {
  it('작은 사진은 그대로 둔다', () => {
    expect(fitWithin(800, 600)).toEqual({ width: 800, height: 600 })
  })

  it('긴 변을 기준으로 줄인다 (가로 사진)', () => {
    expect(fitWithin(4000, 3000)).toEqual({ width: 2048, height: 1536 })
  })

  it('긴 변을 기준으로 줄인다 (세로 사진)', () => {
    expect(fitWithin(3000, 4000)).toEqual({ width: 1536, height: 2048 })
  })

  it('비율을 유지한다', () => {
    const { width, height } = fitWithin(4837, 7255)
    expect(Math.max(width, height)).toBe(MAX_EDGE)
    expect(width / height).toBeCloseTo(4837 / 7255, 2)
  })

  it('아주 길쭉한 사진에서도 짧은 변이 0 이 되지 않는다', () => {
    const { width, height } = fitWithin(10000, 3)
    expect(width).toBe(MAX_EDGE)
    expect(height).toBeGreaterThanOrEqual(1)
  })

  it('정확히 한도와 같으면 줄이지 않는다', () => {
    expect(fitWithin(MAX_EDGE, 1000)).toEqual({ width: MAX_EDGE, height: 1000 })
  })
})

describe('canSendAsIs', () => {
  it('한도 안에 드는 사진은 손대지 않는다', () => {
    // 재인코딩은 화질을 한 번 더 깎고 EXIF(촬영 일시 등)를 지운다
    expect(canSendAsIs({ size: 2_000_000, type: 'image/jpeg' })).toBe(true)
    expect(canSendAsIs({ size: 500_000, type: 'image/png' })).toBe(true)
    expect(canSendAsIs({ size: 1_000_000, type: 'image/webp' })).toBe(true)
  })

  it('한도를 넘으면 줄여야 한다', () => {
    expect(canSendAsIs({ size: MAX_BYTES + 1, type: 'image/jpeg' })).toBe(false)
  })

  it('경계값은 그대로 보낸다', () => {
    expect(canSendAsIs({ size: MAX_BYTES, type: 'image/jpeg' })).toBe(true)
  })

  it('HEIC 는 항상 변환한다', () => {
    // 브라우저마다 볼 수 없어서 JPEG 로 바꿔 보내야 한다
    expect(canSendAsIs({ size: 100_000, type: 'image/heic' })).toBe(false)
    expect(canSendAsIs({ size: 100_000, type: 'image/heif' })).toBe(false)
  })
})

describe('장수 제한', () => {
  it('한 번에 보낼 수 있는 장수에 상한이 있다', () => {
    // 노션이 커넥션당 초당 3회로 제한하는데 사진 한 장이 3회를 쓴다.
    // 무제한이면 오래 걸려 하객이 화면을 닫고, 남은 사진은 올라가지 않는다.
    expect(MAX_PHOTOS).toBeGreaterThan(0)
    expect(MAX_PHOTOS).toBeLessThanOrEqual(30)
  })
})

describe('업로드 한도', () => {
  it('목표 용량이 Vercel 본문 제한(4.5MB)보다 낮다', () => {
    // 넘으면 서버에 닿기도 전에 413 이라 우리 에러 메시지를 보여줄 수 없다
    expect(MAX_BYTES).toBeLessThan(4_500_000)
  })
})
