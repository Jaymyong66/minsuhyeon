export const theme = {
  color: {
    background: '#fdf9f6',
    surface: '#ffffff',
    text: '#383838',
    textMuted: '#8a7f76',
    accent: '#f2b8c6',
    /* accent 위에 글씨를 얹을 때. accent 는 밝아서 흰 글씨를 쓰면 대비가 1.69:1 밖에 안 된다 */
    onAccent: '#7a3348',
    /* 눌러야 할 버튼처럼 강조가 필요할 때. 흰 글씨와 대비 4.61:1 */
    accentStrong: '#b05a72',
    border: '#e8ddd3',
  },
  /*
   * 사이트 전체를 Pretendard 한 벌로 쓴다. 제목과 본문은 글씨체가 아니라 굵기로 구분한다.
   * heading 과 body 를 따로 두는 건 나중에 제목만 바꾸고 싶을 때를 위한 자리다.
   */
  font: {
    heading: `'Pretendard Variable', Pretendard, -apple-system, sans-serif`,
    body: `'Pretendard Variable', Pretendard, -apple-system, sans-serif`,
  },
  maxWidth: '480px',
  spacing: (n: number) => `${n * 8}px`,
}

export type Theme = typeof theme
