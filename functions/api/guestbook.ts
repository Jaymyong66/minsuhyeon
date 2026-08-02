import { validateGuestbookEntry } from '../../api/guestbook.validation'
import { createEntry, listEntries, type NotionEnv } from '../../api/guestbook.notion'

type Env = NotionEnv

export const onRequestGet: PagesFunction<Env> = async (context) => {
  try {
    const entries = await listEntries(context.env)
    return Response.json({ entries })
  } catch (err) {
    return Response.json({ error: (err as Error).message }, { status: 500 })
  }
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const body = (await context.request.json().catch(() => ({}))) as { name?: string; message?: string }
  const name = body.name ?? ''
  const message = body.message ?? ''

  const validation = validateGuestbookEntry({ name, message })
  if (!validation.valid) {
    return Response.json({ error: validation.error }, { status: 400 })
  }

  try {
    await createEntry({ name, message }, context.env)
    return Response.json({ ok: true }, { status: 201 })
  } catch (err) {
    return Response.json({ error: (err as Error).message }, { status: 500 })
  }
}
