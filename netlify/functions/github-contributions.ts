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

const jsonResponse = (body: unknown, init: ResponseInit = {}): Response =>
  new Response(JSON.stringify(body), {
    ...init,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      // Cache 5 min at the edge and in the browser.
      'Cache-Control': 'public, max-age=300, s-maxage=300',
      ...(init.headers || {}),
    },
  })

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
  const login = (url.searchParams.get('login') || 'JAYTDD').trim()

  if (!/^[A-Za-z0-9](?:[A-Za-z0-9-]{0,38})$/.test(login)) {
    return jsonResponse({ message: 'Invalid login' }, { status: 400 })
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
  } catch (err) {
    return jsonResponse(
      { message: `Upstream fetch failed: ${(err as Error).message}` },
      { status: 502 },
    )
  }

  // Pass through GitHub's response body + status. Cache-Control is kept from
  // jsonResponse so the result can be cached at the edge.
  const body = await upstream.text()
  return new Response(body, {
    status: upstream.status,
    headers: {
      'Content-Type':
        upstream.headers.get('content-type') ?? 'application/json; charset=utf-8',
      'Cache-Control': 'public, max-age=300, s-maxage=300',
    },
  })
}

export const config = {
  // Hard cap so a slow GitHub response can't pin a function instance.
  timeout: 5,
}
