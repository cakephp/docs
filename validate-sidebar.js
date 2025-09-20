#!/usr/bin/env node
/**
 * A script that validates all internal links in CakePHP documentation sidebar configuration files.
 * It recursively extracts links from JSON sidebar files, checks if corresponding markdown files exist,
 * and reports any broken links. provides a summary of validation results.
 */

import fs from 'fs';
import path from 'path';

const DOCS_ROOT = './docs';
const SIDEBAR_DIRS = {
  'EN': './.vitepress/cake',
  'JA': './.vitepress/cake/ja'
};

const SIDEBAR_FILES = fs.readdirSync('./.vitepress/cake')
  .filter(file => file.startsWith('sidebar-') && file.endsWith('.json'));

let totalLinks = 0;
let invalidLinks = 0;

function extractLinks(obj) {
  const links = [];

  if (obj?.link && typeof obj.link === 'string') {
    links.push(obj.link);
  }

  for (const value of Object.values(obj || {})) {
    if (Array.isArray(value)) {
      value.forEach(item => links.push(...extractLinks(item)));
    } else if (typeof value === 'object') {
      links.push(...extractLinks(value));
    }
  }

  return links;
}

function validateLinks(links, prefix) {
  console.log(`\n${prefix}: Found ${links.length} links`);

  for (const link of links) {
    totalLinks++;

    // Skip external links and anchors
    if (link.startsWith('http') || link.includes('#')) continue;

    const filePath = path.join(DOCS_ROOT, link.replace(/^\//, '') + '.md');

    if (!fs.existsSync(filePath)) {
      invalidLinks++;
      console.log(`  ✗ ${link} → ${filePath}`);
    }
  }
}

function main() {
  console.log('CakePHP Documentation Sidebar Link Validator\n');

  for (const [lang, dir] of Object.entries(SIDEBAR_DIRS)) {
    for (const sidebar of SIDEBAR_FILES) {
      const sidebarPath = path.join(dir, sidebar);

      if (!fs.existsSync(sidebarPath)) continue;

      try {
        const config = JSON.parse(fs.readFileSync(sidebarPath, 'utf8'));
        const links = extractLinks(config);
        validateLinks(links, `${lang} ${sidebar}`);
      } catch (error) {
        console.log(`Error reading ${sidebar}: ${error.message}`);
      }
    }
  }

  console.log(`\nSummary: ${totalLinks} total links, ${invalidLinks} invalid`);
  console.log(invalidLinks === 0 ? '🎉 All links valid!' : `❌ ${invalidLinks} links need fixing`);

  process.exit(invalidLinks > 0 ? 1 : 0);
}

main();
