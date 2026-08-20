import { useState } from 'react'
import styled from '@emotion/styled'
import { SectionTitle } from '../common/SectionTitle'
import { Reveal } from '../common/Reveal'
import { CopyButton } from '../common/CopyButton'
import { formatAccountForCopy } from '../common/formatAccount'
import { GROOM_CONTACTS, BRIDE_CONTACTS, type ContactPerson } from '../../constants/weddingInfo'

const Section = styled.section`
  padding: ${({ theme }) => theme.spacing(6)} ${({ theme }) => theme.spacing(3)};
`

const Title = styled(SectionTitle)`
  margin-bottom: ${({ theme }) => theme.spacing(1.5)};
`

const Description = styled.p`
  margin: 0 0 ${({ theme }) => theme.spacing(3)};
  color: ${({ theme }) => theme.color.textMuted};
  font-size: 0.88rem;
  line-height: 1.8;
  text-align: center;
  word-break: keep-all;
`

/* 각 그룹이 Reveal 로 감싸져 형제가 아니게 되므로 :last-of-type 대신 명시적 플래그를 쓴다. */
const SideGroup = styled.div<{ last?: boolean }>`
  border-top: 1px solid ${({ theme }) => theme.color.border};
  border-bottom: ${({ last, theme }) => (last ? `1px solid ${theme.color.border}` : 'none')};
`

const SideHeader = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: none;
  border: none;
  padding: ${({ theme }) => theme.spacing(2)} 0;
  font-size: 0.95rem;
  color: ${({ theme }) => theme.color.text};
  cursor: pointer;
`

const SideLabel = styled.span`
  font-weight: 500;
`

const Chevron = styled.span<{ open: boolean }>`
  display: inline-block;
  transition: transform 0.25s ease;
  transform: rotate(${({ open }) => (open ? '180deg' : '0deg')});
  color: ${({ theme }) => theme.color.textMuted};
`

const Panel = styled.div<{ open: boolean }>`
  display: grid;
  grid-template-rows: ${({ open }) => (open ? '1fr' : '0fr')};
  transition: grid-template-rows 0.3s ease;
`

const PanelInner = styled.div`
  min-height: 0;
  overflow: hidden;
  padding-bottom: ${({ theme }) => theme.spacing(1)};
`

const AccountCard = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  align-items: center;
  gap: ${({ theme }) => theme.spacing(1.5)};
  padding: ${({ theme }) => theme.spacing(1.75)} ${({ theme }) => theme.spacing(2)};
  margin-bottom: ${({ theme }) => theme.spacing(1)};
  border: 1px solid ${({ theme }) => theme.color.border};
  border-radius: 8px;
  background: ${({ theme }) => theme.color.surface};
`

const PersonInfo = styled.div`
  text-align: left;
  min-width: 0;
`

const Role = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing(0.75)};
  color: ${({ theme }) => theme.color.text};
  font-size: 0.9rem;
  font-weight: 500;
`

const AccountNumber = styled.div`
  color: ${({ theme }) => theme.color.text};
  font-size: 0.98rem;
  line-height: 1.5;
  overflow-wrap: anywhere;
`

const BankOwner = styled.div`
  color: ${({ theme }) => theme.color.textMuted};
  font-size: 0.82rem;
  line-height: 1.5;
`

function ContactList({ people }: { people: ContactPerson[] }) {
  return (
    <>
      {people.map((c) => (
        <AccountCard key={c.role}>
          <PersonInfo>
            <Role>
              {c.role} {c.name}
            </Role>
            <AccountNumber>{c.account}</AccountNumber>
            <BankOwner>
              {c.bank} {c.name}
            </BankOwner>
          </PersonInfo>
          <CopyButton value={formatAccountForCopy(c.bank, c.account)} />
        </AccountCard>
      ))}
    </>
  )
}

function AccordionSide({
  label,
  people,
  last,
}: {
  label: string
  people: ContactPerson[]
  last?: boolean
}) {
  const [open, setOpen] = useState(false)

  return (
    <SideGroup last={last}>
      <SideHeader type="button" onClick={() => setOpen((prev) => !prev)} aria-expanded={open}>
        <SideLabel>{label}</SideLabel>
        <Chevron open={open} aria-hidden="true">
          ⌄
        </Chevron>
      </SideHeader>
      <Panel open={open}>
        <PanelInner>
          <ContactList people={people} />
        </PanelInner>
      </Panel>
    </SideGroup>
  )
}

export function Contacts() {
  return (
    <Section>
      <Reveal>
        <Title>마음 전하실 곳</Title>
        <Description>
          멀리서도 축하의 마음을 전하고 싶으신 분들을 위해 계좌번호를 안내드립니다.
        </Description>
      </Reveal>
      <Reveal delay={120}>
        <AccordionSide label="신랑 측" people={GROOM_CONTACTS} />
      </Reveal>
      <Reveal delay={220}>
        <AccordionSide label="신부 측" people={BRIDE_CONTACTS} last />
      </Reveal>
    </Section>
  )
}
