# Installing the pieceofcake2 Fork

::: pieceofcake2
This page is specific to the **pieceofcake2 fork** and is not part of the
original CakePHP 2.x documentation.
:::

## Requirements

- PHP 8.0, 8.1, 8.2, 8.3, 8.4 or 8.5
- [Composer](https://getcomposer.org/). Installing without Composer (downloading
  an archive, `CAKE_CORE_INCLUDE_PATH`, `include_path`) is **not supported**.
- One of the supported databases:
  - MySQL 5.6, 5.7, 8.0+ (`pdo_mysql`)
  - PostgreSQL 9.4+ (`pdo_pgsql`)
  - SQLite 3 (`pdo_sqlite`)
  - Microsoft SQL Server 2022+ (`pdo_sqlsrv`)

PHP extensions:

- `mbstring`: **strongly recommended**. A Symfony polyfill is used when it is
  missing, but `mb_encode_mimeheader()` is not available in the polyfill, so
  `CakeEmail` falls back to `Multibyte::mimeEncode()` for header encoding.
- `intl`: optional. `IntlDateFormatter` is used instead of `strftime()`; a
  Symfony polyfill is used when the extension is missing.
- `openssl`: optional, required for SSL/TLS connections and AES encryption.
- `mcrypt`: optional (deprecated since PHP 7.1), only for legacy AES encryption.

::: info
The fork is based on CakePHP **2.10.24**. If your application runs an older
2.x release, upgrade to `cakephp/cakephp:2.10.24` on PHP 7.4 first. See the
[Upgrade Guide](/pieceofcake2/upgrade).
:::

## Installing with Composer

```bash
composer require pieceofcake2/cakephp
```

or add it to `composer.json` and run `composer update`:

```json
{
    "require": {
        "pieceofcake2/cakephp": "^2.12"
    }
}
```

When migrating an existing application, remove `cakephp/cakephp` from
`require` and add `pieceofcake2/cakephp` instead.

### The `replace` directive

`pieceofcake2/cakephp` declares `"replace": {"cakephp/cakephp": "^2.0"}` in its
`composer.json`. Composer therefore treats it as `cakephp/cakephp`, and plugins
or packages that require `cakephp/cakephp:^2.x` keep installing and working
with the fork. Do not require both packages at the same time.

## Post-installation steps

The dispatcher files of your application (`index.php`, `test.php` and the
`cake` console script) must be updated, because the fork loads the framework
only through Composer's autoloader.

### Legacy layout (`app/` directory)

Install the Bake plugin, which now contains the application skeleton, and copy
the dispatcher files from it:

```bash
# Install Bake plugin
composer require --dev pieceofcake2/bake

# Copy web dispatcher files
cp plugins/Bake/Console/Templates/skel/webroot/index.php app/webroot/index.php
cp plugins/Bake/Console/Templates/skel/webroot/test.php app/webroot/test.php

# Copy console dispatcher
cp plugins/Bake/Console/Templates/skel/Console/cake app/Console/cake
chmod +x app/Console/cake

# Remove old dispatcher files if present
rm -f app/Console/cake.bat app/Console/cake.php
```

::: tip
The paths above assume Composer installs CakePHP plugins into `plugins/`.
If your project uses a different `installer-paths` setting, adjust the
`plugins/Bake/` part accordingly.
:::

### Modern layout (`src/` directory)

Applications using the CakePHP 5-like layout (`config/`, `src/`, `templates/`,
`webroot/` at the project root) need these files:

- `config/define.php`
- `bin/cake`
- `webroot/index.php`
- `webroot/test.php`

Copy them from the [pieceofcake2/app](https://github.com/pieceofcake2/app)
skeleton. See [Directory Structure](/pieceofcake2/directory-structure) for the
full layout.

The modern layout also benefits from Composer classmap autoloading for your
own classes:

```json
{
    "autoload": {
        "classmap": ["src/"]
    }
}
```

Run `composer dump-autoload` after adding new class files.

## Bake plugin

Bake (code generation) has been removed from the core and is available as
[pieceofcake2/bake](https://github.com/pieceofcake2/bake):

```bash
composer require --dev pieceofcake2/bake
```

Load it in `app/Config/bootstrap.php` (legacy) or `config/bootstrap.php`
(modern):

```php
CakePlugin::load('Bake');
```

The 1.3 to 2.0 `UpgradeShell` has likewise moved to
[pieceofcake2/upgrade](https://github.com/pieceofcake2/upgrade). Most
applications do not need it.

## Starting a new project from the skeleton

The application skeleton is provided by
[pieceofcake2/app](https://github.com/pieceofcake2/app), which uses the modern
directory layout.

::: warning
Do not start new projects on CakePHP 2.x. Use
[CakePHP 5.x](https://book.cakephp.org/5/en/) instead. The skeleton is mainly a
reference for migrating existing applications.
:::

## Next steps

- [Upgrade Guide](/pieceofcake2/upgrade): breaking changes compared to CakePHP 2.10.24
- [Directory Structure](/pieceofcake2/directory-structure): legacy and modern layouts
- [Security](/pieceofcake2/security): security fixes and recommended settings
