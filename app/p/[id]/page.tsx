import { redis } from '../../../lib/redis'
import { nowMs } from '../../../lib/time'
import { notFound } from 'next/navigation'

function getNow() {
  if (process.env.TEST_MODE === '1') {
    if (typeof window === 'undefined') {
      // On server, use headers from next/headers
      const { headers } = require('next/headers')
      const h = headers().get('x-test-now-ms')
      if (h && !isNaN(Number(h))) return Number(h)
    } else {
      // On client, use fetch headers (should not happen for this page)
      // fallback to Date.now()
    }
  }
  return nowMs()
}

export default async function PastePage({ params }: { params: { id: string } }) {
  const key = `paste:${params.id}`
  const paste = await redis.hgetall<any>(key)

  if (!paste?.content) notFound()

  // Parse numbers and handle nulls
  const maxViews = paste.max_views !== undefined && paste.max_views !== null && paste.max_views !== '' ? Number(paste.max_views) : null
  const expiresAt = paste.expires_at !== undefined && paste.expires_at !== null && paste.expires_at !== '' ? Number(paste.expires_at) : null
  const views = paste.views !== undefined && paste.views !== null && paste.views !== '' ? Number(paste.views) : 0

  const now = getNow()

  if (expiresAt !== null && now >= expiresAt) notFound()
  if (maxViews !== null && views >= maxViews) notFound()

  const newViews = await redis.hincrby(key, 'views', 1)
  if (maxViews !== null && newViews > maxViews) notFound()

  return (
    <pre style={{ whiteSpace: 'pre-wrap', padding: 20 }}>
      {paste.content}
    </pre>
  )
}