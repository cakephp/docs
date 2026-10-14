# Migrating from CakePHP 2.10

This guide describes how to move an application from the original CakePHP
2.10.24 to pieceofcake2/cakephp, and lists the breaking changes. It is based on
[UPGRADE.md](https://github.com/pieceofcake2/cakephp/blob/2.x/UPGRADE.md).

## Prerequisites

Before migrating to this fork, ensure:

- Your application is running on PHP 7.4
- You're using CakePHP 2.10.24 (earlier versions are not supported)
- Your application uses Composer for dependency management

## From Original CakePHP 2.x

1. **Update to CakePHP 2.10.24 first**: If you're using an earlier version,
   update to `cakephp/cakephp:2.10.24` on PHP 7.4 first
2. **Ensure PHP 7.4 Compatibility**: Your application must be fully working on
   PHP 7.4 before migrating to PHP 8.x
3. **Update Composer**: Replace `cakephp/cakephp` with `pieceofcake2/cakephp` in
   your `composer.json`, and add the `composer/installers` settings so that
   plugins are installed into `app/Plugin/` (`plugins/` in the modern layout).
   These settings are required; see
   [Configuring composer.json](/installation#configuring-composer-json)
4. **Upgrade PHP**: Update your PHP version to 8.0 or newer
5. **Test Thoroughly**: Run your application's test suite to ensure compatibility

## v2.12.3

Changes in v2.12.3 that may affect applications already running on the fork.

### `Xml::build()` `readFile` option also blocks https URLs ([PR #33](https://github.com/pieceofcake2/cakephp/pull/33))

- **Security fix (SSRF)**: `Xml::build($input, ['readFile' => false])` fetched
  `https://` URLs because of a missing pair of parentheses (inherited from the
  original CakePHP 2.x). With `'readFile' => false`, neither `http://` nor
  `https://` URLs are fetched now; an `XmlException` is thrown instead. See
  [Security Fixes](/appendices/security-fixes#xml-build-ssrf).

**Migration:**

- No action required if you pass `'readFile' => false` to disable remote
  loading; this now works as documented.
- If you relied on `Xml::build()` fetching an `https://` URL with
  `'readFile' => false`, either remove the option (default is `true`) or fetch
  the document yourself (e.g. with `HttpSocket`) and pass the XML string.

### CookieComponent honors the `'type'` setting ([PR #34](https://github.com/pieceofcake2/cakephp/pull/34))

- `CookieComponent` now applies the `'type'` setting given in `$components`
  (e.g. `'Cookie' => ['type' => 'aes']`). Previously the setting was silently
  ignored and cookies were encrypted with the insecure default `'cipher'` type.

**Migration:**

- If your controllers set `'type'` in `$components`, cookies will now be
  written with that type, and cookies already written with `'cipher'` can no
  longer be decrypted. Plan the switch like any other encryption type change.
- When using `'aes'`, set `Configure::write('Security.useOpenSsl', true);`
  unless the mcrypt extension is installed (see [Enable OpenSSL](#enable-openssl)).
- An invalid `'type'` setting now triggers an `E_USER_WARNING` and falls back
  to `'cipher'`, as `CookieComponent::type()` does.

### Test case listing supports the `tests/TestCase` layout ([PR #35](https://github.com/pieceofcake2/cakephp/pull/35))

- `CakeTestLoader::generateTestList()` now finds test cases in `tests/TestCase`
  for the app and plugins, falling back to the legacy `Test/Case` layout.
  Previously the list was empty for the modern layout, so `bin/cake test app` /
  `bin/cake test <Plugin>` without a test case name and the web test runner
  showed no test cases.

**Migration:**

- No action required.

### SQL Server driver sets `PDO::ATTR_ERRMODE` by default ([PR #36](https://github.com/pieceofcake2/cakephp/pull/36))

- `Sqlserver::connect()` now merges `PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION`
  into the `'flags'` setting as the other drivers do. Because of an operator
  precedence bug, the default was never applied.

**Migration:**

- No action required. PDO already uses `PDO::ERRMODE_EXCEPTION` by default on
  PHP 8, and a `PDO::ATTR_ERRMODE` value given in `'flags'` still takes
  precedence.

### ServerShell default port changed to 8765 ([PR #37](https://github.com/pieceofcake2/cakephp/pull/37))

- `bin/cake server` now listens on port `8765` by default (as in CakePHP 3 and
  later) instead of `80`, which requires root privileges on most systems.
- `ServerShell::DEFAULT_PORT` is now `8765`.

**Migration:**

- To keep using port 80, pass it explicitly: `bin/cake server -p 80`.

## Breaking Changes

### Post-Installation Steps

#### For Legacy Directory Structure (`app/` directory)

After installation, install the Bake plugin and copy dispatcher files:

```bash
# Install Bake plugin
composer require --dev pieceofcake2/bake

# Copy web dispatcher files
cp app/Plugin/Bake/Console/Templates/skel/webroot/index.php app/webroot/index.php
cp app/Plugin/Bake/Console/Templates/skel/webroot/test.php app/webroot/test.php

# Copy console dispatcher
cp app/Plugin/Bake/Console/Templates/skel/Console/cake app/Console/cake
chmod +x app/Console/cake
```

#### For Modern Directory Structure (`src/` directory)

The following files need to be updated:

- `config/define.php`
- `bin/cake`
- `webroot/index.php`
- `webroot/test.php`

See [`pieceofcake2/app`](https://github.com/pieceofcake2/app) for the modern
application skeleton compatible with both CakePHP 2.x and 5.x.
See also [Installation](/installation) and
[Directory Structure](/appendices/migrating-to-the-modern-layout).

### Directory Structure Modernization ([PR #21](https://github.com/pieceofcake2/cakephp/pull/21))

- **Directory layout has been restructured to modern standards**
- `lib/Cake/` → `src/Cake/` (framework source code)
- `lib/Cake/Test/Case/` → `tests/TestCase/` (framework tests)
- `lib/Cake/Test/Fixture/` → `tests/Fixture/` (test fixtures)
- `lib/Cake/Console/cake` → `bin/cake` (console executable)
- `lib/Cake/Config/` → `config/` (framework configuration files at root level)
- `lib/Cake/View/` and `lib/Cake/Templates/` → `templates/` (framework default
  templates at root level)
- All configuration files and paths updated accordingly
- Added `CORE_ROOT` constant to reference framework root directory

**Modern Test Directory Support:**

- Applications and plugins can now use modern `tests/TestCase/` and
  `tests/Fixture/` directory structure
- Test suite automatically detects both `Test/Case/` (traditional) and
  `tests/TestCase/` (modern) directories
- Fixture loader supports both `Test/Fixture/` and `tests/Fixture/` locations
- Enables gradual migration to modern directory structure for application tests
- No breaking changes - both directory structures work simultaneously

**Migration:**

- No action required for applications using this framework as a dependency
- `bin/cake` (or `vendor/bin/cake` when installed via Composer) now
  intelligently detects your project structure
- Automatically works with both modern `src/` and traditional `app/` directory
  layouts
- Optionally migrate your application tests from `app/Test/Case/` to
  `app/tests/TestCase/` at your own pace

**Enhanced Console Executable:**

- `bin/cake` now automatically detects project root from Composer's autoloader
- No manual configuration needed - works out of the box with any project
  structure
- Supports modern (`src/`) and traditional (`app/`) application directories

### Composer Autoloading Migration ([PR #22](https://github.com/pieceofcake2/cakephp/pull/22))

The framework has migrated from include-path to Composer classmap autoloading.
This change simplifies class loading and improves compatibility with modern PHP
tooling.

**What changed:**

- Removed `App::uses()` declarations from CakePHP framework classes (798
  occurrences removed)
- CakePHP framework classes are now automatically loaded via Composer's
  classmap autoloader
- Application classes can be automatically loaded by configuring Composer
  classmap autoloading (see Migration section below)
- CakePHP framework classes that extend application classes use `App::uses()`:
  - `App::uses('AppController', 'Controller')` - for CakeErrorController
  - `App::uses('AppModel', 'Model')` - for I18nModel, AcoAction, Permission
  - `App::uses('AppShell', 'Console/Command')` - for all core shell commands
  - `App::uses('AppHelper', 'View/Helper')` - for all core helpers

**Migration:**

**For new projects or modern directory structure (`src/`):**

- Recommended: Update your `composer.json` to include classmap autoloading
  (similar to [pieceofcake2/app](https://github.com/pieceofcake2/app)):

  ```json
  {
    "autoload": {
      "classmap": ["src/"]
    }
  }
  ```

**For legacy projects (`app/` directory):**

- No action required - existing applications continue to work without changes
- The framework's `App::uses()` calls for application classes ensure backward
  compatibility

**Plugin classes:**

- Plugins that don't support Composer autoloading require `App::uses()` to load
  their classes (same as before):

  ```php
  App::uses('MyPluginHelper', 'MyPlugin.View/Helper');
  ```

- If a plugin's documentation indicates autoloading support, `App::uses()` may
  not be needed

**Custom Autoloader Override (optional):**

If you need to override autoloading behavior for specific classes, register
your custom autoloader with the prepend flag to give it priority over
Composer's autoloader:

```php
// Example: Custom classmap-based autoloader
$customClassMap = [
    'MyCustomClass' => '/path/to/MyCustomClass.php',
    'AnotherClass' => '/path/to/AnotherClass.php',
];

spl_autoload_register(function ($class) use ($customClassMap) {
    if (isset($customClassMap[$class])) {
        require $customClassMap[$class];

        return true;
    }

    return false;
}, true, true); // throw=true, prepend=true (priority over Composer)
```

**Parameters explained:**

- First `true`: Throw exception if autoloader registration fails
- Second `true`: Prepend to autoloader queue (gives priority over Composer's
  autoloader)

**Duplicate Class Name Warnings:**

When Composer encounters duplicate class names in the classmap, it will issue a
warning during `composer install` or `composer dump-autoload`:

```text
Warning: Ambiguous class resolution, "AppController" was found in both "/path/to/vendor/pieceofcake2/app/src/Controller/AppController.php" and "/path/to/your-app/src/Controller/AppController.php", the first will be used.
```

To prevent these warnings and ensure the correct class is loaded, use
`exclude-from-classmap` in your `composer.json`:

```json
{
  "autoload": {
    "classmap": ["src/"],
    "exclude-from-classmap": [
      "vendor/pieceofcake2/app/src/Controller/AppController.php",
      "vendor/pieceofcake2/app/src/Model/AppModel.php"
    ]
  },
  "autoload-dev": {
    ...
  }
}
```

This tells Composer to ignore specific files when building the classmap,
preventing conflicts with your application's base classes.

### Bake Plugin Extraction ([PR #17](https://github.com/pieceofcake2/cakephp/pull/17))

- **Bake functionality has been extracted to a separate plugin**
  ([pieceofcake2/bake](https://github.com/pieceofcake2/bake))
- `BakeShell` and all Bake tasks removed from core (`BakeTask`, `ModelTask`,
  `ControllerTask`, `ViewTask`, `FixtureTask`, `TestTask`, `TemplateTask`,
  `ProjectTask`, `PluginTask`, `DbConfigTask`, `CommandTask`)
- Application skeleton templates moved from `lib/Cake/Console/Templates/skel/`
  to Bake plugin
- Dispatcher files (`index.php`, `test.php`, `cake`) now located in Bake plugin
- Console bake commands no longer available without installing the Bake plugin

**Migration:**

1. Install the Bake plugin separately: `composer require --dev pieceofcake2/bake`
2. Load the plugin in your `app/Config/bootstrap.php`:

   ```php
   CakePlugin::load('Bake');
   ```

3. Copy dispatcher files from Bake plugin if needed (for new projects)

**Why this change:**

- Allows independent development and versioning of Bake functionality
- Reduces core framework size
- Most production applications don't need Bake in production

### Legacy Upgrade Plugin Extraction ([PR #19](https://github.com/pieceofcake2/cakephp/pull/19))

- **Legacy Upgrade functionality has been extracted to a separate plugin**
  ([pieceofcake2/upgrade](https://github.com/pieceofcake2/upgrade))
- `UpgradeShell` removed from core
- Legacy upgrade commands (1.3 → 2.0) no longer available without installing
  the Upgrade plugin

**Migration:**

::: info
The Upgrade plugin is only relevant for upgrading legacy CakePHP 1.3
applications to 2.0, which is extremely rare in 2025. Most users will never
need this plugin.
:::

If you need to upgrade a CakePHP 1.3 application to 2.0, install the Upgrade
plugin separately:

```bash
composer require --dev pieceofcake2/upgrade
```

Then load the plugin in your `app/Config/bootstrap.php`:

```php
CakePlugin::load('Upgrade');
```

**Why this change:**

- Reduces core framework size
- The Upgrade plugin is only useful for upgrading from CakePHP 1.3 to 2.0
- Almost no one needs this functionality in 2025

### Composer-Only Installation Required ([PR #14](https://github.com/pieceofcake2/cakephp/pull/14))

- **Non-Composer installation is no longer supported**
- Dispatcher files (`app/webroot/index.php`, `app/webroot/test.php`,
  `app/Console/cake`) require Composer autoload
- Removed manual `CAKE_CORE_INCLUDE_PATH` detection from dispatcher files
- Removed `include_path` manipulation logic
- Removed legacy `app/Vendor/cakephp/cakephp` path detection
- Removed `app/Console/cake.bat` and `app/Console/cake.php` (Windows batch file
  and PHP wrapper no longer needed)

**Migration:**

1. Ensure you're using Composer for dependency management
2. Install the Bake plugin: `composer require --dev pieceofcake2/bake`
3. Copy updated dispatcher files from `app/Plugin/Bake/Console/Templates/skel/` to
   your application:

   ```bash
   cp app/Plugin/Bake/Console/Templates/skel/webroot/index.php app/webroot/index.php
   cp app/Plugin/Bake/Console/Templates/skel/webroot/test.php app/webroot/test.php
   cp app/Plugin/Bake/Console/Templates/skel/Console/cake app/Console/cake
   ```

4. Remove old dispatcher files if present:

   ```bash
   rm -f app/Console/cake.bat app/Console/cake.php
   ```

5. Run `composer install` to ensure all dependencies are properly loaded

### Cache Engines Removed ([PR #4](https://github.com/pieceofcake2/cakephp/pull/4))

- **Xcache** support has been removed (not compatible with PHP 7.0+)
- **Wincache** support has been removed (not actively maintained for PHP 8.x)

**Migration:**

- If using these cache engines, migrate to Redis, Memcached, or APCu

### Database Driver Methods Added ([PR #3](https://github.com/pieceofcake2/cakephp/pull/3))

- New methods added to database drivers (may cause issues if you have custom
  driver implementations)

**MySQL Driver (Mysql.php):**

- `getVersion(): string` - Returns MySQL/MariaDB/Aurora MySQL version
- `getServerType(): string` - Returns 'MySQL', 'MariaDB', or 'Aurora MySQL'
- `utf8mb4Supported(): bool` - Checks utf8mb4 character set support
- `integerDisplayWidthDeprecated(): bool` - Checks if integer display width is
  deprecated (MySQL 8.0.17+)

**PostgreSQL Driver (Postgres.php):**

- `getVersion(): string` - Returns PostgreSQL version

**Migration:**

- If you have custom database drivers extending these classes, implement these
  methods

### Database Charset Configuration Changes ([PR #11](https://github.com/pieceofcake2/cakephp/pull/11))

- Character set configuration moved from `SET NAMES` to DSN connection options
- **MySQL**: Charset now in DSN (e.g., `mysql:...;charset=utf8`)
- **PostgreSQL**: Client encoding in DSN options (e.g.,
  `pgsql:...;options='--client_encoding=UTF8'`)
- **PostgreSQL**: `sslmode` parameter is now optional in DSN

**Migration:**

- No action required - changes are backward compatible
- `setEncoding()` methods still work for runtime changes
- More efficient connection setup with charset in DSN

### SQL Server Driver Updates ([PR #9](https://github.com/pieceofcake2/cakephp/pull/9))

#### Configuration Format

- **Schema**: the `schema` setting selects the SQL Server schema of a
  connection and defaults to `dbo`. To use tables in several schemas of one
  database, define one connection per schema:

  ```php
  public $default = [
      'datasource' => 'Database/Sqlserver',
      'host' => 'localhost',
      'port' => 1433,
      'login' => 'user',
      'password' => 'password',
      'database' => 'my_app',
      'schema' => 'dbo',
  ];
  ```

- **Connection options**: SSL/TLS options now in `options` array

  ```php
  'options' => [
      'TrustServerCertificate' => 'yes',
      'Encrypt' => 'no',
  ]
  ```

- **Port configuration**: Specify port separately (automatically appended to
  server)

#### Method Signature Changes

- `describe($model): array` - Now has explicit return type
- `insertMulti()` - Now returns `bool` instead of `void`

**Migration:**

- Set `schema` if your tables are not in the `dbo` schema
- Move SSL/TLS options to `options` array if using inline DSN
- If extending Sqlserver class, update method signatures to match

### Mail Function Updates ([PR #10](https://github.com/pieceofcake2/cakephp/pull/10))

- `MailTransport::_mail()` method signature changed with strict types
- Old: `protected function _mail($to, $subject, $message, $headers, $params = null)`
- New: `protected function _mail(string $to, string $subject, string $message, array|string $headers = [], string $params = ''): void`

**Migration:**

- No action required unless you've extended `MailTransport` class
- If extending, update method signature to match strict types

### CSRF Token Security Enhancement ([PR #5](https://github.com/pieceofcake2/cakephp/pull/5))

- New CSRF tokens use HMAC-SHA1 signatures (prevents CVE-2020-15400)
- Token format changed to base64-encoded (16-byte value + 20-byte HMAC)

**Migration:**

- **No action required** - automatic and backward compatible
- Existing tokens continue to work
- New tokens generated with enhanced security

See [Security](/appendices/security-fixes) for details.

### strftime() Replacement

- `strftime()` deprecated in PHP 8.1, removed in PHP 8.2
- Now uses `IntlDateFormatter` via Symfony's ICU Polyfill
- Fallback to `PHP81_BC\strftime` for compatibility

**Migration:**

- Most date formatting works identically
- Edge cases may produce slightly different output
- Test date formatting in your application

### Development Tools Updates

#### PHP CodeSniffer ([PR #8](https://github.com/pieceofcake2/cakephp/pull/8))

- Updated from 1.0.0 to 5.3
- Applied automatic formatting fixes

**Migration:**

- Development-time change only
- Update `phpcs.xml` if you have custom coding standards

See [Coding Standards](/contributing/cakephp-coding-conventions).

#### PHPUnit Compatibility

- Framework tests migrated to PHPUnit 9.6
- All deprecated PHPUnit features fixed

**Migration:**

- Update your tests if using deprecated PHPUnit features

### PHP 8 Syntax Modernization ([PR #7](https://github.com/pieceofcake2/cakephp/pull/7))

- Codebase modernized to PHP 8 syntax

**Changes:**

- `array()` → `[]`
- `get_class()` → `::class`
- `list()` → `[]` for array destructuring
- `dirname(__FILE__)` → `__DIR__`
- Added null coalescing operators
- Native `str_contains()`, `str_starts_with()`, `str_ends_with()`

**Migration:**

- **No action required** - syntax changes only, no functionality changes

### CookieComponent 'cipher' Type - Insecure and Should Be Replaced

- The default `CookieComponent` encryption type `'cipher'` is horribly insecure

::: warning
As stated in the CakePHP source code comments:

> "Cipher is horribly insecure and only the default because of backwards
> compatibility. In new applications you should always change this to 'aes' or
> 'rijndael'."
:::

**Why 'cipher' is insecure:**

- Uses `Security::cipher()` with XOR encryption (cryptographically weak)
- Uses `Security.cipherSeed` with undefined float-to-int casting behavior
- The seed value: `mt_srand((int)(float)Configure::read('Security.cipherSeed'))`
  has no guaranteed consistency
- Not suitable for protecting sensitive data

**Migration:**

```php
// OLD (insecure - DO NOT USE)
public $components = [
    'Cookie' => [
        'type' => 'cipher'  // Default, horribly insecure
    ]
];

// NEW (recommended)
public $components = [
    'Cookie' => [
        'type' => 'aes',
    ],
];
```

You can also call `$this->Cookie->type('aes');` in `beforeFilter()`.

::: pieceofcake2
The `'type'` setting in `$components` is honored since v2.12.3. In v2.12.2 and
earlier it was ignored and cookies were encrypted with `'cipher'`.
:::

On PHP 8, `'aes'` also needs `Security.useOpenSsl`; see
[Enable OpenSSL](#enable-openssl) below.

::: danger
Changing encryption type will invalidate existing cookies. Plan your migration
strategy accordingly (e.g., support both types during transition period).
:::

## Additional notes for PHP 8

These points are not listed in UPGRADE.md but commonly affect applications
moving to PHP 8.

### Enable OpenSSL for `Security::encrypt()` and AES cookies {#enable-openssl}

The `mcrypt` extension is not bundled with PHP 7.2 and later, and is usually
not installed (it is available from [PECL](https://pecl.php.net/package/mcrypt)).
`Security::encrypt()` and `Security::decrypt()` use OpenSSL only when
`Security.useOpenSsl` is enabled; otherwise they call `mcrypt_*` functions and
fail. The same applies to `CookieComponent` with the `'aes'` type, which uses
these methods. The framework does not enable the setting by default.
Applications created from the [pieceofcake2/app](https://github.com/pieceofcake2/app)
skeleton (v2.3.1 and later) already have it in `config/core.php`. In existing
applications, add it to `app/Config/core.php` (legacy) or `config/core.php`
(modern):

```php
Configure::write('Security.useOpenSsl', true);
```

::: warning
The `'rijndael'` cookie type and `Security::rijndael()` always require mcrypt.
On PHP 8 without mcrypt, use `'aes'` with `Security.useOpenSsl` enabled.
:::

### `String` class removed

The deprecated `String` utility class has been removed (`string` is a reserved
word since PHP 7). Use `CakeText` instead:

```php
// Before
App::uses('String', 'Utility');
$uuid = String::uuid();

// After
$uuid = CakeText::uuid();
```
