// Dev-only emulation of the Netlify Function routes declared in netlify.toml:
//   /api/github/<name>  →  netlify/functions/<name>.ts
//
// Production keeps the real Netlify redirect + Functions runtime; this plugin
// only exists so `npm run dev` can serve Function-backed endpoints (e.g. the
// GitHub contributions heatmap) without installing/running netlify-cli.
import type { Plugin } from 'vite'
import { loadEnv } from 'vite'

import githubContributions from '../netlify/functions/github-contributions'

/** route name → Netlify Function handler (add new functions here) */
const FUNCTIONS: Record<string, (req: Request) => Promise<Response>> = {
  'github-contributions': githubContributions,
}

export function netlifyFunctionsDev(mode: string): Plugin {
  return {
    name: 'dev-netlify-functions',
    apply: 'serve',
    configureServer(server) {
      // .env files are not loaded into process.env in the config/plugin context
      const env = loadEnv(mode, server.config.root, '')
      if (env.GITHUB_TOKEN && !process.env.GITHUB_TOKEN) {
        process.env.GITHUB_TOKEN = env.GITHUB_TOKEN
      }

      server.middlewares.use((req, res, next) => {
        const url = req.url || ''
        if (!url.startsWith('/api/github/')) return next()

        const name = url.slice('/api/github/'.length).split('?')[0] ?? ''
        const handler = FUNCTIONS[name]
        if (!handler) {
          res.statusCode = 404
          res.setHeader('Content-Type', 'application/json; charset=utf-8')
          res.end(JSON.stringify({ message: `No local Function "${name}" registered` }))
          return
        }

        handler(new Request(`http://localhost${url}`, { method: req.method })).then(
          async (response) => {
            res.statusCode = response.status
            response.headers.forEach((value, key) => res.setHeader(key, value))
            res.end(Buffer.from(await response.arrayBuffer()))
          },
          (err: unknown) => {
            res.statusCode = 500
            res.setHeader('Content-Type', 'application/json; charset=utf-8')
            res.end(JSON.stringify({ message: err instanceof Error ? err.message : String(err) }))
          },
        )
      })
    },
  }
}
