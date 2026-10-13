# CakePHP 2 Documentation (pieceofcake2 fork)

Documentation for [pieceofcake2/cakephp](https://github.com/pieceofcake2/cakephp),
a community-maintained fork of CakePHP 2.x for PHP 8, maintained by the
[Piece of Cake 2](https://github.com/pieceofcake2) project.

Published at https://pieceofcake2.github.io/docs/

This repository is a fork of the `2.x` branch of
[cakephp/docs](https://github.com/cakephp/docs/tree/2.x) (the CakePHP Cookbook).
Content specific to the fork is marked in the documentation with a
`::: pieceofcake2` box.

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

## Writing fork-specific content

Wrap anything that differs from the original CakePHP 2.x documentation in a
`pieceofcake2` container so readers can tell it apart:

```md
::: pieceofcake2
pieceofcake2/cakephp requires PHP 8.0 or newer.
:::

::: pieceofcake2 Custom title
...
:::
```

## License

See [LICENSE](LICENSE).

- Documentation content: [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/),
  © Cake Software Foundation, Inc., with modifications by Piece of Cake 2 contributors.
- Theme: MIT, [pieceofcake2/docs-skeleton](https://github.com/pieceofcake2/docs-skeleton)
  (fork of [cakephp/docs-skeleton](https://github.com/cakephp/docs-skeleton)).

This project is not affiliated with or endorsed by the Cake Software Foundation.
CakePHP is a trademark of the Cake Software Foundation.
