import { defineConfig } from 'vitepress'
import { generateSidebars } from './sidebar.js'
import { getVersionByPath } from './cake.js'
import { versionReplacer } from './plugins/version-replacer.js'

export default defineConfig({
    srcDir: 'docs',
    title: 'CakePHP',
    description: 'CakePHP Documentation - The rapid development PHP framework',
    ignoreDeadLinks: true,
    themeConfig: {
        logo: '/logo.svg',
        nav: [
            { text: 'Guide', link: '/5/en/intro' },
            { text: 'API', link: 'https://api.cakephp.org/' },
            { text: 'Documentation', link: '/5/en/' },
            {
                component: 'VersionDropdown',
            }
        ],
        sidebar: generateSidebars(),
        socialLinks: [
            { icon: 'github', link: 'https://github.com/cakephp/cakephp' },
        ],

        // Let's only index latest version in search to speed up indexing.
        search: {
            provider: 'local',
            options: {
                async _render(src, env, md) {
                    const versioninfo = getVersionByPath(env.relativePath)
                    if (!env.relativePath.startsWith(versioninfo.version + '/en')) return ''
                    const html = await md.render(src, env)
                    return html
                }
            }
        },
        editLink: {
            pattern: 'https://github.com/cakephp/docs/edit/5.x/en/:path',
            text: 'Edit this page on GitHub'
        },
        footer: {
            message: 'Released under the MIT License.',
            copyright: 'Copyright © 2005-2024 The CakePHP Team'
        },
        lastUpdated: {
            text: 'Updated at',
            formatOptions: {
                dateStyle: 'full',
                timeStyle: 'medium'
            }
        }
    },
    locales: {
        root: {
            label: 'English',
            lang: 'en',
            link: '/5/en/'
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
    }
})
