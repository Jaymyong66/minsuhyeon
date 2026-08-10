import { describe, it, expect } from 'vitest'
import { fitWithin, canSendAsIs, MAX_EDGE, MAX_BYTES } from './resizeImage'
import {
  MAX_PHOTOS,
  SENT_WEIGHT,
  overallProgress,
  toPercent,
  totalBytes,
  formatBytes,
  type PhotoItem,
  type PhotoStatus,
} from './uploadPhotos'

const item = (size: number, status: PhotoStatus, progress = 0): PhotoItem => ({
  id: `${size}-${status}-${progress}`,
  file: { size } as File,
  status,
  progress,
})

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

describe('진행률', () => {
  it('아무것도 안 고르면 0% 다', () => {
    expect(overallProgress([])).toBe(0)
  })

  it('장수가 아니라 용량으로 가중치를 준다', () => {
    // 10MB 한 장과 1MB 한 장을 똑같이 세면, 큰 사진을 보내는 내내 막대가 멈춰 보인다
    const items = [item(10_000_000, 'done', 1), item(1_000_000, 'pending')]
    expect(toPercent(overallProgress(items))).toBe(91)
  })

  it('보내는 중인 사진의 진행률을 반영한다', () => {
    expect(toPercent(overallProgress([item(1_000_000, 'uploading', 0.5)]))).toBe(50)
  })

  it('실패한 사진은 끝난 것으로 친다', () => {
    // 더 진행되지 않는데 남겨두면 막대가 영영 차지 않아 멈춘 것처럼 보인다
    expect(toPercent(overallProgress([item(1_000, 'error'), item(1_000, 'done', 1)]))).toBe(100)
  })

  it('전송이 끝나도 서버가 노션에 올리는 동안은 100% 가 되지 않는다', () => {
    // 100% 에서 몇 초 멈춰 있으면 고장난 것으로 보인다
    expect(SENT_WEIGHT).toBeLessThan(1)
    expect(toPercent(overallProgress([item(1_000, 'uploading', SENT_WEIGHT)]))).toBeLessThan(100)
  })

  it('100% 를 넘지 않는다', () => {
    expect(overallProgress([item(1_000, 'uploading', 1.5)])).toBe(1)
  })
})

describe('용량 표시', () => {
  it('합계를 낸다', () => {
    expect(totalBytes([item(1_000, 'pending'), item(2_500, 'pending')])).toBe(3_500)
  })

  it('사진 앱과 같은 기준(1MB = 100만 바이트)으로 읽어준다', () => {
    expect(formatBytes(512)).toBe('512B')
    expect(formatBytes(120_000)).toBe('120KB')
    expect(formatBytes(3_500_000)).toBe('3.5MB')
  })
})

describe('업로드 한도', () => {
  it('목표 용량이 Vercel 본문 제한(4.5MB)보다 낮다', () => {
    // 넘으면 서버에 닿기도 전에 413 이라 우리 에러 메시지를 보여줄 수 없다
    expect(MAX_BYTES).toBeLessThan(4_500_000)
  })
})
