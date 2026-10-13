import { existsSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

// Deep merge function to handle nested objects
export function deepMerge(target, source) {
  if (!isObject(target) || !isObject(source)) {
    return source
  }

  const output = { ...target }

  Object.keys(source).forEach(key => {
    if (isObject(source[key]) && isObject(target[key])) {
      output[key] = deepMerge(target[key], source[key])
      return
    }

    output[key] = source[key]
  })

  return output
}

export function isObject(item) {
  return item && typeof item === 'object' && !Array.isArray(item)
}

/**
 * Load configuration overrides from config.js if it exists
 * @param {string} importMetaUrl - import.meta.url from the calling module
 * @returns {Promise<object>} The configuration overrides or an empty object
 */
export async function loadConfigOverrides(importMetaUrl) {
  const __dirname = dirname(fileURLToPath(importMetaUrl))
  const configPath = join(__dirname, '../config.js')

  if (existsSync(configPath)) {
    return (await import(configPath)).default
  }

  return {}
}

/**
 * Apply base path to head tags with relative href/src attributes
 * @param {object} config - The merged configuration object
 * @param {string} base - The base path (e.g., "/5.x/")
 */
export function applyBaseToHeadTags(config, base) {
  if (!config.head || !Array.isArray(config.head)) {
    return
  }

  // Ensure base path ends with / for proper concatenation
  const basePath = base.endsWith('/') ? base.slice(0, -1) : base

  config.head.forEach(tag => {
    if (!Array.isArray(tag) || tag.length < 2) {
      return
    }

    const [tagName, attributes] = tag

    // Only process link and meta tags
    if (tagName !== 'link' && tagName !== 'meta') {
      return
    }

    // Transform href for link tags
    if (attributes.href && attributes.href.startsWith('/') && !attributes.href.startsWith('//')) {
      attributes.href = basePath + attributes.href
    }

    // Transform content for meta tags (e.g., og:image)
    if (attributes.content && attributes.content.startsWith('/') && !attributes.content.startsWith('//')) {
      attributes.content = basePath + attributes.content
    }
  })
}
