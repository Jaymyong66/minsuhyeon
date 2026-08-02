import heroIntro from '../assets/hero-intro.jpeg'

// 실제 사진이 정해지면 이 배열만 교체하면 됩니다.
export const DUMMY_GALLERY_IMAGES: string[] = Array.from(
  { length: 8 },
  (_, i) => `https://placehold.co/600x800?text=Photo+${i + 1}`,
)

export const DUMMY_HERO_IMAGE = heroIntro
