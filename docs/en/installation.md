# Installation

CakePHP is installed with [Composer](https://getcomposer.org). The minimum
requirements are a web server, PHP and Composer. While this manual focuses
primarily on setting up on Apache (because it's the most commonly used), you
can configure CakePHP to run on a variety of web servers such as nginx,
lighttpd or Microsoft IIS.

This page first describes how to move an existing CakePHP 2 application to
this fork, and then how to create a new application. For an overview of what
changed compared to CakePHP 2.10, see [Getting Started](getting-started).

> [!WARNING]
> CakePHP 2 is meant for maintaining existing applications. If you are starting
> a new project, use [CakePHP 5](https://book.cakephp.org/5/en/) instead.

## Requirements

- HTTP Server. For example: Apache. mod_rewrite is preferred, but by no means
  required.
- PHP 8.0, 8.1, 8.2, 8.3, 8.4 or 8.5.
- [Composer](https://getcomposer.org).

Technically a database engine isn't required, but we imagine that most
applications will utilize one. CakePHP supports a variety of database storage
engines:

- MySQL 5.6, 5.7 or 8.0+ (`pdo_mysql`)
- PostgreSQL 9.4+ (`pdo_pgsql`)
- SQLite 3 (`pdo_sqlite`)
- Microsoft SQL Server 2022+ (`pdo_sqlsrv`)

> [!NOTE]
> All built-in drivers require PDO. You should make sure you have the correct
> PDO extensions installed.

CakePHP also uses the following PHP extensions:

- `mbstring` is strongly recommended. Without it, a Symfony polyfill is used.
  The polyfill does not provide `mb_encode_mimeheader()`, so `CakeEmail` falls
  back to `Multibyte::mimeEncode()` to encode mail headers.
- `intl` is required. CakePHP depends on `php81_bc/strftime`, which replaces
  the deprecated `strftime()` for date formatting and requires `intl`.
- `openssl` is optional, but required for SSL/TLS connections and for AES
  encryption with [Security](core-utility-libraries/security).

::: pieceofcake2
PHP 8.0 or newer is required, and
CakePHP is loaded only through Composer's autoloader (`CAKE_CORE_INCLUDE_PATH`
and `include_path` setups were removed). The fork is based on CakePHP 2.10.24; if your application runs an
older 2.x release, first upgrade it to `cakephp/cakephp` 2.10.24 on PHP 7.4,
as described in the [Upgrade Guide](/appendices/migrating-from-cakephp-2-10).
:::

## License

CakePHP is licensed under the MIT license. This means that you are free to
modify, distribute and republish the source code on the condition that the
copyright notices are left intact. You are also free to incorporate CakePHP
into any commercial or closed source application.

## Installing Composer

If you don't have Composer yet, install it as described in the
[official Composer documentation](https://getcomposer.org/download/). On
Windows you can use the
[Composer Windows installer](https://github.com/composer/windows-setup/releases/).
The examples in this book assume that the `composer` command is in your
`PATH`.

## Adding CakePHP to an Existing Application

If your application already uses Composer with `cakephp/cakephp`, replace it
with `pieceofcake2/cakephp` in the `require` section of your `composer.json`,
and add the `config` and `extra` settings described in
[Configuring composer.json](#configuring-composer-json) if they are missing.
Then run `composer update`. `pieceofcake2/cakephp` declares that it replaces
`cakephp/cakephp`, so plugins and packages that require `cakephp/cakephp`
2.x keep installing and working. Do not require both packages at the same
time.

CakePHP is loaded only through Composer's autoloader, so the dispatcher files of
your application (`index.php`, `test.php` and the `cake` console script) must
be replaced by current versions.

For an application that uses the modern layout, copy `config/define.php`,
`bin/cake`, `webroot/index.php` and `webroot/test.php` from the
[pieceofcake2/app](https://github.com/pieceofcake2/app) skeleton.

For an application that still uses the legacy `app/` layout, install the Bake
plugin, which contains the application templates, and copy the dispatcher
files from it:

```bash
composer require --dev pieceofcake2/bake

cp app/Plugin/Bake/Console/Templates/skel/webroot/index.php app/webroot/index.php
cp app/Plugin/Bake/Console/Templates/skel/webroot/test.php app/webroot/test.php
cp app/Plugin/Bake/Console/Templates/skel/Console/cake app/Console/cake
chmod +x app/Console/cake

# The Windows batch file and the PHP wrapper are no longer used
rm -f app/Console/cake.bat app/Console/cake.php
```

In the legacy layout, Composer installs CakePHP plugins into `app/Plugin/`
with the `installer-paths` setting shown in
[Configuring composer.json](#configuring-composer-json).

You can move a legacy application to the modern layout later, one directory
at a time. See [CakePHP Folder Structure](getting-started/cakephp-folder-structure) for
the mapping between the two layouts, and the
[Upgrade Guide](/appendices/migrating-from-cakephp-2-10) for the other changes compared to
CakePHP 2.10.24.

## Creating a New Application

The [pieceofcake2/app](https://pieceofcake2.github.io/app/) package is the
application skeleton. Create a new application with Composer's
`create-project` command:

```bash
composer create-project pieceofcake2/app my_app
```

This creates a `my_app` directory, installs CakePHP (`pieceofcake2/cakephp`)
into `vendor/`, and installs the [Bake](console-and-shells/code-generation-with-bake)
and [DebugKit](https://pieceofcake2.github.io/debug_kit/) plugins as
development dependencies. The skeleton uses the following layout:

```text
my_app/
    bin/cake            console
    config/             configuration
    logs/               log files
    plugins/            plugins installed by Composer
    resources/locales/  translation files
    src/                controllers, models, helpers, shells
    templates/          view templates, layouts and elements
    tests/              tests and fixtures
    tmp/                cache, sessions
    vendor/             Composer packages, including CakePHP
    webroot/            document root
```

See [CakePHP Folder Structure](getting-started/cakephp-folder-structure) for
details.

Next, finish the configuration:

1. Copy `config/database.php.default` to `config/database.php` and enter your
   database connection settings. See
   [Database Configuration](development/configuration#database-configuration).
2. In `config/core.php`, change the values of `Security.salt` and
   `Security.cipherSeed`. The skeleton ships with well-known example values
   that must not be used in a real application.

Instead of editing the files, you can set the debug level, the security salts
and the database settings with environment variables. For development, copy
`config/.env.example` to `config/.env` (or to `.env` in the project root) and
edit it; the skeleton loads it at the top of `config/core.php`. See
[Environment Variables](development/configuration#environment-variables).

The skeleton's `composer.json` already contains the plugin settings described
in [Configuring composer.json](#configuring-composer-json). Keep them when you
edit the file.

## Configuring composer.json {#configuring-composer-json}

A minimal `composer.json` for a CakePHP application looks like this:

```json
{
    "name": "example/my-app",
    "type": "project",
    "require": {
        "php": ">=8.0",
        "pieceofcake2/cakephp": "^2.12"
    },
    "autoload": {
        "classmap": ["src/"]
    },
    "config": {
        "allow-plugins": {
            "composer/installers": true
        }
    },
    "extra": {
        "installer-paths": {
            "plugins/{$name}/": ["type:cakephp-plugin"]
        }
    }
}
```

The `config` and `extra` settings are required:

- CakePHP 2 plugins are published as Composer packages of type
  `cakephp-plugin` and are installed by the
  [composer/installers](https://github.com/composer/installers) package. The
  `installer-paths` setting tells it to install them into
  `plugins/<Name>/`, which is where `CakePlugin::load()` looks for them.
  Without this mapping, plugins end up in a different directory and CakePHP
  cannot find them.
- Since Composer 2.2, packages that run Composer plugins, such as
  `composer/installers`, must be allowed in `config.allow-plugins`.
  Otherwise Composer asks for confirmation or refuses to run them, and the
  plugins are not installed in `plugins/`.

In an application that uses the legacy `app/` layout, install plugins into
`app/Plugin/` instead:

```json
"extra": {
    "installer-paths": {
        "app/Plugin/{$name}/": ["type:cakephp-plugin"]
    }
}
```

CakePHP looks for plugins in `src/Plugin/` or `app/Plugin/` and in `plugins/`
at the project root, so a legacy application can also keep using `plugins/`.

The `classmap` setting is optional. It lets Composer autoload your own classes
in `src/`, so you don't need `App::uses()` for them; run `composer dump-autoload`
after adding a new class file. Applications that load their classes with
`App::uses()` can leave it out. See
[Advanced Installation](installation/advanced-installation) for more details.

## Permissions

CakePHP uses the `tmp/` directory for a number of different operations. A
few examples would be Model descriptions, cached views and session information.
Log files are written to `logs/`.

As such, make sure the `tmp/` and `logs/` directories and all their
subdirectories are writable by the web server user. In the legacy layout,
these are `app/tmp/` and `app/tmp/logs/`.

One common issue is that these directories must be writable both by the web
server and the command line user. On a UNIX system, if your web server user is
different from your command line user, you can run the following commands just
once in your project to ensure that permissions will be setup properly:

``` text
HTTPDUSER=`ps aux | grep -E '[a]pache|[h]ttpd|[_]www|[w]ww-data|[n]ginx' | grep -v root | head -1 | cut -d\  -f1`
setfacl -R -m u:${HTTPDUSER}:rwx tmp logs
setfacl -R -d -m u:${HTTPDUSER}:rwx tmp logs
```

## Development Server

The quickest way to try your application is PHP's built-in web server, which
you can start with the `server` shell:

```bash
bin/cake server
```

Your application is then available at <http://localhost:8765/>. Use `-p` to
change the port, `-H` to change the host name and `-d` to change the document
root.

::: pieceofcake2
The default port is 8765 since v2.12.3. Earlier versions listened on port 80
when `-p` was omitted.
:::

> [!WARNING]
> The built-in server is meant for development only. Never use it in a
> production environment.

## Configuring the Web Server

In production, and also in development if you use Apache or another web
server, set the web server's document root to the application's `webroot/`
directory (`app/webroot/` in the legacy layout). Only the files in `webroot/`
are then reachable from the web, while your configuration, source code and
`vendor/` stay outside of the document root.

Assuming you installed the application into `/var/www/my_app`, an Apache
virtual host looks like this:

``` text
<VirtualHost *:80>
    ServerName www.example.com
    DocumentRoot /var/www/my_app/webroot

    <Directory /var/www/my_app/webroot>
        AllowOverride All
        Require all granted
    </Directory>
</VirtualHost>
```

The `.htaccess` file in `webroot/` rewrites all requests to `index.php`, so
mod_rewrite must be enabled and `AllowOverride` must allow it. If your web
server is configured correctly, you should now find your CakePHP application
accessible at <https://www.example.com>.

For nginx, lighttpd, IIS and for troubleshooting mod_rewrite, see
[URL Rewriting](installation/url-rewriting). If you need to place the
directories of your application in other locations, see
[Advanced Installation](installation/advanced-installation).

Before you go live, also read [Deployment](deployment).

## Fire It Up

Alright, let's see CakePHP in action. Point your browser to the URL of your
application, for example <http://localhost:8765/> when you use the development
server or <https://www.example.com/>. At this point, you'll be presented with
CakePHP's default home, which tells you whether the `tmp/` directory is
writable, whether caching works and whether CakePHP can connect to your
database.

Congratulations! Your application is up and running. If you are new to
CakePHP 2, continue with the [Blog Tutorial](tutorials-and-examples/blog/blog).

Not working? If you're getting timezone related errors from PHP uncomment one
line in `config/core.php` and set your server's timezone:

``` php
/**
 * Uncomment this line and correct your server timezone to fix
 * any date & time related errors.
 */
date_default_timezone_set('UTC');
```
