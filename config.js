import { createRequire } from "module";
const require = createRequire(import.meta.url);
const toc_en = require("./toc_en.json");
const toc_ja = require("./toc_ja.json");

// This file contains overrides for .vitepress/config.js of
// pieceofcake2/docs-skeleton. The header navigation (bookNav) is defined in
// the skeleton, so the plugin documentation sites share it.
export default ({ bookNav }) => ({
  base: '/docs/',
  title: "CakePHP 2",
  rewrites: {
    "en/:slug*": ":slug*",
  },
  sitemap: {
    hostname: "https://pieceofcake2.github.io/docs/",
  },
  themeConfig: {
    socialLinks: [
      { icon: "github", link: "https://github.com/pieceofcake2/cakephp" },
    ],
    editLink: {
      pattern: "https://github.com/pieceofcake2/docs/edit/2.x/docs/:path",
      text: "Edit this page on GitHub",
    },
    sidebar: toc_en,
    nav: bookNav(),
    versionBanner: {
      message: 'This is the documentation for pieceofcake2/cakephp, a community-maintained fork of CakePHP 2.x for PHP 8.',
      link: '/docs/pieceofcake2',
      linkText: 'About this fork.'
    }
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
        nav: bookNav({ locale: "ja" }),
        sidebar: toc_ja,
        versionBanner: {
          message: 'このドキュメントは、CakePHP 2.x の PHP 8 対応フォーク pieceofcake2/cakephp のものです。',
          link: '/docs/ja/pieceofcake2',
          linkText: 'フォークについて'
        },
      },
    },
  },
});
