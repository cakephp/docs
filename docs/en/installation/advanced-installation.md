# Advanced Installation

This page covers details of the Composer setup and how to place the directories
of your application in different locations. For a standard installation, see
[Installation](../installation).

## Composer Setup

CakePHP and its plugins are installed with Composer, and the dispatcher files
(`webroot/index.php`, `webroot/test.php` and `bin/cake`) load Composer's
autoloader before CakePHP itself. A `composer.json` for a CakePHP application
looks like the one in the [pieceofcake2/app](https://pieceofcake2.github.io/app/)
skeleton:

```json
{
    "name": "example/my-app",
    "type": "project",
    "require": {
        "php": ">=8.0",
        "pieceofcake2/cakephp": "^2.12"
    },
    "require-dev": {
        "phpunit/phpunit": "^9.6",
        "pieceofcake2/bake": "^1.0",
        "pieceofcake2/debug_kit": "^2.2"
    },
    "autoload": {
        "classmap": ["src/"]
    },
    "config": {
        "sort-packages": true,
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

Be sure to keep `composer.json` and `composer.lock` with the rest of your
source code.

### The `replace` Directive

`pieceofcake2/cakephp` declares `"replace": {"cakephp/cakephp": "^2.0"}`.
Composer therefore treats it as `cakephp/cakephp`, and plugins that require
`cakephp/cakephp` 2.x install and work without changes. Do not require both
packages at the same time.

### Plugin Location

Packages of type `cakephp-plugin` are installed by `composer/installers`. The
`installer-paths` setting above installs them into `plugins/` at the project
root, where CakePHP looks for plugins in both layouts (the legacy
`app/Plugin/` directory is searched as well). Plugins still have to be loaded with
`CakePlugin::load()` in `config/bootstrap.php`. See
[How To Install Plugins](../plugins/how-to-install-plugins).

### Autoloading Your Classes

CakePHP's own classes are autoloaded through Composer's classmap, so you don't
need `App::uses()` for them. Your application classes can still be loaded with
`App::uses()`, or you can let Composer load them by adding the `classmap`
autoload setting shown above. With the classmap you can remove `App::uses()`
calls from your controllers, models, helpers and shells.

Composer's classmap is a fixed list of files, so run the following each time
you add a new class file:

```bash
composer dump-autoload
```

Plugins that don't support Composer autoloading still need `App::uses()`, for
example `App::uses('MyPluginHelper', 'MyPlugin.View/Helper');`.

If Composer warns about an ambiguous class resolution, for example because a
class such as `AppController` exists both in your application and in a package,
exclude the package's file in `composer.json`:

```json
{
    "autoload": {
        "classmap": ["src/"],
        "exclude-from-classmap": [
            "vendor/pieceofcake2/app/src/Controller/AppController.php",
            "vendor/pieceofcake2/app/src/Model/AppModel.php"
        ]
    }
}
```

::: pieceofcake2
CakePHP is loaded only through Composer's
autoloader. `CAKE_CORE_INCLUDE_PATH`, `include_path` setups and sharing one
CakePHP core between several applications are no longer supported; each
application installs CakePHP into its own `vendor/` directory.
:::

## Placing Directories in Other Locations

There may be some situations where you wish to place your application's
directories in different places on the filesystem, for example because of a
shared host restriction. A CakePHP application has three main parts:

1. CakePHP itself and the other Composer packages, in `vendor/`.
2. Your application code and configuration, in `src/`, `config/`,
   `templates/` and so on, at the project root (`ROOT`).
3. The application's webroot, usually in `webroot/`.

The webroot is the only part that needs to be accessible by your web server.
You can move it out of the project directory as long as you tell CakePHP where
you've put it.

The paths are defined as constants in `config/define.php`, which
`webroot/index.php`, `webroot/test.php` and `bin/cake` load first:

- `ROOT` is the project directory. By default, the directory above `config/`.
- `APP_DIR` is the name of the directory that contains your PHP code
  (`src`).
- `WEBROOT_DIR` is the name of the webroot directory (`webroot`).
- `WWW_ROOT` is the full path to the webroot directory.
- `VENDORS` is the full path to Composer's vendor directory.

Constants you don't define there are set by CakePHP, which detects the layout:
`CONFIG` (`ROOT/config/`), `TMP` (`ROOT/tmp/`), `LOGS` (`ROOT/logs/`) and
`TESTS` (`ROOT/tests/`). You can define these in `config/define.php` as well if
you need different locations.

Let's run through an example. Imagine that you wanted to set up CakePHP to
work as follows:

- The project directory, including `config/`, `src/` and `vendor/`, will be
  `/home/me/myapp`.
- The webroot directory will be `/var/www/mysite/`.

First, copy the contents of `webroot/` to `/var/www/mysite/` and set the webroot
constants in `config/define.php`:

```php
// /home/me/myapp/config/define.php (partial)

if (!defined('WEBROOT_DIR')) {
    define('WEBROOT_DIR', 'mysite');
}

if (!defined('WWW_ROOT')) {
    define('WWW_ROOT', DS . 'var' . DS . 'www' . DS . 'mysite' . DS);
}
```

Then edit `/var/www/mysite/index.php` (and `test.php`, if you use the
[Testing](../development/testing) feature) so that they load this file from the
project directory. Replace `dirname(__DIR__) . DS . 'config' . DS . 'define.php'`
in both places where it appears:

```php
// /var/www/mysite/index.php (partial)

$defineFile = DS . 'home' . DS . 'me' . DS . 'myapp' . DS . 'config' . DS . 'define.php';

if (!is_file($defineFile)) {
    trigger_error(
        'Configuration file "config' . DS . 'define.php" could not be loaded. ' .
        'Please ensure this file exists and is readable.',
        E_USER_ERROR,
    );
}
require_once $defineFile;
```

`ROOT` is still derived from the location of `config/define.php`, so it points
to `/home/me/myapp`, and `bin/cake` uses the same settings.

In the legacy `app/` layout, the same constants (`ROOT`, `APP_DIR`,
`WEBROOT_DIR`, `WWW_ROOT`) are defined at the top of `app/webroot/index.php`
and `app/webroot/test.php` instead.

It is recommended to use the `DS` constant rather than slashes to delimit file
paths. This prevents any missing file errors you might get as a result of using
the wrong delimiter, and it makes your code more portable.

## Apache and mod_rewrite (and .htaccess)

This section was moved to [URL rewriting](../installation/url-rewriting).
