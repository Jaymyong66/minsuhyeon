import { useEffect, useState, type FormEvent } from 'react'
import styled from '@emotion/styled'

interface Entry {
  id: string
  name: string
  message: string
  createdAt: string
}

const Section = styled.section`
  padding: ${({ theme }) => theme.spacing(6)} ${({ theme }) => theme.spacing(3)};
`

const Title = styled.h2`
  font-family: ${({ theme }) => theme.font.serif};
  font-size: 1.3rem;
  color: ${({ theme }) => theme.color.accent};
  text-align: center;
  margin-bottom: ${({ theme }) => theme.spacing(3)};
`

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(1)};
  margin-bottom: ${({ theme }) => theme.spacing(4)};
`

const Input = styled.input`
  padding: ${({ theme }) => theme.spacing(1)};
  border: 1px solid ${({ theme }) => theme.color.border};
  border-radius: 8px;
`

const Textarea = styled.textarea`
  padding: ${({ theme }) => theme.spacing(1)};
  border: 1px solid ${({ theme }) => theme.color.border};
  border-radius: 8px;
  resize: none;
  min-height: 80px;
`

const SubmitButton = styled.button`
  padding: ${({ theme }) => theme.spacing(1.5)};
  border: none;
  border-radius: 8px;
  background: ${({ theme }) => theme.color.accent};
  color: #fff;
  cursor: pointer;
`

const EntryCard = styled.div`
  padding: ${({ theme }) => theme.spacing(1.5)} 0;
  border-bottom: 1px solid ${({ theme }) => theme.color.border};
`

const EntryName = styled.div`
  font-weight: 600;
  font-size: 0.9rem;
`

const EntryMessage = styled.div`
  font-size: 0.85rem;
  color: ${({ theme }) => theme.color.text};
  white-space: pre-line;
`

export function Guestbook() {
  const [entries, setEntries] = useState<Entry[]>([])
  const [name, setName] = useState('')
  const [message, setMessage] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadEntries = async () => {
    try {
      const res = await fetch('/api/guestbook')
      const data = await res.json()
      setEntries(data.entries ?? [])
    } catch {
      // 목록 조회 실패 시 조용히 무시 (방명록 작성은 계속 가능해야 함)
    }
  }

  useEffect(() => {
    loadEntries()
  }, [])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError(null)
    try {
      const res = await fetch('/api/guestbook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, message }),
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error ?? '작성에 실패했습니다.')
      }
      setName('')
      setMessage('')
      await loadEntries()
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Section>
      <Title>축하 메시지</Title>
      <Form onSubmit={handleSubmit}>
        <Input
          placeholder="이름"
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={50}
          required
        />
        <Textarea
          placeholder="축하 메시지를 남겨주세요"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          maxLength={300}
          required
        />
        {error && <span role="alert">{error}</span>}
        <SubmitButton type="submit" disabled={submitting}>
          {submitting ? '등록 중...' : '남기기'}
        </SubmitButton>
      </Form>
      {entries.map((entry) => (
        <EntryCard key={entry.id}>
          <EntryName>{entry.name}</EntryName>
          <EntryMessage>{entry.message}</EntryMessage>
        </EntryCard>
      ))}
    </Section>
  )
}
