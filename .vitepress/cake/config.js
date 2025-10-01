/**
 * CakePHP Documentation Configuration
 *
 * Centralized configuration for versions, locales, and other settings.
 * This file contains all the main configuration arrays that can be easily
 * updated to add new versions or languages.
 */

// Supported locales configuration
// To add a new language:
// 1. Add the locale code here (e.g., 'fr', 'de', 'zh')
// 2. Create corresponding sidebar files in .vitepress/cake/{locale}/
// 3. Add locale configuration in localizedVersions object below
// 4. Add locale configuration in config.js locales section
export const supportedLocales = ['en', 'ja']

// Version configuration
export const versions = [
  {
    version: '5',
    label: '5.x',
    displayName: '5.x (Current)',
    path: '/5.x/',
    publicPath: '/5.x/',  // Current version uses clean URLs
    isCurrentVersion: true,
    sidebarFile: 'sidebar-5.json',
    phpVersion: '8.4',
    minPhpVersion: '8.1'
  },
  {
    version: '4',
    label: '4.x',
    displayName: '4.x',
    path: '/4.x/',
    publicPath: '/4.x/',
    isCurrentVersion: false,
    sidebarFile: 'sidebar-4.json',
    phpVersion: '8.2',
    minPhpVersion: '7.4'
  },
  {
    version: '3',
    label: '3.x',
    displayName: '3.x',
    path: '/3.x/',
    publicPath: '/3.x/',
    isCurrentVersion: false,
    sidebarFile: 'sidebar-3.json',
    phpVersion: '7.4',
    minPhpVersion: '5.6'
  },
  {
    version: '2',
    label: '2.x',
    displayName: '2.x',
    path: '/2.x/',
    publicPath: '/2.x/',
    isCurrentVersion: false,
    sidebarFile: 'sidebar-2.json',
    phpVersion: '5.3',
    minPhpVersion: '5.2.8'
  }
]

// Localized versions for Japanese
export const localizedVersions = {
  ja: [
    {
      version: '5',
      label: '5.x',
      displayName: '5.x (Current)',
      path: '/ja/5.x/',
      publicPath: '/ja/5.x/',
      isCurrentVersion: true,
      sidebarFile: 'ja/sidebar-5.json',
      phpVersion: '8.4',
      minPhpVersion: '8.1'
    },
    {
      version: '4',
      label: '4.x',
      displayName: '4.x',
      path: '/ja/4.x/',
      publicPath: '/ja/4.x/',
      isCurrentVersion: false,
      sidebarFile: 'ja/sidebar-4.json',
      phpVersion: '8.2',
      minPhpVersion: '7.4'
    },
    {
      version: '3',
      label: '3.x',
      displayName: '3.x',
      path: '/ja/3.x/',
      publicPath: '/ja/3.x/',
      isCurrentVersion: false,
      sidebarFile: 'ja/sidebar-3.json',
      phpVersion: '7.4',
      minPhpVersion: '5.6'
    },
    {
      version: '2',
      label: '2.x',
      displayName: '2.x',
      path: '/ja/2.x/',
      publicPath: '/ja/2.x/',
      isCurrentVersion: false,
      sidebarFile: 'ja/sidebar-2.json',
      phpVersion: '5.3',
      minPhpVersion: '5.2.8'
    }
  ]
}

// Sidebar configuration
export const sidebarConfig = {
  baseDir: 'cake',
  updateLinksForCurrentVersion: true
}
