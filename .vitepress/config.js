import { defineConfig } from 'vitepress'
//import llmstxt from 'vitepress-plugin-llms'
import { generateSidebars } from './sidebar.js'
import { versionReplacer } from './plugins/version-replacer.js'

export default defineConfig({
  // vite: {
  //   plugins: [
  //     llmstxt({
  //       ignoreFiles: [
  //         '2.x/**',
  //         '3.x/**',
  //         '4.x/**',
  //         'ja/**'
  //       ],
  //     })
  //   ]
  // },
  srcDir: 'docs',
  title: 'CakePHP',
  description: 'CakePHP Documentation - The rapid development PHP framework',
  ignoreDeadLinks: true,
  head: [
    ['link', { rel: 'icon', type: 'image/png', href: '/favicon/favicon-96x96.png', sizes: '96x96' }],
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/favicon/favicon.svg' }],
    ['link', { rel: 'shortcut icon', href: '/favicon/favicon.ico' }],
    ['link', { rel: 'apple-touch-icon', sizes: '180x180', href: '/favicon/apple-touch-icon.png' }],
    ['meta', { name: 'apple-mobile-web-app-title', content: 'CakePHP' }],
    ['link', { rel: 'manifest', href: '/favicon/site.webmanifest' }],
    ['link', { rel: 'preconnect', href: 'https://fonts.googleapis.com' }],
    ['link', { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' }],
    ['link', { href: 'https://fonts.googleapis.com/css2?family=Raleway:ital,wght@0,100..900;1,100..900&display=swap', rel: 'stylesheet' }],
  ],
  rewrites: {
    ':version/:slug*': ':version/:slug*'
  },
  themeConfig: {
    logo: '/logo.svg',
    sidebar: generateSidebars(),
    socialLinks: [
      { icon: 'github', link: 'https://github.com/cakephp/cakephp' },
    ],

    // Let's only index latest version in search to speed up indexing.
    search: {
      provider: 'local',
      options: {
        async _render(src, env, md) {
          if (env.relativePath.startsWith('5.x') || env.relativePath.startsWith('ja/5.x')) {
            const html = await md.render(src, env)
            return html
          }

          return '';
        }
      }
    },
    editLink: {
      pattern: 'https://github.com/cakephp/docs/edit/:path',
      text: 'Edit this page on GitHub'
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
    }
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
    config: (md) => {
      md.use(versionReplacer)
    }
  },
  locales: {
    root: {
      label: 'English',
      lang: 'en',
      themeConfig: {
        nav: [
          { text: 'Guide', link: '/5.x/intro' },
          { text: 'API', link: 'https://api.cakephp.org/' },
          { text: 'Documentation', link: '/5.x/' },
          {
            component: 'VersionDropdown',
          }
        ],
      }
    },
    ja: {
      label: 'Japanese',
      lang: 'ja',
      link: '/ja/',
      themeConfig: {
        nav: [
          { text: 'ガイド', link: '/ja/5.x/intro' },
          { text: 'API', link: 'https://api.cakephp.org/' },
          { text: 'ドキュメント', link: '/ja/5.x/' },
          {
            component: 'VersionDropdown',
          }
        ],
        sidebar: generateSidebars(),
        editLink: {
          pattern: 'https://github.com/cakephp/docs/edit/:path',
          text: 'GitHub でこのページを編集'
        }
      }
    }
  }
})
