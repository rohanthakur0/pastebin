
# Pastebin Lite

Production-grade Pastebin-like service built with Next.js and Redis.

## How it Works (Beginner Friendly)

### 1. Paste Creation
- User submits text (and optionally, view/expiry limits).
- Server receives the request in an API route.
- If limits are not set, defaults from `.env.local` are used.
- A unique ID is generated for the paste.
- The paste is saved in Redis with its settings (content, max views, expiry, views=0).

### 2. Paste Viewing
- User visits `/p/[id]` to view a paste.
- Server fetches the paste from Redis using the ID.
- Checks if the paste exists, is expired, or has exceeded view limit.
- If valid, increments the view count and shows the content.
- If not, shows a "not found" page.

### 3. Configuration
- `.env.local` holds default values for max views and expiry.
- These are used if the user doesn’t specify their own limits.

### 4. Technologies Used
- **Next.js**: For routing, API endpoints, and rendering pages.
- **Redis (Upstash)**: For fast, serverless data storage.

---

## Run locally
```
npm install
npm run dev
```

## Persistence
Upstash Redis (serverless-safe)

## Features
- TTL expiry
- View limits
- Deterministic test mode
