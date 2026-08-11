import heroIntro from '../assets/hero-intro.jpeg'
import missionPhoto from '../assets/gallery/full/026.jpg'

/*
 * 갤러리 사진은 두 벌로 둔다.
 * - thumb(480px): 3열 격자용. 27장이 한꺼번에 걸리므로 가볍게 유지한다.
 * - full(1400px): 라이트박스 전용. 폰 전체화면 x DPR3 기준으로 잡았고, 열 때만 받는다.
 * 한 벌로 합치면 격자에서 full 을 받게 되거나(무거움) 확대했을 때 흐려진다(예전 상태).
 */
const thumbModules = import.meta.glob('../assets/gallery/thumb/*.jpg', {
  eager: true,
  import: 'default',
}) as Record<string, string>

const fullModules = import.meta.glob('../assets/gallery/full/*.jpg', {
  eager: true,
  import: 'default',
}) as Record<string, string>

export interface GalleryPhoto {
  thumb: string
  full: string
}

const fileName = (key: string) => key.slice(key.lastIndexOf('/') + 1)

export const GALLERY_PHOTOS: GalleryPhoto[] = Object.keys(thumbModules)
  .sort()
  .map((key) => {
    const name = fileName(key)
    const fullKey = Object.keys(fullModules).find((k) => fileName(k) === name)
    if (!fullKey) throw new Error(`갤러리 원본이 없습니다: ${name}`)
    return { thumb: thumbModules[key], full: fullModules[fullKey] }
  })

export const DUMMY_HERO_IMAGE = heroIntro

/* 사진 미션 안내에 쓰는 한 장. 갤러리와 같은 파일이라 따로 더 받지 않는다 */
export const MISSION_PHOTO = missionPhoto
