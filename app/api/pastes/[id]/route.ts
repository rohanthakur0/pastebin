
import { redis } from '../../../../lib/redis'
import { nowMs } from '../../../../lib/time'

function getNow(req: Request) {
  if (process.env.TEST_MODE === '1') {
    const testNow = req.headers.get('x-test-now-ms')
    if (testNow && !isNaN(Number(testNow))) {
      return Number(testNow)
    }
  }
  return nowMs()
}

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const key = `paste:${params.id}`
  const paste = await redis.hgetall<any>(key)

  if (!paste?.content) {
    return Response.json({ error: 'Not found' }, { status: 404 })
  }

  // Parse numbers and handle nulls
  const maxViews = paste.max_views !== undefined && paste.max_views !== null && paste.max_views !== '' ? Number(paste.max_views) : null
  const expiresAt = paste.expires_at !== undefined && paste.expires_at !== null && paste.expires_at !== '' ? Number(paste.expires_at) : null
  const views = paste.views !== undefined && paste.views !== null && paste.views !== '' ? Number(paste.views) : 0

  const now = getNow(req)

  // Check expiry
  if (expiresAt !== null && now >= expiresAt) {
    return Response.json({ error: 'Not found' }, { status: 404 })
  }

  // Check view limit BEFORE incrementing
  if (maxViews !== null && views >= maxViews) {
    return Response.json({ error: 'Not found' }, { status: 404 })
  }

  // Increment views
  const newViews = await redis.hincrby(key, 'views', 1)

  // Check view limit AFTER incrementing
  if (maxViews !== null && newViews > maxViews) {
    return Response.json({ error: 'Not found' }, { status: 404 })
  }

  return Response.json({
    content: paste.content,
    remaining_views: maxViews === null ? null : Math.max(0, maxViews - newViews),
    expires_at: expiresAt !== null ? new Date(expiresAt).toISOString() : null
  })
}