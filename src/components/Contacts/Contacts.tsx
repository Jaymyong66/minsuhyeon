import { useState } from 'react'
import styled from '@emotion/styled'
import { Modal } from '../common/Modal'
import { CopyButton } from '../common/CopyButton'
import { formatAccountForCopy } from '../common/formatAccount'
import { GROOM_CONTACTS, BRIDE_CONTACTS, type ContactPerson } from '../../constants/weddingInfo'

const Section = styled.section`
  padding: ${({ theme }) => theme.spacing(6)} ${({ theme }) => theme.spacing(3)};
  text-align: center;
`

const Title = styled.h2`
  font-family: ${({ theme }) => theme.font.serif};
  font-size: 1.3rem;
  margin-bottom: ${({ theme }) => theme.spacing(3)};
`

const ButtonRow = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing(2)};
  justify-content: center;
`

const SideButton = styled.button`
  padding: ${({ theme }) => theme.spacing(1.5)} ${({ theme }) => theme.spacing(3)};
  border: 1px solid ${({ theme }) => theme.color.border};
  border-radius: 999px;
  background: ${({ theme }) => theme.color.surface};
  cursor: pointer;
`

const PersonRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${({ theme }) => theme.spacing(1.5)} 0;
  border-bottom: 1px solid ${({ theme }) => theme.color.border};
  text-align: left;
`

const PersonInfo = styled.div`
  font-size: 0.85rem;
`

type Side = 'groom' | 'bride' | null

export function Contacts() {
  const [open, setOpen] = useState<Side>(null)
  const contacts: ContactPerson[] = open === 'groom' ? GROOM_CONTACTS : BRIDE_CONTACTS

  return (
    <Section>
      <Title>연락처</Title>
      <ButtonRow>
        <SideButton onClick={() => setOpen('groom')}>신랑측</SideButton>
        <SideButton onClick={() => setOpen('bride')}>신부측</SideButton>
      </ButtonRow>

      <Modal open={open !== null} onClose={() => setOpen(null)}>
        {contacts.map((c) => (
          <PersonRow key={c.role}>
            <PersonInfo>
              <div>
                {c.role} {c.name}
              </div>
              <div>{c.phone}</div>
              <div>{formatAccountForCopy(c.bank, c.account)}</div>
            </PersonInfo>
            <CopyButton value={formatAccountForCopy(c.bank, c.account)} />
          </PersonRow>
        ))}
      </Modal>
    </Section>
  )
}
