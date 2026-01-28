#!/usr/bin/env node

/**
 * Internal Markdown Link Checker
 *
 * Validates internal markdown links in documentation files.
 * Only checks relative links - ignores external URLs.
 *
 * Usage:
 *   node bin/check-links.js <file-or-pattern>...
 *   node bin/check-links.js --baseline <path> "docs/subfolder/*.md"
 *   node bin/check-links.js --generate-baseline "docs/subfolder/*.md"
 */

const fs = require('fs');
const path = require('path');

const BASELINE_FILE = '.github/linkchecker-baseline.json';

/**
 * Simple glob implementation using Node.js built-ins
 */
function globSync(pattern, options = {}) {
  const results = [];

  // Handle simple patterns like "docs/en/**/*.md"
  if (pattern.includes('**')) {
    const [basePath, ...rest] = pattern.split('**');
    const suffix = rest.join('**').replace(/^\//, ''); // Remove leading slash
    const baseDir = basePath.replace(/\/$/, '') || '.';

    function traverse(dir) {
      try {
        const entries = fs.readdirSync(dir, { withFileTypes: true });

        for (const entry of entries) {
          const fullPath = path.join(dir, entry.name);

          if (entry.isDirectory()) {
            traverse(fullPath);
          } else if (entry.isFile() && matchPattern(entry.name, suffix)) {
            results.push(options.absolute ? path.resolve(fullPath) : fullPath);
          }
        }
      } catch (err) {
        // Ignore permission errors
      }
    }

    traverse(baseDir);
  } else {
    // Simple wildcard pattern like "docs/en/*.md"
    const dir = path.dirname(pattern);
    const filePattern = path.basename(pattern);

    if (fs.existsSync(dir)) {
      const entries = fs.readdirSync(dir);
      for (const entry of entries) {
        const fullPath = path.join(dir, entry);
        if (fs.statSync(fullPath).isFile() && matchPattern(entry, filePattern)) {
          results.push(options.absolute ? path.resolve(fullPath) : fullPath);
        }
      }
    }
  }

  return results;
}

function matchPattern(filename, pattern) {
  const regex = pattern
    .replace(/\./g, '\\.')
    .replace(/\*/g, '.*')
    .replace(/\?/g, '.');
  return new RegExp(`^${regex}$`).test(filename) ||
         new RegExp(regex).test(filename);
}

class LinkChecker {
  constructor(options = {}) {
    this.errors = [];
    this.checked = new Set();
    this.headingCache = new Map();
    this.generateBaseline = options.generateBaseline || false;
    this.baselinePath = options.baselinePath || null;
    this.baseline = this.baselinePath ? this.loadBaseline() : [];
  }

  /**
   * Load baseline configuration
   */
  loadBaseline() {
    if (!fs.existsSync(this.baselinePath)) {
      console.warn(`Warning: Baseline file not found: ${this.baselinePath}`);
      return [];
    }

    try {
      const content = fs.readFileSync(this.baselinePath, 'utf8');
      return JSON.parse(content);
    } catch (err) {
      console.warn(`Warning: Could not load baseline file: ${err.message}`);
      return [];
    }
  }

  /**
   * Save baseline configuration
   */
  saveBaseline() {
    const baselineData = this.errors.map(error => ({
      file: error.file,
      link: error.link,
      message: error.message
    }));

    const outputPath = this.baselinePath || BASELINE_FILE;
    const dir = path.dirname(outputPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(
      outputPath,
      JSON.stringify(baselineData, null, 2) + '\n',
      'utf8'
    );
  }

  /**
   * Check if an error matches baseline
   */
  isInBaseline(error) {
    return this.baseline.some(baselineError =>
      baselineError.file === error.file &&
      baselineError.link === error.link
    );
  }

  /**
   * Main entry point - check files matching patterns
   */
  async checkFiles(patterns) {
    const files = await this.resolveFiles(patterns);

    if (files.length === 0) {
      console.error('No files found matching patterns');
      return false;
    }

    console.log(`Checking ${files.length} file(s)...\n`);

    for (const file of files) {
      this.checkFile(file);
    }

    return this.reportResults();
  }

  /**
   * Resolve glob patterns to actual file paths
   */
  async resolveFiles(patterns) {
    const fileSet = new Set();

    for (const pattern of patterns) {
      // Check if it's a direct file path
      if (fs.existsSync(pattern) && fs.statSync(pattern).isFile()) {
        fileSet.add(path.resolve(pattern));
      } else {
        // Treat as glob pattern
        const matches = globSync(pattern, {
          absolute: true
        });
        matches.forEach(f => fileSet.add(f));
      }
    }

    return Array.from(fileSet).sort();
  }

  /**
   * Check all links in a single file
   */
  checkFile(filePath) {
    if (this.checked.has(filePath)) {
      return;
    }
    this.checked.add(filePath);

    const content = fs.readFileSync(filePath, 'utf8');
    const links = this.extractLinks(content);
    const sourceDir = path.dirname(filePath);

    for (const link of links) {
      if (this.isExternalLink(link.url)) {
        continue;
      }

      const { targetPath, anchor } = this.parseLink(link.url, sourceDir);

      // Check file exists
      if (!fs.existsSync(targetPath)) {
        this.addError(filePath, link, `File not found: ${path.relative(process.cwd(), targetPath)}`);
        continue;
      }

      // Check anchor if present
      if (anchor) {
        const headings = this.getHeadings(targetPath);
        const anchorId = this.slugify(anchor);

        if (!headings.includes(anchorId)) {
          this.addError(
            filePath,
            link,
            `Anchor '#${anchor}' not found in ${path.relative(process.cwd(), targetPath)}`
          );
        }
      }
    }
  }

  /**
   * Extract all markdown links from content
   */
  extractLinks(content) {
    const links = [];

    // Remove code blocks first (fenced with ```), then inline code (single backticks)
    let contentWithoutCodeBlocks = content.replace(/```[\s\S]*?```/g, '');
    // For inline code, only match within a single line (no newlines)
    contentWithoutCodeBlocks = contentWithoutCodeBlocks.replace(/`[^`\n]+`/g, '');

    // Match [text](url) or [text](url "title")
    const linkRegex = /\[([^\]]+)\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g;
    let match;

    while ((match = linkRegex.exec(contentWithoutCodeBlocks)) !== null) {
      links.push({
        text: match[1],
        url: match[2],
        raw: match[0]
      });
    }

    return links;
  }

  /**
   * Check if a URL is external
   */
  isExternalLink(url) {
    // Skip HTTP(S), mailto, IRC, anchor-only, protocol-relative, and absolute paths (VitePress public dir)
    return /^(https?:\/\/|mailto:|irc:\/\/|#|\/\/|\/[^.])/i.test(url);
  }

  /**
   * Parse link URL into target path and anchor
   */
  parseLink(url, sourceDir) {
    const [pathPart, anchor] = url.split('#');

    // Handle anchor-only links (same file)
    if (!pathPart) {
      return {
        targetPath: path.join(sourceDir, path.basename(sourceDir) + '.md'),
        anchor
      };
    }

    let targetPath = path.resolve(sourceDir, pathPart);

    // VitePress automatically adds .md extension if not present
    // Match this behavior by always trying .md first for extensionless links
    if (!path.extname(targetPath)) {
      const mdPath = targetPath + '.md';
      if (fs.existsSync(mdPath)) {
        targetPath = mdPath;
      } else if (fs.existsSync(targetPath) && fs.statSync(targetPath).isDirectory()) {
        // If it's a directory, look for index.md
        targetPath = path.join(targetPath, 'index.md');
      } else {
        // Default to .md extension (VitePress behavior)
        targetPath = mdPath;
      }
    } else if (fs.existsSync(targetPath) && fs.statSync(targetPath).isDirectory()) {
      // If path is directory, look for index.md
      targetPath = path.join(targetPath, 'index.md');
    }

    return { targetPath, anchor };
  }

  /**
   * Extract headings from a markdown file
   */
  getHeadings(filePath) {
    if (this.headingCache.has(filePath)) {
      return this.headingCache.get(filePath);
    }

    const content = fs.readFileSync(filePath, 'utf8');
    const headings = [];

    // Match ATX headings: # Heading
    const headingRegex = /^#{1,6}\s+(.+)$/gm;
    let match;

    while ((match = headingRegex.exec(content)) !== null) {
      const heading = match[1]
        .replace(/\{#([^}]+)\}$/g, '') // Remove {#custom-id} but keep the ID
        .replace(/\[[^\]]+\]\([^)]+\)/g, '') // Remove links
        .replace(/`([^`]+)`/g, '$1') // Remove code formatting
        .trim();

      // Check if there's a custom ID in the original match
      const customIdMatch = match[1].match(/\{#([^}]+)\}$/);
      if (customIdMatch) {
        headings.push(customIdMatch[1]); // Add the custom ID
      }

      headings.push(this.slugify(heading));
    }

    // Also extract HTML anchor IDs: <a id="anchor-name"></a>
    const htmlAnchorRegex = /<a\s+id=["']([^"']+)["']/gi;
    while ((match = htmlAnchorRegex.exec(content)) !== null) {
      headings.push(match[1]);
    }

    this.headingCache.set(filePath, headings);
    return headings;
  }

  /**
   * Convert heading text to anchor ID (VitePress style)
   */
  slugify(text) {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '') // Remove special chars
      .replace(/\s+/g, '-') // Spaces to hyphens
      .replace(/-+/g, '-') // Multiple hyphens to single
      .replace(/^-|-$/g, ''); // Trim hyphens
  }

  /**
   * Add an error to the collection
   */
  addError(filePath, link, message) {
    this.errors.push({
      file: path.relative(process.cwd(), filePath),
      link: link.url,
      text: link.text,
      message
    });
  }

  /**
   * Report results and return success status
   */
  reportResults() {
    if (this.generateBaseline) {
      this.saveBaseline();
      const outputPath = this.baselinePath || BASELINE_FILE;
      console.log(`✓ Baseline generated with ${this.errors.length} known issue(s)`);
      console.log(`  Saved to: ${outputPath}\n`);
      return true;
    }

    // Filter out baseline errors
    const newErrors = this.errors.filter(error => !this.isInBaseline(error));

    if (newErrors.length === 0 && this.errors.length === 0) {
      console.log('✓ All internal links are valid!\n');
      return true;
    }

    if (newErrors.length === 0 && this.errors.length > 0) {
      console.log(`✓ No new broken links (${this.errors.length} known issue(s) in baseline)\n`);
      return true;
    }

    console.error(`✗ Found ${newErrors.length} new broken link(s):\n`);

    for (const error of newErrors) {
      console.error(`  ${error.file}`);
      console.error(`    Link: [${error.text}](${error.link})`);
      console.error(`    Error: ${error.message}`);
      console.error('');
    }

    if (this.errors.length > newErrors.length) {
      const baselineCount = this.errors.length - newErrors.length;
      console.error(`  (${baselineCount} known issue(s) ignored from baseline)\n`);
    }

    return false;
  }
}

// Main execution
async function main() {
  const args = process.argv.slice(2);

  // Parse arguments
  let generateBaseline = false;
  let baselinePath = null;
  const patterns = [];

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--generate-baseline') {
      generateBaseline = true;
    } else if (args[i] === '--baseline') {
      if (i + 1 < args.length) {
        baselinePath = args[++i];
      } else {
        console.error('Error: --baseline requires a path argument');
        process.exit(1);
      }
    } else {
      patterns.push(args[i]);
    }
  }

  if (patterns.length === 0) {
    console.error('Usage: node bin/check-links.js [--baseline <path>] [--generate-baseline] <file-or-pattern>...');
    console.error('');
    console.error('Examples:');
    console.error('  node bin/check-links.js docs/en/installation.md');
    console.error('  node bin/check-links.js "docs/**/*.md"');
    console.error('  node bin/check-links.js docs/en/*.md docs/ja/*.md');
    console.error('');
    console.error('With baseline:');
    console.error('  node bin/check-links.js --baseline .github/linkchecker-baseline.json "docs/**/*.md"');
    console.error('');
    console.error('Generate baseline:');
    console.error('  node bin/check-links.js --generate-baseline "docs/**/*.md"');
    console.error('  node bin/check-links.js --generate-baseline --baseline custom-baseline.json "docs/**/*.md"');
    process.exit(1);
  }

  const checker = new LinkChecker({ generateBaseline, baselinePath });
  const success = await checker.checkFiles(patterns);

  process.exit(success ? 0 : 1);
}

// Run if executed directly
if (require.main === module) {
  main().catch(error => {
    console.error('Error:', error.message);
    process.exit(1);
  });
}

module.exports = LinkChecker;
