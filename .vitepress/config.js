import baseConfig, { substitutionsReplacer } from '@cakephp/docs-skeleton/config'

import { createRequire } from "module";
const require = createRequire(import.meta.url);
const toc_en = require("./toc_en.json");
const toc_ja = require("./toc_ja.json");

const versions = {
  text: "6.x",
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

const plugins = {
  text: "Plugins",
  items: [
    {
      text: "Core Plugins",
      items: [
        { text: "Authentication", link: "https://book.cakephp.org/authentication/", target: "_self" },
        { text: "Authorization", link: "https://book.cakephp.org/authorization/", target: "_self" },
        { text: "Bake", link: "https://book.cakephp.org/bake/", target: "_self" },
        { text: "Chronos", link: "https://book.cakephp.org/chronos/", target: "_self" },
        { text: "Debug Kit", link: "https://book.cakephp.org/debugkit/", target: "_self" },
        { text: "Elasticsearch", link: "https://book.cakephp.org/elasticsearch/", target: "_self" },
        { text: "Migrations", link: "https://book.cakephp.org/migrations/", target: "_self" },
        { text: "Phinx", link: "https://book.cakephp.org/phinx/", target: "_self" },
        { text: "Queue", link: "https://book.cakephp.org/queue/", target: "_self" },
      ],
    },
    {
      text: "Community",
      items: [
        { text: "Community Plugins", link: "https://plugins.cakephp.org/", target: "_self" },
      ],
    },
  ],
};

const substitutions = {
  '|phpversion|': { value: '8.5', format: 'bold' },
  '|minphpversion|': { value: '8.4', format: 'italic' },
  '|cakeversion|': '6.0.0',
  '|cakefullversion|': 'CakePHP 6 (dev)',
};

// This file contains overrides for .vitepress/config.js
export default {
  extends: baseConfig,
  markdown: {
    config(md) {
      md.use(substitutionsReplacer, { substitutions });
    }
  },
  base: "/6.x/",
  rewrites: {
    "en/:slug*": ":slug*",
  },
  sitemap: {
    hostname: "https://book.cakephp.org/6.x/",
  },
  themeConfig: {
    socialLinks: [
      { icon: "github", link: "https://github.com/cakephp/cakephp" },
    ],
    editLink: {
      pattern: "https://github.com/cakephp/docs/edit/6.x/docs/:path",
      text: "Edit this page on GitHub",
    },
    sidebar: toc_en,
    nav: [
      { text: "Guide", link: "/intro" },
      { text: "API", link: "https://api.cakephp.org/" },
      { ...plugins },
      { ...versions },
    ],
    versionBanner: {
      message: 'This is a development version of documentation for CakePHP 6.0.',
      link: '/latest/',
      linkText: 'Go to latest docs.'
    }
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
          { ...plugins },
          { ...versions },
        ],
        sidebar: toc_ja,
      },
    },
  },
};
