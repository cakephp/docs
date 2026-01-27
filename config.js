import { createRequire } from "module";
const require = createRequire(import.meta.url);
const toc_en = require("./toc_en.json");
const toc_ja = require("./toc_ja.json");

const versions = {
  text: "2.x",
  items: [
    { text: "5.x (latest)", link: "https://book.cakephp.org/5.x/", target: '_self' },
    { text: "4.x", link: "https://book.cakephp.org/4.x/", target: '_self' },
    { text: "3.x", link: "https://book.cakephp.org/3.x/", target: '_self' },
    { text: "2.x", link: "https://book.cakephp.org/2.x/", target: '_self' },
    { text: "Next releases", items: [
      { text: "5.next", link: "https://book.cakephp.org/5.next/", target: '_self' },
      { text: "6.x", link: "https://book.cakephp.org/6.x/", target: '_self' },
    ]},
  ],
};

// This file contains overrides for .vitepress/config.js
export default {
  base: '/2.x/',
  rewrites: {
    "en/:slug*": ":slug*",
  },
  sitemap: {
    hostname: "https://book.cakephp.org/2.x/",
  },
  themeConfig: {
    socialLinks: [
      { icon: "github", link: "https://github.com/cakephp/cakephp" },
    ],
    editLink: {
      pattern: "https://github.com/cakephp/docs/edit/2.x/docs/:path",
      text: "Edit this page on GitHub",
    },
    sidebar: toc_en,
    nav: [
      { text: "Getting Started", link: "/getting-started" },
      { text: "API", link: "https://api.cakephp.org/" },
      { text: "Documentation", link: "/" },
      { ...versions },
    ],
  },
  phpVersions: {
    phpversion: '5.x',
    minphpversion: '5.x'
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
          { text: "ガイド", link: "/ja/intro" },
          { text: "API", link: "https://api.cakephp.org/" },
          { text: "ドキュメント", link: "/ja/" },
          { ...versions },
        ],
        sidebar: toc_ja,
      },
    },
  },
};
