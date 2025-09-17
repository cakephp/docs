/**
 * CakePHP Documentation Configuration
 * 
 * Centralized configuration for CakePHP documentation versions,
 * navigation, and other CakePHP-specific settings.
 */

// Version configuration
export const versions = [
  {
    version: '5',
    label: '5.x',
    displayName: '5.x (Current)',
    path: '/5/en/',
    publicPath: '/5/en/',  // Current version uses clean URLs
    isCurrentVersion: true,
    sidebarFile: 'sidebar-5.json',
    phpVersion: '8.4',
    minPhpVersion: '8.1'
  },
  {
    version: '4',
    label: '4.x', 
    displayName: '4.x',
    path: '/4/en/',
    publicPath: '/4/en/',
    isCurrentVersion: false,
    sidebarFile: 'sidebar-4.json',
    phpVersion: '8.2',
    minPhpVersion: '7.4'
  },
  {
    version: '3',
    label: '3.x',
    displayName: '3.x', 
    path: '/3/en/',
    publicPath: '/3/en/',
    isCurrentVersion: false,
    sidebarFile: 'sidebar-3.json',
    phpVersion: '7.4',
    minPhpVersion: '5.6'
  },
  {
    version: '2',
    label: '2.x',
    displayName: '2.x',
    path: '/2/en/', 
    publicPath: '/2/en/',
    isCurrentVersion: false,
    sidebarFile: 'sidebar-2.json',
    phpVersion: '5.3',
    minPhpVersion: '5.2.8'
  }
]

// Helper functions for version management
export function getCurrentVersion() {
  return versions.find(v => v.isCurrentVersion)
}

export function getVersionByPath(path) {
  // Check for version-specific paths first
  for (const version of versions) {
    if (path.startsWith(version.publicPath)) {
      return version
    }
  }
  // Default to current version for /en/ paths
  return getCurrentVersion()
}

export function getVersionLabel(path) {
  const version = getVersionByPath(path)
  return version ? version.label : versions[0].label
}

export function getAllVersionPaths() {
  return versions.map(v => v.publicPath)
}

// Navigation configuration for version dropdown
export function getVersionNavItems() {
  return versions.map(version => ({
    text: version.displayName,
    link: version.publicPath,
    path: version.publicPath,
    version: version.version
  }))
}

// Sidebar configuration
export const sidebarConfig = {
  baseDir: 'cake',
  updateLinksForCurrentVersion: true
}

// Site configuration
export const siteConfig = {
  title: 'CakePHP',
  description: 'CakePHP Documentation - The rapid development PHP framework',
  currentVersionEditPattern: 'https://github.com/cakephp/docs/edit/5.x/en/:path'
}

// Export everything as default for convenience
export default {
  versions,
  getCurrentVersion,
  getVersionByPath, 
  getVersionLabel,
  getAllVersionPaths,
  getVersionNavItems,
  sidebarConfig,
  siteConfig
}