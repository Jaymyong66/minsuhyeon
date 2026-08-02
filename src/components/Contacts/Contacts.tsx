import styled from '@emotion/styled'
import { CopyButton } from '../common/CopyButton'
import { formatAccountForCopy } from '../common/formatAccount'
import { GROOM_CONTACTS, BRIDE_CONTACTS, type ContactPerson } from '../../constants/weddingInfo'

const Section = styled.section`
  padding: ${({ theme }) => theme.spacing(6)} ${({ theme }) => theme.spacing(3)};
`

const Title = styled.h2`
  font-family: ${({ theme }) => theme.font.serif};
  font-size: 1.3rem;
  text-align: center;
  margin-bottom: ${({ theme }) => theme.spacing(3)};
`

const SideGroup = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing(3)};
`

const SideLabel = styled.h3`
  font-size: 0.95rem;
  color: ${({ theme }) => theme.color.textMuted};
  margin-bottom: ${({ theme }) => theme.spacing(1)};
`

const PersonRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${({ theme }) => theme.spacing(1.5)} 0;
  border-bottom: 1px solid ${({ theme }) => theme.color.border};
`

const PersonInfo = styled.div`
  font-size: 0.85rem;
  text-align: left;
`

function ContactList({ people }: { people: ContactPerson[] }) {
  return (
    <>
      {people.map((c) => (
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
    </>
  )
}

export function Contacts() {
  return (
    <Section>
      <Title>마음 전하실 곳</Title>
      <SideGroup>
        <SideLabel>신랑측</SideLabel>
        <ContactList people={GROOM_CONTACTS} />
      </SideGroup>
      <SideGroup>
        <SideLabel>신부측</SideLabel>
        <ContactList people={BRIDE_CONTACTS} />
      </SideGroup>
    </Section>
  )
}
