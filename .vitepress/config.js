import { defineConfig } from 'vitepress'
import { substitutionsReplacer } from './plugins/substitutions-replacer.js'
import { deepMerge, loadConfigOverrides, applyBaseToHeadTags } from './utils.js'

const defaultConfig = {
  srcDir: 'docs',
  title: 'CakePHP',
  description: 'CakePHP Documentation - The rapid development PHP framework',
  ignoreDeadLinks: true,
  substitutions: {
    '|phpversion|': { value: '8.4', format: 'bold' },
    '|minphpversion|': { value: '8.1', format: 'italic' },
    // Add more substitutions here as needed
    // '|cakeversion|': { value: '5.1', format: 'bold' },
    // '|projectname|': 'CakePHP',  // Simple string without formatting
  },
  head: [
    ['link', { rel: 'icon', type: 'image/png', href: '/favicon/favicon-96x96.png', sizes: '96x96' }],
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/favicon/favicon.svg' }],
    ['link', { rel: 'shortcut icon', href: '/favicon/favicon.ico' }],
    ['link', { rel: 'apple-touch-icon', sizes: '180x180', href: '/favicon/apple-touch-icon.png' }],
    ['meta', { name: 'apple-mobile-web-app-title', content: 'CakePHP' }],
    ['link', { rel: 'manifest', href: '/favicon/site.webmanifest' }],
    [
      'script',
      {
        'data-collect-dnt': 'true',
        async: 'true',
        src: 'https://scripts.simpleanalyticscdn.com/latest.js'
      }
    ],
    [
      'script',
      { async: '', src: 'https://www.googletagmanager.com/gtag/js?id=G-MD3J6G9QVX' }
    ],
    [
      'script',
      {},
      `window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'G-MD3J6G9QVX', { 'anonymize_ip': true });`
    ]
  ],
  themeConfig: {
    logo: '/logo.svg',
    outline: {
      level: [2, 3],
    },
    search: {
      provider: 'local',
    },
    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © Cake Software Foundation, Inc. All rights reserved.'
    },
    lastUpdated: {
      text: 'Updated at',
      formatOptions: {
        dateStyle: 'full',
        timeStyle: 'medium'
      }
    },
    versionBanner: false
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'framework': ['vue']
        }
      }
    }
  },
  markdown: {
    lineNumbers: true,
  },
  locales: {}
}

const overrides = await loadConfigOverrides(import.meta.url)
const mergedConfig = deepMerge(defaultConfig, overrides)

// Configure markdown plugins after mergedConfig is available
const overrideMarkdownConfig = overrides.markdown?.config
mergedConfig.markdown.config = (md) => {
  md.use(substitutionsReplacer, { substitutions: mergedConfig.substitutions || {} })
  if (overrideMarkdownConfig) {
    overrideMarkdownConfig(md)
  }
}

// Apply base path to head tags if base is specified
if (overrides.base) {
  applyBaseToHeadTags(mergedConfig, overrides.base)
}

export default defineConfig(mergedConfig)
