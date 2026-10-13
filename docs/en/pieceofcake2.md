# Piece of Cake 2

::: pieceofcake2
This page is specific to the **pieceofcake2 fork** and is not part of the
original CakePHP 2.x documentation. Throughout this book, boxes like this one
mark content that only applies to the fork.
:::

[pieceofcake2/cakephp](https://github.com/pieceofcake2/cakephp) is a
community-maintained fork of CakePHP 2.x that provides compatibility with
PHP 8.0 and newer. It is maintained by the
[Piece of Cake 2](https://github.com/pieceofcake2) project, which also
maintains forks of popular CakePHP 2 plugins.
The original CakePHP 2.x branch
[reached End of Life in June 2021](https://bakery.cakephp.org/2021/10/02/cakephp_2_eol.html).

::: warning
**Do not use CakePHP 2.x for new projects.** This fork exists to keep existing
legacy applications running. For new projects, use
[CakePHP 5.x](https://book.cakephp.org/5/en/).
:::

## Requirements

- PHP 8.0, 8.1, 8.2, 8.3, 8.4, 8.5
- Composer (installation without Composer is not supported)
- MySQL 5.6+, PostgreSQL 9.4+, SQLite 3, or Microsoft SQL Server 2022+

The fork is based on CakePHP **2.10.24**. Earlier versions are not supported.

## Installation

```json
{
    "require": {
        "pieceofcake2/cakephp": "^2.10"
    }
}
```

`pieceofcake2/cakephp` uses Composer's `replace` directive for
`cakephp/cakephp`, so plugins that depend on `cakephp/cakephp:^2.x` keep working.

## Fork documentation

- [Installation](/pieceofcake2/installation) - requirements, Composer setup and post-installation steps
- [Upgrade Guide](/pieceofcake2/upgrade) - migrating from CakePHP 2.10.24 and breaking changes
- [Directory Structure](/pieceofcake2/directory-structure) - legacy (`app/`) and modern (`src/`) layouts, gradual migration to CakePHP 5
- [Coding Standards](/pieceofcake2/coding-standards) - the CakePHP 5 based standard used by the fork
- [Security](/pieceofcake2/security) - security fixes and recommended settings
- [Repositories and Plugins](/pieceofcake2/plugins) - maintained repositories and plugin forks

## Resources

- [pieceofcake2/cakephp](https://github.com/pieceofcake2/cakephp) - the framework
- [pieceofcake2/app](https://github.com/pieceofcake2/app) - application skeleton
- [pieceofcake2/bake](https://github.com/pieceofcake2/bake) - Bake plugin (extracted from core)
- [CHANGELOG](https://github.com/pieceofcake2/cakephp/blob/2.x/CHANGELOG.md)
- [UPGRADE](https://github.com/pieceofcake2/cakephp/blob/2.x/UPGRADE.md)
