import {defineConfig} from 'vitepress'

// Helper function to generate sidebar from docs structure
function generateSidebar() {
    return {
        '/en/': [
            {
                text: 'Getting Started',
                collapsed: false,
                items: [
                    {text: 'Installation', link: '/en/installation'},
                    {text: 'Quickstart', link: '/en/quickstart'},
                    {text: 'Introduction', link: '/en/intro'},
                    {text: 'Conventions', link: '/en/intro/conventions'},
                    {text: 'CakePHP Folder Structure', link: '/en/intro/cakephp-folder-structure'},
                    {text: 'Where to Get Help', link: '/en/intro/where-to-get-help'}
                ]
            },
            {
                text: 'Tutorials & Examples',
                collapsed: true,
                items: [
                    {text: 'Overview', link: '/en/tutorials-and-examples'},
                    {
                        text: 'CMS Tutorial', collapsed: true, items: [
                            {text: 'Installation', link: '/en/tutorials-and-examples/cms/installation'},
                            {text: 'Database', link: '/en/tutorials-and-examples/cms/database'},
                            {text: 'Articles Controller', link: '/en/tutorials-and-examples/cms/articles-controller'},
                            {text: 'Articles Model', link: '/en/tutorials-and-examples/cms/articles-model'},
                            {text: 'Authentication', link: '/en/tutorials-and-examples/cms/authentication'},
                            {text: 'Authorization', link: '/en/tutorials-and-examples/cms/authorization'},
                            {text: 'Tags and Users', link: '/en/tutorials-and-examples/cms/tags-and-users'}
                        ]
                    }
                ]
            },
            {
                text: 'Controllers',
                collapsed: true,
                items: [
                    {text: 'Controllers', link: '/en/controllers'},
                    {text: 'Request & Response', link: '/en/controllers/request-response'},
                    {text: 'Middleware', link: '/en/controllers/middleware'},
                    {text: 'Pages Controller', link: '/en/controllers/pages-controller'},
                    {text: 'Pagination', link: '/en/controllers/pagination'},
                    {
                        text: 'Components', collapsed: true, items: [
                            {text: 'Components', link: '/en/controllers/components'},
                            {text: 'Check HTTP Cache', link: '/en/controllers/components/check-http-cache'},
                            {text: 'Flash', link: '/en/controllers/components/flash'},
                            {text: 'Form Protection', link: '/en/controllers/components/form-protection'}
                        ]
                    }
                ]
            },
            {
                text: 'Views',
                collapsed: true,
                items: [
                    {text: 'Views', link: '/en/views'},
                    {text: 'Cells', link: '/en/views/cells'},
                    {text: 'JSON and XML Views', link: '/en/views/json-and-xml-views'},
                    {text: 'Themes', link: '/en/views/themes'},
                    {
                        text: 'Helpers', collapsed: true, items: [
                            {text: 'Helpers', link: '/en/views/helpers'},
                            {text: 'Breadcrumbs', link: '/en/views/helpers/breadcrumbs'},
                            {text: 'Flash', link: '/en/views/helpers/flash'},
                            {text: 'Form', link: '/en/views/helpers/form'},
                            {text: 'HTML', link: '/en/views/helpers/html'},
                            {text: 'Number', link: '/en/views/helpers/number'},
                            {text: 'Paginator', link: '/en/views/helpers/paginator'},
                            {text: 'Text', link: '/en/views/helpers/text'},
                            {text: 'Time', link: '/en/views/helpers/time'},
                            {text: 'URL', link: '/en/views/helpers/url'}
                        ]
                    }
                ]
            },
            {
                text: 'ORM',
                collapsed: true,
                items: [
                    {text: 'ORM', link: '/en/orm'},
                    {text: 'Database Basics', link: '/en/orm/database-basics'},
                    {text: 'Query Builder', link: '/en/orm/query-builder'},
                    {text: 'Table Objects', link: '/en/orm/table-objects'},
                    {text: 'Entities', link: '/en/orm/entities'},
                    {text: 'Associations', link: '/en/orm/associations'},
                    {text: 'Retrieving Data and Resultsets', link: '/en/orm/retrieving-data-and-resultsets'},
                    {text: 'Saving Data', link: '/en/orm/saving-data'},
                    {text: 'Deleting Data', link: '/en/orm/deleting-data'},
                    {text: 'Validation', link: '/en/orm/validation'},
                    {text: 'Schema System', link: '/en/orm/schema-system'},
                    {
                        text: 'Behaviors', collapsed: true, items: [
                            {text: 'Behaviors', link: '/en/orm/behaviors'},
                            {text: 'Counter Cache', link: '/en/orm/behaviors/counter-cache'},
                            {text: 'Timestamp', link: '/en/orm/behaviors/timestamp'},
                            {text: 'Translate', link: '/en/orm/behaviors/translate'},
                            {text: 'Tree', link: '/en/orm/behaviors/tree'}
                        ]
                    }
                ]
            },
            {
                text: 'Core Libraries',
                collapsed: true,
                items: [
                    {text: 'App', link: '/en/core-libraries/app'},
                    {text: 'Caching', link: '/en/core-libraries/caching'},
                    {text: 'Collections', link: '/en/core-libraries/collections'},
                    {text: 'Email', link: '/en/core-libraries/email'},
                    {text: 'Events', link: '/en/core-libraries/events'},
                    {text: 'Form', link: '/en/core-libraries/form'},
                    {text: 'Global Constants and Functions', link: '/en/core-libraries/global-constants-and-functions'},
                    {text: 'Hash', link: '/en/core-libraries/hash'},
                    {text: 'HTTP Client', link: '/en/core-libraries/httpclient'},
                    {text: 'Inflector', link: '/en/core-libraries/inflector'},
                    {
                        text: 'Internationalization and Localization',
                        link: '/en/core-libraries/internationalization-and-localization'
                    },
                    {text: 'Logging', link: '/en/core-libraries/logging'},
                    {text: 'Number', link: '/en/core-libraries/number'},
                    {text: 'Plugin', link: '/en/core-libraries/plugin'},
                    {text: 'Registry Objects', link: '/en/core-libraries/registry-objects'},
                    {text: 'Security', link: '/en/core-libraries/security'},
                    {text: 'Text', link: '/en/core-libraries/text'},
                    {text: 'Time', link: '/en/core-libraries/time'},
                    {text: 'Validation', link: '/en/core-libraries/validation'},
                    {text: 'XML', link: '/en/core-libraries/xml'}
                ]
            },
            {
                text: 'Console Commands',
                collapsed: true,
                items: [
                    {text: 'Console Commands', link: '/en/console-commands'},
                    {text: 'Commands', link: '/en/console-commands/commands'},
                    {text: 'Input Output', link: '/en/console-commands/input-output'},
                    {text: 'Option Parsers', link: '/en/console-commands/option-parsers'},
                    {text: 'Cache', link: '/en/console-commands/cache'},
                    {text: 'Completion', link: '/en/console-commands/completion'},
                    {text: 'Counter Cache', link: '/en/console-commands/counter-cache'},
                    {text: 'Cron Jobs', link: '/en/console-commands/cron-jobs'},
                    {text: 'I18n', link: '/en/console-commands/i18n'},
                    {text: 'Plugin', link: '/en/console-commands/plugin'},
                    {text: 'REPL', link: '/en/console-commands/repl'},
                    {text: 'Routes', link: '/en/console-commands/routes'},
                    {text: 'Schema Cache', link: '/en/console-commands/schema-cache'},
                    {text: 'Server', link: '/en/console-commands/server'}
                ]
            },
            {
                text: 'Development',
                collapsed: true,
                items: [
                    {text: 'Application', link: '/en/development/application'},
                    {text: 'Configuration', link: '/en/development/configuration'},
                    {text: 'Routing', link: '/en/development/routing'},
                    {text: 'Sessions', link: '/en/development/sessions'},
                    {text: 'Debugging', link: '/en/development/debugging'},
                    {text: 'Dependency Injection', link: '/en/development/dependency-injection'},
                    {text: 'Errors', link: '/en/development/errors'},
                    {text: 'REST', link: '/en/development/rest'},
                    {text: 'Testing', link: '/en/development/testing'}
                ]
            },
            {
                text: 'Security',
                collapsed: true,
                items: [
                    {text: 'Security', link: '/en/security'},
                    {text: 'Content Security Policy', link: '/en/security/content-security-policy'},
                    {text: 'CSRF', link: '/en/security/csrf'},
                    {text: 'HTTPS Enforcer', link: '/en/security/https-enforcer'},
                    {text: 'Security Headers', link: '/en/security/security-headers'}
                ]
            },
            {
                text: 'Bake Console',
                collapsed: true,
                items: [
                    {text: 'Bake', link: '/en/bake'},
                    {text: 'Development', link: '/en/bake/development'},
                    {text: 'Usage', link: '/en/bake/usage'}
                ]
            },
            {
                text: 'Contributing',
                collapsed: true,
                items: [
                    {text: 'Contributing', link: '/en/contributing'},
                    {text: 'Backwards Compatibility', link: '/en/contributing/backwards-compatibility'},
                    {text: 'CakePHP Coding Conventions', link: '/en/contributing/cakephp-coding-conventions'},
                    {text: 'Code', link: '/en/contributing/code'},
                    {text: 'Documentation', link: '/en/contributing/documentation'},
                    {text: 'Tickets', link: '/en/contributing/tickets'}
                ]
            },
            {
                text: 'Appendices',
                collapsed: true,
                items: [
                    {text: 'Appendices', link: '/en/appendices'},
                    {text: 'Migration Guides', link: '/en/appendices/migration-guides'},
                    {text: '5.0 Migration Guide', link: '/en/appendices/5-0-migration-guide'},
                    {text: '5.0 Upgrade Guide', link: '/en/appendices/5-0-upgrade-guide'},
                    {text: '5.1 Migration Guide', link: '/en/appendices/5-1-migration-guide'},
                    {text: '5.2 Migration Guide', link: '/en/appendices/5-2-migration-guide'},
                    {text: 'CakePHP Development Process', link: '/en/appendices/cakephp-development-process'},
                    {text: 'Glossary', link: '/en/appendices/glossary'},
                    {text: 'PHPUnit 10', link: '/en/appendices/phpunit10'}
                ]
            },
            {
                text: 'Additional Topics',
                collapsed: true,
                items: [
                    {text: 'Plugins', link: '/en/plugins'},
                    {text: 'Deployment', link: '/en/deployment'},
                    {text: 'Release Policy', link: '/en/release-policy'},
                    {text: 'Standalone Packages', link: '/en/standalone-packages'},
                    {text: 'Topics', link: '/en/topics'},
                    {text: 'Chronos', link: '/en/chronos'},
                    {text: 'Debug Kit', link: '/en/debug-kit'},
                    {text: 'Elasticsearch', link: '/en/elasticsearch'},
                    {text: 'Migrations', link: '/en/migrations'},
                    {text: 'Phinx', link: '/en/phinx'}
                ]
            }
        ]
    }
}

// https://vitepress.dev/reference/site-config
export default defineConfig({
    srcDir: "./markdown", // Path to the markdown source files
    outDir: "./dist", // Path to the output directory
    title: "CakePHP Cookbook",
    description: "CakePHP Documentation - The rapid development PHP framework",

    ignoreDeadLinks: true, // Maybe we can remove this later?

    // https://vitepress.dev/reference/default-theme-config
    themeConfig: {
        logo: '/logo.svg',

        nav: [
            {text: 'Guide', link: '/en/intro'},
            {text: 'API', link: 'https://api.cakephp.org/'},
            {text: 'Cookbook', link: '/en/'},
            {
                text: '5.x',
                items: [
                    {text: '5.x (Current)', link: '/en/'},
                    {text: '4.x', link: 'https://book.cakephp.org/4/en/'},
                    {text: '3.x', link: 'https://book.cakephp.org/3/en/'}
                ]
            }
        ],

        sidebar: generateSidebar(),

        socialLinks: [
            { icon: 'github', link: 'https://github.com/cakephp/cakephp' },
        ],

        search: {
            provider: 'local'
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
    }
})
