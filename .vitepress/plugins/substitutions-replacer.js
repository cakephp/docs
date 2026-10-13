/**
* Markdown-it plugin for replacing text placeholders
*
* Replaces custom placeholders like |phpversion| with configured values.
* Supports optional formatting (bold, italic, code, or none).
*/

/**
* Format a value based on the specified format type
* @param {string} value - The value to format
* @param {string} format - Format type: 'bold', 'italic', 'code', or 'none'
* @returns {string} Formatted value
*/
function formatValue(value, format = 'none') {
  switch (format) {
    case 'bold':
      return `**${value}**`
    case 'italic':
      return `*${value}*`
    case 'code':
      return `\`${value}\``
    default:
      return value
  }
}

/**
* Create a text substitution plugin
* @param {Object} md - markdown-it instance
* @param {Object} options - plugin options
* @param {Object} options.substitutions - Object with placeholder keys and values
* @param {string} options.phpversion - Legacy: Current PHP version (deprecated, use substitutions)
* @param {string} options.minphpversion - Legacy: Minimum PHP version (deprecated, use substitutions)
* @returns {void}
*/
export function substitutionsReplacer(md, options = {}) {
  let substitutions = {}

  // Support new substitutions format
  if (options.substitutions) {
    substitutions = options.substitutions
  }
  // Backward compatibility: convert old phpVersions format
  else if (options.phpversion || options.minphpversion) {
    substitutions = {
      '|phpversion|': { value: options.phpversion || '8.4', format: 'bold' },
      '|minphpversion|': { value: options.minphpversion || '8.1', format: 'italic' }
    }
  }

  // Store original render method
  const originalRender = md.render.bind(md)

  md.render = function(src, env = {}) {
    // Process each substitution
    for (const [placeholder, config] of Object.entries(substitutions)) {
      // Support both simple string values and objects with format options
      const value = typeof config === 'string' ? config : config.value
      const format = typeof config === 'object' && config.format ? config.format : 'none'

      // Create regex to match the placeholder (escape special regex characters)
      const escapedPlaceholder = placeholder.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
      const regex = new RegExp(escapedPlaceholder, 'g')

      // Replace with formatted value
      src = src.replace(regex, formatValue(value, format))
    }

    return originalRender(src, env)
  }
}

export default substitutionsReplacer
