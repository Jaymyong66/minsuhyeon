export const theme = {
  color: {
    background: '#fdf9f6',
    surface: '#ffffff',
    text: '#383838',
    textMuted: '#8a7f76',
    accent: '#f2b8c6',
    border: '#e8ddd3',
  },
  font: {
    serif: `'ChosunMyungjo', 'Noto Serif KR', serif`,
    script: `'Dancing Script', cursive`,
    body: `'Pretendard', -apple-system, sans-serif`,
  },
  maxWidth: '480px',
  spacing: (n: number) => `${n * 8}px`,
}

export type Theme = typeof theme
