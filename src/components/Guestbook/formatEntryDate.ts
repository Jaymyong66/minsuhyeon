/**
 * 노션의 created_time(UTC ISO 문자열)을 방명록에 표시할 날짜로 바꾼다.
 *
 * 보는 사람의 시간대가 아니라 한국 시간으로 고정한다.
 * 하객이 어디서 열든 "글이 올라온 날"이 같게 보이는 편이 덜 헷갈린다.
 */
export function formatEntryDate(iso: string): string {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return ''

  const kst = new Date(date.getTime() + 9 * 60 * 60 * 1000)
  const year = kst.getUTCFullYear()
  const month = String(kst.getUTCMonth() + 1).padStart(2, '0')
  const day = String(kst.getUTCDate()).padStart(2, '0')

  return `${year}. ${month}. ${day}`
}
