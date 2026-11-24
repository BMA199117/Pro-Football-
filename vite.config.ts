import { defineConfig, loadEnv, type Plugin } from 'vite'
import { fileURLToPath } from 'node:url'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// BASE_PATH is set by the GitHub Pages workflow (e.g. "/Pro-Football-/").
const base = process.env.BASE_PATH || '/'

/** Swap src/content-source.ts (full library) for src/content-source.paywall.ts (catalog only). */
function paidContent(): Plugin {
  const full = fileURLToPath(new URL('./src/content-source.ts', import.meta.url))
  const paid = fileURLToPath(new URL('./src/content-source.paywall.ts', import.meta.url))
  return {
    name: 'paid-content',
    enforce: 'pre',
    async resolveId(source, importer, options) {
      if (!/content-source$/.test(source) || !importer) return null
      const r = await this.resolve(source, importer, { ...options, skipSelf: true })
      return r && r.id === full ? paid : null
    },
  }
}

export default defineConfig(({ command, mode }) => {
  const env = { ...loadEnv(mode, process.cwd(), ''), ...process.env }
  // Paid version: a production build with a server ships only the drill catalog (VITE_PAYWALL=0 turns it off).
  const paywall = command === 'build' && !!env.VITE_SUPABASE_URL && env.VITE_PAYWALL !== '0'
  return {
  base,
  plugins: [
    paywall && paidContent(),
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      // let robots.txt / sitemap.xml / og.png load as files, not as the app
      workbox: { navigateFallbackDenylist: [/\.(xml|txt|png)$/, /^\/api\//] },
      includeAssets: ['icon.svg'],
      manifest: {
        name: 'Pro Football',
        short_name: 'Pro Football',
        description: "Futbol murabbiylari uchun mashg'ulot ilovasi",
        lang: 'uz',
        theme_color: '#1F6B4A',
        background_color: '#F3F6F2',
        display: 'standalone',
        start_url: base,
        scope: base,
        icons: [
          { src: 'icon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any maskable' }
        ]
      }
    })
  ]
}
})
