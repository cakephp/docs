#!/usr/bin/env node

/**
 * TOC Link Validator
 *
 * Validates that all links in toc_*.json files point to existing markdown files.
 *
 * Usage:
 *   node bin/check-toc-links.js
 */

const fs = require("fs");
const path = require("path");

/**
 * Recursively extract all links from TOC items
 */
function extractLinks(items, links = []) {
  for (const item of items) {
    if (item.link && !item.link.startsWith("http")) {
      links.push(item.link);
    }
    if (item.items) {
      extractLinks(item.items, links);
    }
  }
  return links;
}

/**
 * Check if a TOC link resolves to an existing file
 */
function checkLink(link, docsDir, lang) {
  // TOC links may include language prefix: "/ja/quickstart" or just "/quickstart"
  // Strip the language prefix if present
  let relativePath = link.startsWith("/") ? link.slice(1) : link;

  // Remove language prefix if link starts with it (e.g., "ja/quickstart" -> "quickstart")
  const langPrefix = lang + "/";
  if (relativePath.startsWith(langPrefix)) {
    relativePath = relativePath.slice(langPrefix.length);
  }

  const filePath = path.join(docsDir, relativePath + ".md");

  return fs.existsSync(filePath);
}

/**
 * Extract language code from TOC filename
 * e.g., "toc_en.json" -> "en"
 */
function getLangFromTocFile(tocFile) {
  const match = tocFile.match(/toc_(\w+)\.json$/);
  return match ? match[1] : null;
}

/**
 * Main validation function
 */
function validateTocFiles() {
  const tocFiles = fs.readdirSync(".vitepress").filter((f) => f.match(/^toc_.*\.json$/)).map((f) => `.vitepress/${f}`);

  if (tocFiles.length === 0) {
    console.error("No toc_*.json files found");
    process.exit(1);
  }

  let hasErrors = false;

  for (const tocFile of tocFiles) {
    const lang = getLangFromTocFile(tocFile);
    if (!lang) {
      console.error(`Could not extract language from ${tocFile}`);
      continue;
    }

    const docsDir = path.join("docs", lang);
    if (!fs.existsSync(docsDir)) {
      console.error(`Docs directory not found: ${docsDir}`);
      hasErrors = true;
      continue;
    }

    console.log(`Checking ${tocFile} against ${docsDir}/...`);

    const content = fs.readFileSync(tocFile, "utf8");
    const toc = JSON.parse(content);

    // TOC structure has keys like "/" with arrays of items
    const allLinks = [];
    for (const key of Object.keys(toc)) {
      extractLinks(toc[key], allLinks);
    }

    const missingFiles = [];
    for (const link of allLinks) {
      if (!checkLink(link, docsDir, lang)) {
        missingFiles.push(link);
      }
    }

    if (missingFiles.length > 0) {
      hasErrors = true;
      console.error(`\n✗ ${tocFile}: ${missingFiles.length} broken link(s)\n`);
      for (const link of missingFiles) {
        // Calculate expected path (strip lang prefix if present)
        let relativePath = link.startsWith("/") ? link.slice(1) : link;
        const langPrefix = lang + "/";
        if (relativePath.startsWith(langPrefix)) {
          relativePath = relativePath.slice(langPrefix.length);
        }
        const expectedPath = path.join(docsDir, relativePath + ".md");
        console.error(`  ${link}`);
        console.error(`    Expected: ${expectedPath}`);
      }
      console.error("");
    } else {
      console.log(`✓ ${tocFile}: ${allLinks.length} link(s) valid\n`);
    }
  }

  if (hasErrors) {
    console.error("TOC validation failed");
    process.exit(1);
  }

  console.log("✓ All TOC links are valid!");
}

validateTocFiles();
