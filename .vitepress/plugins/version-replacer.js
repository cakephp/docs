/**
 * Markdown-it plugin for replacing version placeholders
 * 
 * Replaces |phpversion| and |minphpversion| with actual PHP version requirements
 * based on the CakePHP version being rendered.
 */
import { getVersionByPath } from '../cake.js'

/**
 * Create a version replacer plugin
 * @param {Object} md - markdown-it instance
 * @param {Object} options - plugin options
 * @returns {void}
 */
export function versionReplacer(md, options = {}) {
  // Store original render method
  const originalRender = md.render.bind(md)
  
  md.render = function(src, env = {}) {
    const versionInfo = getVersionByPath('/' + env.relativePath || '')

    if (versionInfo) {
      src = src
        .replace(/\|phpversion\|/g, `**${versionInfo.phpVersion || '8.1'}**`)
        .replace(/\|minphpversion\|/g, `*${versionInfo.minPhpVersion || '8.1'}*`)
    }
    
    return originalRender(src, env)
  }
}

export default versionReplacer