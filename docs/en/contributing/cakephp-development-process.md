# CakePHP Development Process

Here we explain how the Piece of Cake 2 fork of CakePHP 2 is maintained. The
fork is maintained by the community on GitHub. All discussion happens in the
issues and pull requests of the
[pieceofcake2](https://github.com/pieceofcake2) repositories.

The fork exists to keep existing CakePHP 2 applications running on current PHP
versions. It does not add new features; for new projects, use CakePHP 5. The
goals of the fork, its single maintained branch and how releases are made are
described in the contribution guide:

- [Scope](https://github.com/pieceofcake2/.github/blob/master/CONTRIBUTING.md#scope)
- [Branches and Releases](https://github.com/pieceofcake2/.github/blob/master/CONTRIBUTING.md#branches-and-releases)

## Version Numbers

Releases are published as
[GitHub releases](https://github.com/pieceofcake2/cakephp/releases) and on
[Packagist](https://packagist.org/packages/pieceofcake2/cakephp) as
`pieceofcake2/cakephp`. The fork started from CakePHP 2.10.24:

- The first releases were numbered `2.10.24.1`, `2.10.24.2` and so on, on top
  of the original 2.10.24.
- Later releases continue with their own version numbers: `2.11.0` moved the
  framework to the new directory layout, `2.12.0` switched to Composer classmap
  autoloading, and `2.12.x` releases contain fixes on top of it.

Minor releases such as 2.11.0 and 2.12.0 included changes that affect
applications, so read the release notes before you update. See the
[Backwards Compatibility Guide](backwards-compatibility).

## Taking Part

- If you find a bug, open an issue as described in [Tickets](tickets). The
  best answer to a bug is a test that reproduces it. The tests in
  `tests/TestCase` of the framework are good examples to start from.
- If you want to fix something yourself, send a pull request as described in
  [Code](code).
- If you find a security issue, report it privately as described in
  [Reporting Security Issues](tickets#reporting-security-issues).
