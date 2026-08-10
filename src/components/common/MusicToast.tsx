import { useCallback, useEffect, useState } from 'react'
import { Toast } from './Toast'

/** 상단 배너는 주소창에 가려 잘 안 보여서 하단 토스트로 알린다 */
export function MusicToast() {
  const [show, setShow] = useState(false)
  const hide = useCallback(() => setShow(false), [])

  useEffect(() => {
    // 인트로가 자리를 잡은 뒤에 띄운다
    const timer = setTimeout(() => setShow(true), 800)
    return () => clearTimeout(timer)
  }, [])

  if (!show) return null

  return (
    <Toast duration={2800} onDone={hide}>
      배경음악이 준비되었습니다
    </Toast>
  )
}
