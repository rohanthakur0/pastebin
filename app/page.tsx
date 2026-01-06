'use client'
import { useState } from 'react'

export default function Home() {
  const [content, setContent] = useState('')
  const [url, setUrl] = useState<string | null>(null)

  async function submit() {
    const res = await fetch('/api/pastes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content })
    })
    const data = await res.json()
    setUrl(data.url)
  }

  return (
    <div style={{ padding: 20 }}>
      <textarea rows={10} value={content} onChange={e => setContent(e.target.value)} />
      <br />
      <button onClick={submit}>Create Paste</button>
      {url && <p>URL: <a href={url}>{url}</a></p>}
    </div>
  )
}