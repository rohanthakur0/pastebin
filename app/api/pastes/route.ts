import { redis } from '../../../lib/redis'
import { nanoid } from 'nanoid'
import { nowMs } from '../../../lib/time'

export async function POST(req: Request) {
  const body = await req.json().catch(() => null)

  if (!body || typeof body.content !== 'string' || !body.content.trim()) {
    return Response.json({ error: 'Invalid content' }, { status: 400 })
  }

  const ttl = body.ttl_seconds
  const maxViews = body.max_views

  if (ttl !== undefined && (!Number.isInteger(ttl) || ttl < 1)) {
    return Response.json({ error: 'Invalid ttl_seconds' }, { status: 400 })
  }

  if (maxViews !== undefined && (!Number.isInteger(maxViews) || maxViews < 1)) {
    return Response.json({ error: 'Invalid max_views' }, { status: 400 })
  }

  const id = nanoid(10)
  const created = nowMs()
  const expiresAt = ttl ? created + ttl * 1000 : null

  await redis.hset(`paste:${id}`, {
    content: body.content,
    created_at: created,
    expires_at: expiresAt,
    max_views: maxViews ?? null,
    views: 0
  })

  // Build absolute URL for returned paste
  let baseUrl = process.env.NEXT_PUBLIC_BASE_URL || process.env.VERCEL_URL || ''
  if (baseUrl && !baseUrl.startsWith('http')) baseUrl = 'https://' + baseUrl
  const url = baseUrl ? `${baseUrl}/p/${id}` : `/p/${id}`

  return Response.json({
    id,
    url
  })
}