import js from '@eslint/js'
import vue from 'eslint-plugin-vue'
import globals from 'globals'

export default [
  js.configs.recommended,
  ...vue.configs['flat/recommended'],
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node
      },
      ecmaVersion: 'latest',
      sourceType: 'module'
    },
    rules: {
      // General JavaScript rules
      'no-console': 'warn',
      'no-debugger': 'error',
      'no-unused-vars': ['error', { 'argsIgnorePattern': '^_' }],
      'prefer-const': 'error',
      'no-var': 'error',

      // Vue-specific rules
      'vue/multi-word-component-names': 'off',
      'vue/no-unused-vars': 'error',
      'vue/component-definition-name-casing': ['error', 'PascalCase'],
      'vue/html-self-closing': ['error', {
        'html': {
          'void': 'always',
          'normal': 'always',
          'component': 'always'
        },
        'svg': 'always',
        'math': 'always'
      }]
    }
  },
  {
    files: [
      '.vitepress/**/*.js',
      '*.js'
    ],
    rules: {
      // More relaxed rules for config files
      'no-console': 'off'
    }
  },
  {
    ignores: [
      '.vitepress/cache/**',
      '.vitepress/dist/**',
      'node_modules/**'
    ]
  }
]
