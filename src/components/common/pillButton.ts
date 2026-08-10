import { css } from '@emotion/react'
import type { Theme } from '../../theme/theme'

/*
 * 테두리만 있는 알약형 버튼.
 *
 * 같은 모양을 세 군데에 각자 적어두다 보니 글씨색이 두 갈래로 갈려 있었다
 * (오시는 길은 accent, 더보기와 사진 보내기는 accentStrong). 한 곳에서 정한다.
 *
 * 색은 연한 accent 로 맞춘다. 배경과 대비가 1.5:1 로 낮아 밝은 곳에서는
 * 흐릿하지만, 사이트 전체 톤을 따른다.
 *
 * <a> 와 <button> 양쪽에 써야 해서 styled 컴포넌트가 아니라 css 조각으로 둔다.
 */
export const pillButton = (theme: Theme) => css`
  display: inline-block;
  padding: ${theme.spacing(1.5)} ${theme.spacing(3)};
  border: 1px solid ${theme.color.accent};
  border-radius: 999px;
  background: none;
  color: ${theme.color.accent};
  font-size: 0.95rem;
  text-decoration: none;
  cursor: pointer;
`
