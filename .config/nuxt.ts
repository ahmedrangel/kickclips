import { SITE, SEO } from "../shared/utils/helpers";

const headers = {
  "Cross-Origin-Embedder-Policy": "credentialless",
  "Cross-Origin-Opener-Policy": "same-origin"
};

export default defineNuxtConfig({
  compatibilityDate: "2025-07-18",
  css: [
    "bootstrap/dist/css/bootstrap.min.css",
    "~/assets/css/kcd.css",
    "~/assets/css/transitions.css",
    "~/assets/css/range-slider.css"
  ],
  app: {
    head: {
      charset: "utf-8",
      viewport: "width=device-width, initial-scale=1",
      htmlAttrs: {
        lang: "en"
      },
      meta: [
        { name: "robots", content: "index, follow" },
        { property: "og:site:name", content: SEO.og.site_name }
      ],
      link: [
        { rel: "apple-touch-icon", sizes: "180x180", href: "/apple-touch-icon.png" },
        { rel: "icon", type: "image/png", sizes: "512x512", href: "/android-chrome-512x512.png" },
        { rel: "icon", type: "image/png", sizes: "192x192", href: "/android-chrome-192x192.png" },
        { rel: "icon", type: "image/png", sizes: "32x32", href: "/favicon-32x32.png" },
        { rel: "icon", type: "image/png", sizes: "16x16", href: "/favicon-16x16.png" },
        { rel: "manifest", href: "/site.webmanifest" },
        { rel: "mask-icon", href: "/safari-pinned-tab.svg", color: "#0b0e0f" }
      ]
    }
  },
  features: {
    inlineStyles: false
  },
  modules: [
    "@nuxt/eslint",
    "@nuxt/icon",
    "@nuxtjs/sitemap",
    "nuxt-ripple"
  ],
  runtimeConfig: {
    cdnToken: "",
    kickToken: ""
  },
  site: {
    url: SITE.url
  },
  nitro: {
    prerender: {
      routes: ["/sitemap.xml"]
    }
  },
  sitemap: {
    urls: [
      { loc: "/", priority: 1, lastmod: new Date().toISOString() }
    ],
    defaults: { priority: 0.8, lastmod: new Date().toISOString() },
    xslColumns: [
      { label: "URL", width: "65%" },
      { label: "Priority", select: "sitemap:priority", width: "12.5%" },
      { label: "Last Modified", select: "sitemap:lastmod", width: "35%" }
    ]
  },
  routeRules: {
    "/**": { headers },
    "/_nuxt/**": { headers },
    "/api/_nuxt_icon/**": { cache: { maxAge: 1.577e+7 } }
  },
  eslint: {
    config: {
      autoInit: false,
      stylistic: true
    }
  },
  vite: {
    optimizeDeps: {
      exclude: ["@ffmpeg/ffmpeg", "@ffmpeg/util"]
    },
    server: {
      headers
    }
  },
  icon: {
    mode: "svg",
    clientBundle: { scan: true, sizeLimitKb: 2048 }
  },
  experimental: {
    typedPages: true
  }
});
