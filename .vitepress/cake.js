/**
 * CakePHP Documentation Helper Functions
 *
 * Helper functions for managing CakePHP documentation versions,
 * navigation, and locale-specific operations.
 *
 * Configuration arrays (versions, supportedLocales, etc.) are now located
 * in ./cake/config.js for better organization and easier maintenance.
 */

// Import configuration from separate config file
import {
  supportedLocales,
  versions,
  localizedVersions,
  sidebarConfig
} from './cake/config.js'

// Re-export configuration for backward compatibility
export { supportedLocales, versions, localizedVersions, sidebarConfig }

// Helper functions for version management
export function getCurrentVersion(locale = 'en') {
  const versionList = getVersionsByLocale(locale)
  return versionList.find(v => v.isCurrentVersion)
}

export function getVersionsByLocale(locale = 'en') {
  // Return English versions by default
  if (locale === 'en') {
    return versions
  }

  // Check if we have localized versions for this locale
  if (localizedVersions[locale]) {
    return localizedVersions[locale]
  }

  // Fallback to English versions if locale not found
  return versions
}

export function getVersionByPath(path) {
  // Detect locale from path
  const locale = detectLocaleFromPath(path)

  // Get version list for detected locale
  const versionList = getVersionsByLocale(locale)

  // Check for version-specific paths in the detected locale
  for (const version of versionList) {
    if (path.startsWith(version.publicPath)) {
      return version
    }
  }

  // Default to current version for the detected locale
  return getCurrentVersion(locale)
}

export function getVersionLabel(path) {
  const version = getVersionByPath(path)
  return version ? version.label : versions[0].label
}

export function getAllVersionPaths(locale = 'en') {
  const versionList = getVersionsByLocale(locale)
  return versionList.map(v => v.publicPath)
}

// Navigation configuration for version dropdown
export function getVersionNavItems(locale = 'en') {
  const versionList = getVersionsByLocale(locale)
  return versionList.map(version => ({
    text: version.displayName,
    link: version.publicPath,
    path: version.publicPath,
    version: version.version
  }))
}


// Helper function to get supported locales
export function getSupportedLocales() {
  return supportedLocales
}

// Helper function to check if a locale is supported
export function isLocaleSupported(locale) {
  return supportedLocales.includes(locale)
}

// Helper function to detect locale from path
export function detectLocaleFromPath(path) {
  // Check each supported locale (excluding 'en' which is the default)
  for (const locale of supportedLocales) {
    if (locale !== 'en' && path.startsWith(`/${locale}/`)) {
      return locale
    }
  }
  // Default to 'en' if no locale prefix found
  return 'en'
}

// Export everything as default for convenience
export default {
  versions,
  getCurrentVersion,
  getVersionByPath,
  getVersionLabel,
  getAllVersionPaths,
  getVersionNavItems,
  supportedLocales,
  getSupportedLocales,
  isLocaleSupported,
  detectLocaleFromPath,
  sidebarConfig
}
