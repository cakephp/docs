# Code

Pull requests are a great way to contribute code back to the Piece of Cake 2
fork. Create them on GitHub against the relevant `pieceofcake2/*` repository,
usually [pieceofcake2/cakephp](https://github.com/pieceofcake2/cakephp) for
the framework.

Before you start, keep the goals of the fork in mind: it maintains PHP 8
compatibility, fixes bugs and security issues, and supports a gradual migration
path to CakePHP 5. It does not add new features. If you are not sure whether a
change fits, open an issue first and ask.

## Initial Setup

Before working on patches for the fork, it's a good idea to get your
environment set up. You'll need the following software:

- Git
- PHP 8.0 or greater, with the `mbstring` extension (strongly recommended) and
  the PDO driver for the database you want to test against
- [Composer](https://getcomposer.org)
- MySQL, PostgreSQL, SQLite or SQL Server, or Docker to run them

PHPUnit 9.6, PHP_CodeSniffer with the CakePHP ruleset, and PHPStan are
development dependencies of the framework, so Composer installs them for you.

Set up your user information with your name/handle and working email address:

``` bash
git config --global user.name 'Bob Barker'
git config --global user.email 'bob.barker@example.com'
```

> [!NOTE]
> If you are new to Git, we highly recommend you to read the excellent and free
> [ProGit](https://git-scm.com/book/) book.

Get a clone of the framework source code from GitHub:

- If you don't have a [GitHub](https://github.com) account, create one.
- Fork the [pieceofcake2/cakephp repository](https://github.com/pieceofcake2/cakephp)
  by clicking the **Fork** button.

After your fork is made, clone your fork to your local machine:

``` bash
git clone git@github.com:YOURNAME/cakephp.git
```

Add the original repository as a remote repository. You'll use this later to
fetch changes from it, which lets you stay up to date:

``` bash
cd cakephp
git remote add upstream https://github.com/pieceofcake2/cakephp.git
```

Then install the dependencies:

``` bash
composer install
```

## Running the Tests

The framework's test suite runs against the
[pieceofcake2/app](https://github.com/pieceofcake2/app) skeleton, which
Composer installs into `vendor/pieceofcake2/app` as a development dependency.
Copy the test database configuration into it:

``` bash
cp tests/config/database.php vendor/pieceofcake2/app/config/
```

This configuration selects the database from the `DB` environment variable:
`mysql` (the default), `mysql80`, `pgsql`, `sqlite` or `sqlsrv`. SQLite uses
an in-memory database, so it needs no database server:

``` bash
DB=sqlite vendor/bin/phpunit
```

For the other databases, start a server with the credentials and database names
listed in `tests/config/database.php`, then set `DB` accordingly:

``` bash
DB=pgsql vendor/bin/phpunit
```

The `compose.yml` file in the repository defines Docker containers for all
supported database servers, which you can use for this.

To run a single test file, pass its path to PHPUnit:

``` bash
DB=sqlite vendor/bin/phpunit tests/TestCase/Utility/HashTest.php
```

Also check your code against the [Coding Standards](../contributing/cakephp-coding-conventions):

``` bash
vendor/bin/phpcs
```

The continuous integration of the repository runs the test suite on every
supported PHP version and database, and runs `phpcs`, for every pull request.

## Working on a Patch

Each time you want to work on a bug or an enhancement, create a topic branch.

The fork has a single maintained branch, `2.x`. Base your branch on it:

``` bash
git fetch upstream
git checkout -b fix-1234 upstream/2.x
```

> [!TIP]
> Use a descriptive name for your branch. Referencing the issue number or a
> short description of the fix is a good convention, e.g. fix-1234,
> php84-deprecations.

The above will create a local branch based on the upstream `2.x` branch.
Work on your fix, and make as many commits as you need; but keep in mind the
following:

- Follow the [Coding Standards](../contributing/cakephp-coding-conventions).
- Add a test case to show the bug is fixed, or that the change works.
- Keep the public API of CakePHP 2 intact. See the
  [Backwards Compatibility Guide](../contributing/backwards-compatibility).
- Keep your commits logical, and write good clear and concise commit messages.

## Submitting a Pull Request

Once your changes are done and you're ready for them to be merged, you'll
want to update your branch:

``` bash
git fetch upstream
git rebase upstream/2.x
```

This will fetch any changes that have happened in the repository since you
started, and then rebase, or replay, your changes on top of the current code.
You might encounter a conflict during the `rebase`. If the rebase quits early
you can see which files are conflicted/un-merged with `git status`. Resolve
each conflict, and then continue the rebase:

``` bash
git add <filename> # do this for each conflicted file.
git rebase --continue
```

Check that all your tests continue to pass. Then push your branch to your
fork:

``` bash
git push origin <branch-name>
```

Once your branch is on GitHub, you can open a pull request against the `2.x`
branch of the upstream repository. Describe what the change fixes and how you
tested it, and link the related issue if there is one.

> [!NOTE]
> Remember that all code you contribute to the fork will be licensed under the
> MIT License, the license of CakePHP.
