# Piece of Cake 2 Documentation

Documentation for [Piece of Cake 2](https://github.com/pieceofcake2/cakephp),
a community-maintained fork of CakePHP 2.x for PHP 8.

Published at https://pieceofcake2.github.io/docs/

This repository is a fork of the `2.x` branch of
[cakephp/docs](https://github.com/cakephp/docs/tree/2.x) (the CakePHP Cookbook).
Content specific to Piece of Cake 2 is marked in the documentation with a
`::: pieceofcake2` box.

## Local Development

```bash
npm ci
npm run docs:dev
```

Build the static site into `.vitepress/dist`:

```bash
npm run docs:build
```

Pushes to the `2.x` branch are deployed to GitHub Pages by
`.github/workflows/deploy.yml`.

## Writing Piece of Cake 2 specific content

Wrap anything that differs from the original CakePHP 2.x documentation in a
`pieceofcake2` container so readers can tell it apart:

```md
::: pieceofcake2
Piece of Cake 2 requires PHP 8.0 or newer.
:::

::: pieceofcake2 Custom title
...
:::
```

## License

See [LICENSE](LICENSE).

- Documentation content: [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/),
  © Cake Software Foundation, Inc., with modifications by Piece of Cake 2 contributors.
- VitePress theme (`.vitepress/`): MIT, from
  [cakephp/docs-skeleton](https://github.com/cakephp/docs-skeleton).

This project is not affiliated with or endorsed by the Cake Software Foundation.
CakePHP is a trademark of the Cake Software Foundation.
