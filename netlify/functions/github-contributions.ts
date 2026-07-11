/**
 * Netlify Function: /api/github/github-contributions
 *
 * Proxies the GitHub GraphQL contributionCalendar query so that
 * GITHUB_TOKEN stays server-side (never reaches the browser bundle).
 *
 * Browser-side call:
 *   GET /api/github/github-contributions?login=JAYTDD
 *
 * Env var (Netlify UI → Site configuration → Environment variables):
 *   GITHUB_TOKEN   classic PAT w/ `read:user` + `repo`
 *                  (or fine-grained: JAYTDD user, Metadata: read)
 */

const GITHUB_GRAPHQL = 'https://api.github.com/graphql'

/** Only serve contribution calendars for this account — prevents PAT abuse as a public proxy. */
const ALLOWED_LOGIN = (process.env.ALLOWED_GITHUB_LOGIN || 'JAYTDD').trim()

const QUERY = /* GraphQL */ `
  query ($login: String!) {
    user(login: $login) {
      contributionsCollection {
        contributionCalendar {
          totalContributions
          weeks {
            contributionDays {
              contributionCount
              date
              weekday
            }
          }
        }
      }
    }
  }
`

const CACHE_OK = 'public, max-age=300, s-maxage=300'
const CACHE_ERR = 'no-store'

const jsonResponse = (body: unknown, init: ResponseInit = {}, cache = CACHE_ERR): Response =>
  new Response(JSON.stringify(body), {
    ...init,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': cache,
      ...init.headers,
    },
  })

export default async (req: Request): Promise<Response> => {
  if (req.method !== 'GET') {
    return jsonResponse({ message: 'Method not allowed' }, { status: 405 })
  }

  const token = process.env.GITHUB_TOKEN
  if (!token) {
    return jsonResponse(
      { message: 'Server is not configured for GitHub contributions' },
      { status: 500 },
    )
  }

  const url = new URL(req.url)
  const login = (url.searchParams.get('login') || ALLOWED_LOGIN).trim()

  if (!/^[A-Za-z0-9](?:[A-Za-z0-9-]{0,38})$/.test(login)) {
    return jsonResponse({ message: 'Invalid login' }, { status: 400 })
  }

  // Hard allowlist — personal site only needs one user.
  if (login.toLowerCase() !== ALLOWED_LOGIN.toLowerCase()) {
    return jsonResponse({ message: 'Login not allowed' }, { status: 403 })
  }

  let upstream: Response
  try {
    upstream = await fetch(GITHUB_GRAPHQL, {
      method: 'POST',
      headers: {
        Authorization: `bearer ${token}`,
        'Content-Type': 'application/json',
        Accept: 'application/vnd.github.v3+json',
        'User-Agent': 'lunesnow-blog-netlify-fn',
      },
      body: JSON.stringify({ query: QUERY, variables: { login } }),
    })
  } catch {
    return jsonResponse({ message: 'Upstream request failed' }, { status: 502 })
  }

  const body = await upstream.text()
  const ok = upstream.ok
  return new Response(body, {
    status: upstream.status,
    headers: {
      'Content-Type':
        upstream.headers.get('content-type') ?? 'application/json; charset=utf-8',
      'Cache-Control': ok ? CACHE_OK : CACHE_ERR,
    },
  })
}

export const config = {
  // Hard cap so a slow GitHub response can't pin a function instance.
  timeout: 5,
}
