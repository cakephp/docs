import { createRequire } from "module";
import container from "markdown-it-container";
const require = createRequire(import.meta.url);
const toc_en = require("./toc_en.json");
const toc_ja = require("./toc_ja.json");

const base = "/docs/";

// `::: pieceofcake2 [title]` marks content that is specific to Piece of Cake 2
// (not part of the original CakePHP 2.x documentation).
function pieceofcake2Container(md) {
  md.use(container, "pieceofcake2", {
    render(tokens, idx) {
      const token = tokens[idx];
      if (token.nesting === 1) {
        const title = token.info.trim().slice("pieceofcake2".length).trim();
        return `<div class="pieceofcake2 custom-block"><p class="custom-block-title">${md.utils.escapeHtml(title || "Piece of Cake 2")}</p>\n`;
      }
      return "</div>\n";
    },
  });
}

const links = {
  text: "Links",
  items: [
    { text: "pieceofcake2/cakephp", link: "https://github.com/pieceofcake2/cakephp" },
    { text: "Packagist", link: "https://packagist.org/packages/pieceofcake2/cakephp" },
    { text: "CakePHP 5.x (official)", link: "https://book.cakephp.org/5/en/" },
  ],
};

// This file contains overrides for .vitepress/config.js
export default {
  base,
  title: "Piece of Cake 2",
  description: "Documentation for Piece of Cake 2 - a community-maintained fork of CakePHP 2.x",
  rewrites: {
    "en/:slug*": ":slug*",
  },
  sitemap: {
    hostname: "https://pieceofcake2.github.io/docs/",
  },
  head: [
    ["link", { rel: "icon", type: "image/png", href: "/favicon/favicon-96x96.png", sizes: "96x96" }],
    ["link", { rel: "apple-touch-icon", sizes: "180x180", href: "/favicon/apple-touch-icon.png" }],
    ["meta", { name: "apple-mobile-web-app-title", content: "Piece of Cake 2" }],
  ],
  markdown: {
    config: pieceofcake2Container,
  },
  themeConfig: {
    logo: "/logo.png",
    socialLinks: [
      { icon: "github", link: "https://github.com/pieceofcake2/cakephp" },
    ],
    editLink: {
      pattern: "https://github.com/pieceofcake2/docs/edit/2.x/docs/:path",
      text: "Edit this page on GitHub",
    },
    footer: {
      message:
        'Based on the <a href="https://github.com/cakephp/docs/tree/2.x">CakePHP Cookbook</a>. Content licensed under <a href="https://creativecommons.org/licenses/by-nc-sa/4.0/">CC BY-NC-SA 4.0</a>. Not affiliated with the Cake Software Foundation.',
      copyright: "Original content © Cake Software Foundation, Inc. Modifications © Piece of Cake 2 contributors.",
    },
    sidebar: toc_en,
    nav: [
      { text: "Piece of Cake 2", link: "/pieceofcake2" },
      { text: "Getting Started", link: "/getting-started" },
      { text: "API", link: "https://api.cakephp.org/2.10/" },
      { text: "Documentation", link: "/" },
      { ...links },
    ],
    versionBanner: {
      message: "Community-maintained documentation for Piece of Cake 2 (CakePHP 2.x fork for PHP 8). For new projects, use CakePHP 5.x.",
      link: "https://book.cakephp.org/5/en/",
      linkText: "Go to the official CakePHP docs.",
    },
  },
  substitutions: {
    '|phpversion|': { value: '8.5', format: 'bold' },
    '|minphpversion|': { value: '8.0', format: 'italic' },
    '|cakeversion|': '2.x',
  },
  locales: {
    root: {
      label: "English",
      lang: "en",
    },
    ja: {
      label: "Japanese",
      lang: "ja",
      themeConfig: {
        nav: [
          { text: "Piece of Cake 2", link: "/ja/pieceofcake2" },
          { text: "はじめに", link: "/ja/getting-started" },
          { text: "API", link: "https://api.cakephp.org/2.10/" },
          { text: "ドキュメント", link: "/ja/" },
          { ...links },
        ],
        sidebar: toc_ja,
      },
    },
  },
};
