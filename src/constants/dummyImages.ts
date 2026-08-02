import heroIntro from '../assets/hero-intro.jpeg'

const galleryModules = import.meta.glob('../assets/gallery/*.jpg', {
  eager: true,
  import: 'default',
}) as Record<string, string>

export const DUMMY_GALLERY_IMAGES: string[] = Object.keys(galleryModules)
  .sort()
  .map((key) => galleryModules[key])

export const DUMMY_HERO_IMAGE = heroIntro
