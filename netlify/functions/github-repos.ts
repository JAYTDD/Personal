/**
 * Netlify Function: /api/github/repos
 *
 * Proxies GitHub REST `GET /users/{user}/repos` so the call is authenticated
 * (5000 req/hour) and not subject to per-visitor-IP rate limits.
 *
 * Browser-side call:
 *   GET /api/github/repos?user=JAYTDD&per_page=30&sort=updated
 *
 * Env var: GITHUB_TOKEN
 */

const GITHUB_API = 'https://api.github.com'

const jsonResponse = (body: unknown, init: ResponseInit = {}): Response =>
  new Response(JSON.stringify(body), {
    ...init,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'public, max-age=300, s-maxage=300',
      ...(init.headers || {}),
    },
  })

const ALLOWED_PARAMS = new Set(['per_page', 'sort', 'direction', 'type', 'page'])

export default async (req: Request): Promise<Response> => {
  if (req.method !== 'GET') {
    return jsonResponse({ message: 'Method not allowed' }, { status: 405 })
  }

  const token = process.env.GITHUB_TOKEN
  if (!token) {
    return jsonResponse(
      { message: 'GITHUB_TOKEN is not configured on the server' },
      { status: 500 },
    )
  }

  const url = new URL(req.url)
  const user = (url.searchParams.get('user') || 'JAYTDD').trim()
  if (!/^[A-Za-z0-9](?:[A-Za-z0-9-]{0,38})$/.test(user)) {
    return jsonResponse({ message: 'Invalid user' }, { status: 400 })
  }

  // Build upstream URL, allow-listing only safe query params.
  const upstream = new URL(`${GITHUB_API}/users/${user}/repos`)
  for (const [k, v] of url.searchParams) {
    if (ALLOWED_PARAMS.has(k)) upstream.searchParams.set(k, v)
  }
  // Sensible defaults if caller didn't pass them.
  if (!upstream.searchParams.has('per_page')) upstream.searchParams.set('per_page', '30')
  if (!upstream.searchParams.has('sort')) upstream.searchParams.set('sort', 'updated')

  let res: Response
  try {
    res = await fetch(upstream.toString(), {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2022-11-28',
        'User-Agent': 'lunesnow-blog-netlify-fn',
      },
    })
  } catch (err) {
    return jsonResponse(
      { message: `Upstream fetch failed: ${(err as Error).message}` },
      { status: 502 },
    )
  }

  const body = await res.text()
  return new Response(body, {
    status: res.status,
    headers: {
      'Content-Type':
        res.headers.get('content-type') ?? 'application/json; charset=utf-8',
      'Cache-Control': 'public, max-age=300, s-maxage=300',
    },
  })
}

export const config = { timeout: 5 }
