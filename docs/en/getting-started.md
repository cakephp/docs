# Getting Started

This page is the starting point of the book for readers who already run a
CakePHP 2 application, and for developers who know modern PHP and have to work
on one. It summarizes what is different on this fork and where to read more.
If you are new to CakePHP 2, the [Blog Tutorial](tutorials-and-examples/blog/blog)
walks you through a small application step by step.

## About This Fork {#about-this-fork}

This book documents [pieceofcake2/cakephp](https://github.com/pieceofcake2/cakephp),
a community-maintained fork of CakePHP 2.x. The fork is based on
CakePHP 2.10.24 and runs on PHP 8.0 to 8.5. It is maintenance-focused: it
keeps CakePHP 2 compatible with current PHP versions and fixes bugs and
security issues. It does not aim to add features; additions are limited to what
helps maintenance and migration, such as backports from CakePHP 5.

The CakePHP project ended support for CakePHP 2.x in
[June 2021](https://bakery.cakephp.org/2021/10/02/cakephp_2_eol.html).

This cookbook describes CakePHP 2 as it works on the fork: installation with
Composer, PHP 8, and the modern directory layout used by
[pieceofcake2/app](https://pieceofcake2.github.io/app/).
[Changes from the Original Book](/appendices/changes-from-the-original-book)
lists how it differs from the original CakePHP 2.x documentation. The
[Piece of Cake 2 website](https://pieceofcake2.github.io/) links to the
fork's other projects and resources.

## What's Different from CakePHP 2.10 {#whats-different}

If you know CakePHP 2.10, most of your knowledge still applies: the models,
controllers, views, components, behaviors and helpers work as before. These are
the points that changed:

- **Composer only.** Install `pieceofcake2/cakephp` with Composer; archive,
  PEAR and `include_path` installations are gone. The package replaces
  `cakephp/cakephp`, so plugins that require `cakephp/cakephp` 2.x keep
  installing. The framework lives in `vendor/pieceofcake2/cakephp/src/Cake/`
  (formerly `lib/Cake/`), and its classes are loaded by Composer's classmap
  instead of `App::uses()`. See [Installation](installation) and
  [Loading classes](controllers#autoloading-classes).
- **PHP 8.** The fork runs on PHP 8.0 to 8.5. A few APIs that do not work on
  current PHP versions were removed, for example the `String` class (use
  `CakeText`) and the Xcache and Wincache cache engines. See
  [Migrating from CakePHP 2.10](/appendices/migrating-from-cakephp-2-10).
- **Modern directory layout.** Applications can use the layout of CakePHP 5
  (`bin/cake`, `config/`, `src/`, `templates/`, `tests/`, `plugins/`), and
  the legacy `app/` layout keeps working. This book uses the modern layout. See
  [CakePHP Folder Structure](getting-started/cakephp-folder-structure).
- **PHPUnit 9.6.** Tests run on PHPUnit 9.6 instead of 3.7. See
  [Testing](development/testing) and
  [Migrating Tests to PHPUnit 9.6](/appendices/phpunit-9-migration-hints).
- **Coding standard.** The fork and the samples in this book follow the
  CakePHP 5 codesniffer rules (4 spaces, short array syntax). See
  [Coding Standards](contributing/cakephp-coding-conventions).
- **Static analysis.** The
  [pieceofcake2/phpstan-cakephp2](https://pieceofcake2.github.io/phpstan-cakephp2/)
  extension lets PHPStan understand models, components and behaviors. See
  [Static Analysis](development/static-analysis).
- **Security fixes.** Known vulnerabilities of CakePHP 2.10.24 are fixed, for
  example CSRF tokens are now HMAC-signed. See
  [Security Fixes](/appendices/security-fixes).
- **Backports from CakePHP 5.** `IntegrationTestTrait` and `EmailTrait`
  (CakePHP 2.12.4) test controllers through the real dispatcher with the
  CakePHP 5 method names, see the
  [upgrade guide](https://github.com/pieceofcake2/cakephp/blob/2.x/UPGRADE.md#v2124)
  of the fork. The application skeleton loads `.env` files (pieceofcake2/app
  2.4.0), see [Environment Variables](development/configuration#environment-variables).
- **Bake and plugins.** Bake and the upgrade shell moved out of the core into
  plugins, and the major CakePHP 2 plugins are maintained for PHP 8. See
  [Code Generation with Bake](console-and-shells/code-generation-with-bake) and
  [Maintained Plugins](/plugins/maintained-plugins).

## Where to Start {#where-to-start}

### Existing Application {#existing-application}

Most readers of this book maintain an application that already runs on
CakePHP 2:

1. Read [Migrating from CakePHP 2.10](/appendices/migrating-from-cakephp-2-10)
   for the prerequisites and the breaking changes. The fork is based on
   CakePHP 2.10.24, so upgrade an older 2.x application to 2.10.24 first.
2. Replace `cakephp/cakephp` with `pieceofcake2/cakephp` and update the
   dispatcher files, as described in
   [Adding CakePHP to an Existing Application](installation#adding-cakephp-to-an-existing-application).
3. Optionally, move the application to the modern layout one directory at a
   time, as described in
   [Migrating to the Modern Layout](/appendices/migrating-to-the-modern-layout).
   This step also prepares the application for a later move to CakePHP 5.

### New Application {#new-application}

To start an application on the fork, create it from the application skeleton:

```bash
composer create-project pieceofcake2/app my_app
```

See [Creating a New Application](installation#creating-a-new-application) for
the configuration that follows.

> [!NOTE]
> For a new project, consider [CakePHP 5](https://book.cakephp.org/5/en/)
> first. The fork is meant for applications that need to stay on CakePHP 2.

## Coming from Modern PHP {#coming-from-modern-php}

CakePHP 2 was designed for PHP 5.2 and 5.3. If you know CakePHP 5, Laravel or
Symfony, expect these differences:

- **No namespaces.** Framework and application classes are global classes, and
  the class name and the file location follow
  [conventions](getting-started/cakephp-conventions#file-and-classname-conventions),
  for example `PostsController` in `src/Controller/PostsController.php`. On the
  fork, Composer's classmap loads them; `App::uses()` is only needed for classes
  Composer does not know, such as most plugin classes.
- **Arrays instead of objects.** `find()` takes an array of options and
  returns nested arrays keyed by model alias, such as
  `$post['Post']['title']`, not entities or collections. See
  [Retrieving Your Data](models/retrieving-your-data). Form data, validation
  rules and component settings are arrays as well.
- **Models are table gateways.** One `Model` class per table handles finding,
  saving, validation and associations. Reusable model logic goes into
  behaviors, controller logic into components and view logic into helpers. See
  [CakePHP Structure](getting-started/cakephp-structure).
- **Convention-based wiring, not dependency injection.** There is no service
  container. Controllers declare what they use in properties such as
  `$uses`, `$components` and `$helpers`, and access them as
  `$this->Post`, `$this->Auth` or `$this->Html`.
- **Global configuration.** Settings live in a static registry,
  [Configure](development/configuration#configure-class), and are read with
  `Configure::read('App.encoding')`. Caches and logs are configured with
  static calls in the same style, `Cache::config()` and `CakeLog::config()`.
- **No PSR-7 or middleware.** Requests and responses are `CakeRequest` and
  `CakeResponse` objects, and code that runs around the dispatcher is written as
  [dispatcher filters](development/dispatch-filters).
- **Few native types.** Most core methods have no parameter or return type
  declarations. Docblocks and [static analysis](development/static-analysis)
  fill the gap.

[A Typical CakePHP Request](getting-started/a-typical-cakephp-request) shows
how these pieces work together.

## In This Section

- [Installation](installation),
  [Advanced Installation](installation/advanced-installation) and
  [URL Rewriting](installation/url-rewriting)
- [CakePHP Folder Structure](getting-started/cakephp-folder-structure)
- [CakePHP Conventions](getting-started/cakephp-conventions)
- [CakePHP Structure](getting-started/cakephp-structure)
- [A Typical CakePHP Request](getting-started/a-typical-cakephp-request)
