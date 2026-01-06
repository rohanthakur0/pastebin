import { redis } from '../../../lib/redis'

export async function GET() {
  try {
    await redis.ping()
    return Response.json({ ok: true })
  } catch {
    return Response.json({ ok: false }, { status: 500 })
  }
}