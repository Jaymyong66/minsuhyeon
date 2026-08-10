import styled from '@emotion/styled'

/*
 * 섹션 제목.
 *
 * 같은 모양을 7개 파일에 각자 적어두다 보니 크기가 어긋나 있었다(인사말만 1.2rem).
 * 한 곳에서 정하고 섹션마다 여백만 덧붙여 쓴다.
 *
 * 굵기는 500. 제목 기본값 600 은 한 문장짜리 긴 제목에서 유독 두꺼워 보인다.
 */
export const SectionTitle = styled.h2`
  font-family: ${({ theme }) => theme.font.heading};
  font-size: 1.3rem;
  font-weight: 500;
  color: ${({ theme }) => theme.color.accent};
  text-align: center;
  margin: 0;
  word-break: keep-all;
`
