# Code

Pull requests are a great way to contribute code back to the Piece of Cake 2
fork. Create them on GitHub against the relevant `pieceofcake2/*` repository,
usually [pieceofcake2/cakephp](https://github.com/pieceofcake2/cakephp) for
the framework.

Before you start, keep the goals of the fork in mind: it maintains PHP 8
compatibility, fixes bugs and security issues, and supports a gradual migration
path to CakePHP 5. It does not add new features. If you are not sure whether a
change fits, open an issue first and ask.

The steps are described in the
[contribution guide](https://github.com/pieceofcake2/.github/blob/master/CONTRIBUTING.md#pull-requests):

- [Initial Setup](https://github.com/pieceofcake2/.github/blob/master/CONTRIBUTING.md#initial-setup):
  the required software, forking and cloning the repository, and
  `composer install`.
- [Running the Tests](https://github.com/pieceofcake2/.github/blob/master/CONTRIBUTING.md#running-the-tests):
  PHPUnit 9.6, and how to select the database for the framework's test suite
  with the `DB` environment variable.
- [Working on a Change](https://github.com/pieceofcake2/.github/blob/master/CONTRIBUTING.md#working-on-a-change):
  topic branches, the checks to run before you open a pull request (`phpcs`,
  `phpunit`, `composer validate`, PHPStan), and `CHANGELOG.md` and
  `UPGRADE.md` entries.
- [Coding Standard](https://github.com/pieceofcake2/.github/blob/master/CONTRIBUTING.md#coding-standard)
  and [Backwards Compatibility](https://github.com/pieceofcake2/.github/blob/master/CONTRIBUTING.md#backwards-compatibility).

The rules of the coding standard are described in
[Coding Standards](cakephp-coding-conventions).

> [!NOTE]
> Remember that all code you contribute to the fork will be licensed under the
> MIT License, the license of CakePHP.
