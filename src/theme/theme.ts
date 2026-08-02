export const theme = {
  color: {
    background: '#fdf9f6',
    surface: '#ffffff',
    text: '#3a332e',
    textMuted: '#8a7f76',
    accent: '#c9a68c',
    border: '#e8ddd3',
  },
  font: {
    serif: `'Cormorant Garamond', 'Noto Serif KR', serif`,
    body: `'Pretendard', -apple-system, sans-serif`,
  },
  maxWidth: '480px',
  spacing: (n: number) => `${n * 8}px`,
}

export type Theme = typeof theme
