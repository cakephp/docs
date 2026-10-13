# Documentation

Contributing to the documentation is simple. The files are hosted on
<https://github.com/pieceofcake2/docs>, in the `2.x` branch. Feel free to fork
the repo, add your changes/improvements/translations and give back by opening a
pull request. You can even edit the docs online with GitHub, without ever
downloading the files: the "Edit this page on GitHub" link at the bottom of
every page will direct you to GitHub's online editor for that page.

The documentation is written in Markdown and built with
[VitePress](https://vitepress.dev). Changes merged into the `2.x` branch are
deployed to <https://pieceofcake2.github.io/docs/> automatically by GitHub
Actions.

To preview your changes locally, run the development server from the root of
the repository. It needs `git`, `node`, `npm` and `rsync`:

``` bash
./bin/dev-server.sh
```

The script fetches the site theme, copies the documentation into it and starts
VitePress at <http://localhost:5173>.

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

## Translations

The documentation is maintained in English and Japanese. You should always
consider the English version as the authoritative version. When you change an
English page, update the Japanese page too if you can, or mention in your pull
request that the translation still needs to be updated.

### Translator Tips

- Browse and edit in the language you want the content to be translated to -
  otherwise you won't see what has already been translated.
- Translate both the content and the title at the same time.
- Do compare to the English content before submitting a correction (if you
  correct something, but don't integrate an 'upstream' change your submission
  won't be accepted).
- Keep the structure of the page, the code samples and the anchors the same as
  in the English page, so that links between pages keep working in both
  languages.
- Use the same terms as the existing pages of your language.
- Do not submit partial translations.
- Do not use
  [html entities](https://en.wikipedia.org/wiki/List_of_XML_and_HTML_character_entity_references)
  for accented characters, the book uses UTF-8.
- If the original content is missing some info, submit an edit for that first.

## Documentation Formatting Guide

The pages are plain Markdown with a few VitePress extensions. To maintain
consistency, follow the guidelines here when you add to the documentation, and
look at the existing pages for examples.

### Line Length

Lines of text should be wrapped at about 80 columns. The only exceptions are
long URLs, tables and code snippets.

### Headings

Each page starts with a single `#` heading, the page title. Use `##` for
sections, `###` for subsections and `####` for sub-subsections. Headings should
not be nested more than 4 levels deep, and should be preceded and followed by a
blank line.

VitePress generates an anchor for every heading from its text, for example
`## Running Tests` gets the anchor `#running-tests`. Japanese headings do not
produce the same anchor, so when a Japanese page needs the same anchor as the
English page, add it explicitly before the heading:

``` md
<a id="running-tests"></a>

## テストの実行
```

### Inline Markup

- One asterisk, `*text*`, for emphasis (italics).
- Two asterisks, `**text**`, for strong emphasis (bold). Use it sparingly.
- Backquotes, `` `text` ``, for code: method and function names (include
  `()`), class names, option names, table columns, file names and paths, for
  example `PagesController`, `find()`, `config/core.php`.

### Lists

Unordered lists start each item with `-` and a space. Numbered lists use
`1.`, `2.`, and so on. Indent nested lists and the continuation lines of an
item by two spaces (three for numbered lists):

``` md
- This is a bullet
- So is this. But this line
  has two lines.

1. First line
2. Second line
```

### Links

Links to external documents use the usual Markdown syntax:

``` md
[External Link](https://example.com)
```

Links to other pages of the documentation omit the `.md` extension. You can use
a path relative to the current page, or an absolute path from the root of the
language. Absolute paths start with `/` in English pages and with `/ja/` in
Japanese pages:

``` md
[Controllers](../controllers)
[Testing](/development/testing)
[テスト](/ja/development/testing)
```

To link to a section, add the anchor of its heading:

``` md
[Running Tests](/development/testing#running-tests)
```

### Describing Classes and Their Contents

There are no special directives for classes and methods. Pages describe a class
and its methods with a line in this form, followed by the description:

``` md
`class` **Cache**

`static` Cache::**read**($key, $config = 'default')

`Cache::read()` is used to read the cached value stored under `$key` ...
```

Refer to classes and methods in running text with backquotes, for example
`Cache::read()`.

### Source Code

Code samples are fenced code blocks with a language name, so that they are
highlighted. Use `php` for PHP code, `bash` for shell commands, and `text` for
output or anything that should not be highlighted:

```` md
``` php
$cloud = Cache::read('cloud');
```
````

PHP code samples follow the [Coding Standards](cakephp-coding-conventions).
Start a sample with a comment that gives its file name when it helps the
reader, using the modern application layout, for example
`// src/Controller/PostsController.php`.

You can group alternatives, such as the same command for different tools, with
a `::: code-group` container.

### Notes and Warnings

There are often times when you want to inform the reader of an important tip,
special note or a potential hazard. Use one of these alerts:

``` md
> [!TIP]
> This is a helpful tid-bit you probably forgot.

> [!NOTE]
> You should pay attention here.

> [!WARNING]
> It could be dangerous.
```

- Tips are used to document or re-iterate interesting or important information.
- Notes are used to document an especially important piece of information.
- Warnings are used to document potential stumbling blocks, or information
  pertaining to security.

Write the content of alerts in complete sentences, with all appropriate
punctuation.

To mark when a feature was added, changed or deprecated in CakePHP 2, use an
`info` container with a title:

``` md
::: info Added in version 2.6.3
This awesome feature was added on version 2.6.3
:::

::: info Deprecated in version 2.6.3
This old feature was deprecated on version 2.6.3
:::
```

The `tip`, `warning` and `danger` containers can also be used with a custom
title in the same way.

#### Change Notes for the Fork

When the Piece of Cake 2 fork behaves differently from the original CakePHP
2.10.24 in a way that a reader migrating an application must know, for example
a removed feature, a changed default or a changed method signature, add a short
note in a `pieceofcake2` container next to the text it applies to:

``` md
::: pieceofcake2
The Xcache and Wincache cache engines
were removed.
:::
```

The default title is "Piece of Cake 2 fork"; you can give another one after
the container name, as with `::: pieceofcake2 Cache engines`. Keep these notes
to one to three sentences. Everything else, including the current paths and
commands, belongs in the normal text of the page.

#### Samples

> [!TIP]
> This is a helpful tid-bit you probably forgot.

> [!NOTE]
> You should pay attention here.

> [!WARNING]
> It could be dangerous.

::: info Added in version 2.6.3
This awesome feature was added on version 2.6.3
:::

::: pieceofcake2
The Xcache and Wincache cache engines
were removed.
:::

### Including Other Files

A page can include part of another Markdown file with VitePress's `@include`
directive, written as an HTML comment. This is used, for example, to show the
same section on two pages; see `docs/en/core-libraries.md` for examples. A line
range in braces after the file name, such as `{28,97}`, includes only those
lines. If you edit a file that is included elsewhere, search the repository for
`@include` and check that the line ranges in the including files still select
the same section.
