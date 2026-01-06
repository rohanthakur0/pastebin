import { headers } from 'next/headers'

export function nowMs(): number {
  if (process.env.TEST_MODE === '1') {
    const h = headers().get('x-test-now-ms')
    if (h) return Number(h)
  }
  return Date.now()
}