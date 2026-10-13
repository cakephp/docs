# CakePHP Development Process

Here we explain how the Piece of Cake 2 fork of CakePHP 2 is maintained. The
fork is maintained by the community on GitHub. All discussion happens in the
issues and pull requests of the
[pieceofcake2](https://github.com/pieceofcake2) repositories.

## Goals

The fork exists to keep existing CakePHP 2 applications running on current PHP
versions. It aims to:

- maintain compatibility with PHP 8.x,
- fix bugs and security issues,
- keep the tests passing on all supported PHP versions and databases,
- support a gradual migration path to CakePHP 5, for example with the modern
  directory layout that both CakePHP 2 and CakePHP 5 can use.

The fork does not add new features. For new projects, use CakePHP 5.

## Branches

The framework has a single maintained branch, `2.x`. Bug fixes, security fixes
and compatibility changes are all made on this branch, and pull requests target
it. There are no separate maintenance, development or feature branches as in
the original CakePHP project.

## Releases

Releases are tags on the `2.x` branch, published as
[GitHub releases](https://github.com/pieceofcake2/cakephp/releases) and on
[Packagist](https://packagist.org/packages/pieceofcake2/cakephp) as
`pieceofcake2/cakephp`. The fork started from CakePHP 2.10.24:

- The first releases were numbered `2.10.24.1`, `2.10.24.2` and so on, on top
  of the original 2.10.24.
- Later releases continue with their own version numbers: `2.11.0` moved the
  framework to the new directory layout, `2.12.0` switched to Composer classmap
  autoloading, and `2.12.x` releases contain fixes on top of it.

Minor releases such as 2.11.0 and 2.12.0 included changes that affect
applications, so read the release notes before you update. Each release is described in the
[CHANGELOG](https://github.com/pieceofcake2/cakephp/blob/2.x/CHANGELOG.md).
Changes that require you to change your application, and how to migrate from
the original CakePHP 2.10.24, are described in the
[UPGRADE guide](https://github.com/pieceofcake2/cakephp/blob/2.x/UPGRADE.md)
and in [Migrating from CakePHP 2.10](/appendices/migrating-from-cakephp-2-10).

## Taking Part

- If you find a bug, open an issue as described in [Tickets](tickets). The
  best answer to a bug is a test that reproduces it. The tests in
  `tests/TestCase` of the framework are good examples to start from.
- If you want to fix something yourself, send a pull request as described in
  [Code](code).
- If you find a security issue, report it privately as described in
  [Reporting Security Issues](tickets#reporting-security-issues).
