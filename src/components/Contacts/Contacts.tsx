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
  margin-bottom: ${({ theme }) => theme.spacing(3)};
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
`

const PersonRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: ${({ theme }) => theme.spacing(1)};
  padding: ${({ theme }) => theme.spacing(1.5)} 0;
  border-top: 1px solid ${({ theme }) => theme.color.border};
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
        {label}
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
      </Reveal>
      <Reveal delay={120}>
        <AccordionSide label="신랑측" people={GROOM_CONTACTS} />
      </Reveal>
      <Reveal delay={220}>
        <AccordionSide label="신부측" people={BRIDE_CONTACTS} last />
      </Reveal>
    </Section>
  )
}
