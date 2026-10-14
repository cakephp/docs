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

## Local Development

```bash
./bin/dev-server.sh
```

This clones the skeleton into `.temp`, syncs `docs/`, `config.js` and the TOC
files, and starts the VitePress dev server at http://localhost:5173.
Requires `git`, `node`, `npm` and `rsync`.

Pushes to the `2.x` branch are deployed to GitHub Pages by
`.github/workflows/deploy.yml`.

## Editing Guidelines

- Write the pages so that they describe the current state. Do not add separate
  "fork-specific" pages or disclaimers; edit the original page instead.
- Use the modern directory layout (`src/`, `templates/`, `config/`, `bin/cake`)
  in text and examples. Mention the legacy `app/` layout only where it helps.
- Code samples follow the [coding standard](https://pieceofcake2.github.io/docs/contributing/cakephp-coding-conventions)
  (CakePHP 5 codesniffer).
- When the fork behaves differently from the original CakePHP 2.10.24 in a way
  that a migrating user must know, add a short change note:

  ```md
  ::: pieceofcake2
  The Xcache and Wincache engines were removed.
  :::
  ```

- Update both `docs/en` and `docs/ja`, and add the change to
  `docs/*/pieceofcake2/changes.md`.

## License

See [LICENSE](LICENSE).

- Documentation content: [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/),
  © Cake Software Foundation, Inc., with modifications © 2025-present Piece of Cake 2.
- Theme: MIT, [pieceofcake2/docs-skeleton](https://github.com/pieceofcake2/docs-skeleton)
  (fork of [cakephp/docs-skeleton](https://github.com/cakephp/docs-skeleton)).

This project is not affiliated with or endorsed by the Cake Software Foundation.
CakePHP is a trademark of the Cake Software Foundation.
