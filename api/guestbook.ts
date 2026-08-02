import type { VercelRequest, VercelResponse } from '@vercel/node'
import { validateGuestbookEntry } from './guestbook.validation'
import { createEntry, listEntries } from './guestbook.notion'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'GET') {
    try {
      const entries = await listEntries()
      return res.status(200).json({ entries })
    } catch (err) {
      return res.status(500).json({ error: (err as Error).message })
    }
  }

  if (req.method === 'POST') {
    const { name, message } = req.body ?? {}
    const validation = validateGuestbookEntry({ name, message })
    if (!validation.valid) {
      return res.status(400).json({ error: validation.error })
    }
    try {
      await createEntry({ name, message })
      return res.status(201).json({ ok: true })
    } catch (err) {
      return res.status(500).json({ error: (err as Error).message })
    }
  }

  res.setHeader('Allow', 'GET, POST')
  return res.status(405).json({ error: 'Method Not Allowed' })
}
