/**
* CakePHP Documentation Helper Functions
*
* Helper functions for managing CakePHP documentation versions,
* navigation, and locale-specific operations.
*/

// Import configuration from separate config file
import {
  supportedLocales,
  versions,
  localizedVersions,
  sidebarConfig
} from './cake/config.js'

// Helper functions for version management
export function getCurrentVersion(locale = 'en') {
  const versionList = getVersionsByLocale(locale)
  return versionList.find(v => v.isCurrentVersion)
}

export function getVersionsByLocale(locale = 'en') {
  if (locale === 'en') {
    return versions
  }

  if (localizedVersions[locale]) {
    return localizedVersions[locale]
  }

  return versions
}

export function getVersionByPath(path) {
  // Detect locale from path
  const locale = detectLocaleFromPath(path)

  const versionList = getVersionsByLocale(locale)

  for (const version of versionList) {
    if (path.startsWith(version.publicPath)) {
      return version
    }
  }

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

export function convertPathToVersion(currentPath, targetVersion, locale = 'en') {
  const currentLocale = detectLocaleFromPath(currentPath)
  const currentVersionObj = getVersionByPath(currentPath)

  if (currentVersionObj.version === targetVersion) {
    return currentPath
  }

  const versionList = getVersionsByLocale(currentLocale)
  const targetVersionObj = versionList.find(v => v.version === targetVersion)

  if (!targetVersionObj) {
    return locale === 'en' ? `/${targetVersion}.x/` : `/${locale}/${targetVersion}.x/`
  }

  let relativePath = currentPath
  if (relativePath.startsWith(currentVersionObj.publicPath)) {
    relativePath = relativePath.substring(currentVersionObj.publicPath.length)
  }

  if (!relativePath || relativePath === '' || relativePath === '/') {
    return targetVersionObj.publicPath
  }

  let targetPath = targetVersionObj.publicPath
  if (!targetPath.endsWith('/')) {
    targetPath += '/'
  }
  if (relativePath.startsWith('/')) {
    relativePath = relativePath.substring(1)
  }

  return targetPath + relativePath
}

export function getVersionNavItems(locale = 'en', currentPath = null) {
  const versionList = getVersionsByLocale(locale)
  return versionList.map(version => {
    const link = currentPath
      ? convertPathToVersion(currentPath, version.version, locale)
      : version.publicPath

    return {
      text: version.displayName,
      link: link,
      path: version.publicPath,
      version: version.version
    }
  })
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
