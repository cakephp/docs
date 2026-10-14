# CakePHP 2 Documentation (Piece of Cake 2 fork)

Documentation for [pieceofcake2/cakephp](https://github.com/pieceofcake2/cakephp),
a community-maintained fork of CakePHP 2.x for PHP 8, maintained by the
[Piece of Cake 2](https://github.com/pieceofcake2) project.

Published at https://pieceofcake2.github.io/docs/

This repository is a fork of the `2.x` branch of
[cakephp/docs](https://github.com/cakephp/docs/tree/2.x) (the CakePHP Cookbook).
The book describes CakePHP 2 as it works on the fork today (Composer, PHP 8,
the modern directory layout). Differences from the original book are listed on
[Changes from the Original Book](https://pieceofcake2.github.io/docs/pieceofcake2/changes).

The theme lives in [pieceofcake2/docs-skeleton](https://github.com/pieceofcake2/docs-skeleton)
(a fork of cakephp/docs-skeleton) and is cloned at build time.

## Contributing

The general contribution guide of the organization is
[CONTRIBUTING.md](https://github.com/pieceofcake2/.github/blob/master/CONTRIBUTING.md).
This README covers how to edit this documentation site.

Fork the repository, make your changes on a branch and open a pull request
against `2.x`. You can also edit a page online with GitHub: the "Edit this page
on GitHub" link at the bottom of every page opens GitHub's editor for that
page.

## Local Development

```bash
./bin/dev-server.sh
```

This clones the skeleton into `.temp`, syncs `docs/`, `config.js` and the TOC
files, and starts the VitePress dev server at http://localhost:5173.
Requires `git`, `node`, `npm` and `rsync`.

Pushes to the `2.x` branch are deployed to GitHub Pages by
`.github/workflows/deploy.yml`.

## Repository Layout

- `docs/en/` contains the English pages, and `docs/ja/` the Japanese pages. The
  structure of both folders is the same: a page at `docs/en/foo/bar.md` has its
  translation at `docs/ja/foo/bar.md`.
- `toc_en.json` and `toc_ja.json` define the sidebar of each language. When you
  add a page, add it to both files.
- `config.js` contains the site configuration, such as the navigation bar and
  the version banner.

English pages are served from the root of the site (`/installation`), and
Japanese pages from `/ja/` (`/ja/installation`).

## Editing Guidelines

- Write the pages so that they describe the current state. Do not add separate
  "fork-specific" pages or disclaimers; edit the original page instead.
- Use the modern directory layout (`src/`, `templates/`, `config/`, `bin/cake`)
  in text and examples. Mention the legacy `app/` layout only where it helps.
- PHP code samples follow the [coding standard](https://pieceofcake2.github.io/docs/contributing/cakephp-coding-conventions)
  (CakePHP 5 codesniffer). Samples that deliberately show legacy code, such as
  the "before" side of a migration guide, are the exception.
- When the fork behaves differently from the original CakePHP 2.10.24 in a way
  that a migrating user must know, add a short change note (see
  [Change Notes for the Fork](#change-notes-for-the-fork)).
- Update both `docs/en` and `docs/ja`, and add the change to
  `docs/*/pieceofcake2/changes.md`.

## Translations

The documentation is maintained in English and Japanese. The English version
is authoritative. When you change an English page, update the Japanese page
too if you can, or mention in your pull request that the translation still
needs to be updated.

- Translate both the content and the title at the same time, and do not submit
  partial translations.
- Compare with the English page before submitting a correction, and include
  any English change that is not translated yet.
- Keep the structure of the page, the code samples and the anchors the same as
  in the English page, so that links between pages keep working in both
  languages.
- Use the same terms as the existing pages of the language. Japanese pages use
  the です・ます style.
- Do not use HTML entities for accented characters; the pages are UTF-8.
- If the original content is missing some information, submit an edit for the
  English page first.

## Formatting Guide

The pages are plain Markdown with a few VitePress extensions. Look at the
existing pages for examples.

### Line Length

Wrap lines of text at about 80 columns. Long URLs, tables and code snippets are
exceptions.

### Headings

Each page starts with a single `#` heading, the page title. Use `##` for
sections, `###` for subsections and `####` for sub-subsections, and put a blank
line before and after each heading.

VitePress generates an anchor for every heading from its text, for example
`## Running Tests` gets the anchor `#running-tests`. Japanese headings do not
produce the same anchor, so when a Japanese page needs the same anchor as the
English page, add it explicitly before the heading:

```md
<a id="running-tests"></a>

## テストの実行
```

### Inline Markup

- `*text*` for emphasis (italics), `**text**` for strong emphasis (bold; use it
  sparingly).
- Backquotes for code: method and function names (include `()`), class names,
  option names, table columns, file names and paths, for example
  `PagesController`, `find()`, `config/core.php`.

### Lists

Unordered list items start with `-` and a space; numbered lists use `1.`,
`2.`, and so on. Indent nested lists and continuation lines by two spaces
(three for numbered lists).

### Links

Links to other pages of the documentation omit the `.md` extension. Use a path
relative to the current page, or an absolute path from the root of the
language: absolute paths start with `/` in English pages and with `/ja/` in
Japanese pages. Add the anchor of a heading to link to a section:

```md
[Controllers](../controllers)
[Testing](/development/testing#running-tests)
[テスト](/ja/development/testing)
```

### Describing Classes and Their Contents

There are no special directives for classes and methods. Describe a class and
its methods with a line in this form, followed by the description, and refer
to them in running text with backquotes, for example `Cache::read()`:

```md
`class` **Cache**

`static` Cache::**read**($key, $config = 'default')
```

### Source Code

Code samples are fenced code blocks with a language name: `php` for PHP code,
`bash` for shell commands, and `text` for output or anything that should not
be highlighted. Start a PHP sample with a comment that gives its file name when
it helps the reader, using the modern application layout, for example
`// src/Controller/PostsController.php`. You can group alternatives, such as
the same command for different tools, with a `::: code-group` container.

PHP samples follow the coding standard. To check a sample, save it to a file
(add `<?php` and wrap fragments in a class or method if needed) and run
`vendor/bin/phpcs --standard=CakePHP` on it from a project that has
`cakephp/cakephp-codesniffer` ^5 installed. Do not save it under a `tmp`
directory: the CakePHP ruleset skips paths containing `/tmp/`. Ignore the
sniffs that cannot apply to a fragment, such as a missing file comment or
namespace.

### Alerts and Containers

Use GitHub-style alerts for tips, notes and warnings, written in complete
sentences:

```md
> [!TIP]
> A helpful tid-bit you probably forgot.

> [!NOTE]
> An especially important piece of information.

> [!WARNING]
> A potential stumbling block, or information about security.
```

To mark when a feature was added, changed or deprecated in CakePHP 2, use an
`info` container with a title. The `tip`, `warning` and `danger` containers
take a custom title in the same way:

```md
::: info Added in version 2.6.3
This awesome feature was added on version 2.6.3
:::
```

### Change Notes for the Fork

When the fork behaves differently from the original CakePHP 2.10.24 in a way
that a reader migrating an application must know, for example a removed
feature, a changed default or a changed method signature, add a short note in
a `pieceofcake2` container next to the text it applies to:

```md
::: pieceofcake2
The Xcache and Wincache engines were removed.
:::
```

The default title is "Piece of Cake 2 fork"; give another one after the
container name, as in `::: pieceofcake2 Cache engines`. Keep these notes to one
to three sentences. Everything else, including the current paths and commands,
belongs in the normal text of the page.

### Including Other Files

A page can include part of another Markdown file with VitePress's `@include`
directive, written as an HTML comment; see `docs/en/core-libraries.md` for
examples. A line range in braces after the file name, such as `{28,97}`,
includes only those lines. If you edit a file that is included elsewhere,
search the repository for `@include` and check that the line ranges in the
including files still select the same section.

## License

See [LICENSE](LICENSE).

- Documentation content: [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/),
  © Cake Software Foundation, Inc., with modifications © 2025-present Piece of Cake 2.
- Theme: MIT, [pieceofcake2/docs-skeleton](https://github.com/pieceofcake2/docs-skeleton)
  (fork of [cakephp/docs-skeleton](https://github.com/cakephp/docs-skeleton)).

This project is not affiliated with or endorsed by the Cake Software Foundation.
CakePHP is a trademark of the Cake Software Foundation.
