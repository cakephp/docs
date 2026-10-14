# Static Analysis

[PHPStan](https://phpstan.org/) finds bugs in your code without running it:
calls to undefined methods, wrong argument types, missing return values and
more. It complements your [tests](testing), and it is especially useful in
an old application that has few of them.

CakePHP 2 creates many objects on the fly. Models are available as
`$this->Post` in a controller, components as `$this->Auth`, and behavior
methods can be called on the model. PHPStan cannot see these by itself. The
[pieceofcake2/phpstan-cakephp2](https://github.com/pieceofcake2/phpstan-cakephp2)
extension teaches it how CakePHP 2 works.

## Installation

Install PHPStan and the extension as development dependencies:

```bash
composer require --dev phpstan/phpstan pieceofcake2/phpstan-cakephp2
```

## Configuration

PHPStan reads its configuration from `phpstan.neon` in the project root. The
configuration includes the extension, sets the
[rule level](#choosing-a-level) and the directories to analyse, and loads a
bootstrap file that defines the CakePHP constants and loads the framework, the
same way `webroot/index.php` does.

### Modern Layout

This is the configuration of the
[pieceofcake2/app](https://github.com/pieceofcake2/app) skeleton:

```yaml
# phpstan.neon
includes:
    - vendor/pieceofcake2/phpstan-cakephp2/extension.neon

parameters:
    level: 5
    phpVersion: 80000
    paths:
        - src
        - config
    bootstrapFiles:
        - tests/phpstan-bootstrap.php
```

`phpVersion` is the lowest PHP version that your application supports
(`80000` is PHP 8.0). The bootstrap file loads `config/define.php` and the
CakePHP bootstrap without dispatching a request or connecting to a database:

```php
<?php
// tests/phpstan-bootstrap.php

use Composer\InstalledVersions;

if (!defined('DS')) {
    define('DS', DIRECTORY_SEPARATOR);
}

require_once dirname(__DIR__) . DS . 'config' . DS . 'define.php';
require_once VENDORS . 'autoload.php';
require_once InstalledVersions::getInstallPath('pieceofcake2/cakephp') . DS . 'src' . DS . 'Cake' . DS . 'bootstrap.php';
```

### Legacy Layout

In an application with the legacy `app/` layout, analyse the directories in
`app/` and define the path constants in the bootstrap file:

```yaml
# phpstan.neon
includes:
    - vendor/pieceofcake2/phpstan-cakephp2/extension.neon

parameters:
    level: 5
    phpVersion: 80000
    paths:
        - app/Config
        - app/Console/Command
        - app/Controller
        - app/Lib
        - app/Model
        - app/View
    excludePaths:
        - app/Config/Schema
    bootstrapFiles:
        - app/Test/phpstan-bootstrap.php
```

```php
<?php
// app/Test/phpstan-bootstrap.php

use Composer\InstalledVersions;

define('DS', DIRECTORY_SEPARATOR);
define('ROOT', dirname(__DIR__, 2));
define('APP_DIR', 'app');
define('WEBROOT_DIR', 'webroot');
define('WWW_ROOT', ROOT . DS . APP_DIR . DS . WEBROOT_DIR . DS);

require_once InstalledVersions::getInstallPath('pieceofcake2/cakephp') . '/src/Cake/bootstrap.php';
```

Remove the directories that your application does not have from `paths`.

### Plugins

A plugin is analysed from its own directory, with the bootstrap file of its
tests. List the plugin's directories in `paths`, and add its behaviors to
`behaviorPaths` (see [Behaviors and Schema Files](#behaviors-and-schema-files)):

```yaml
# phpstan.neon
includes:
    - vendor/pieceofcake2/phpstan-cakephp2/extension.neon

parameters:
    level: 5
    phpVersion: 80000
    paths:
        - Console
        - Controller
        - Lib
        - Model
        - View
    bootstrapFiles:
        - tests/bootstrap.php
    ModelBehaviorsExtension:
        behaviorPaths:
            - Model/Behavior/*.php
```

## Running PHPStan

```bash
vendor/bin/phpstan analyse
```

PHPStan lists the errors with the file and the line of each. In a CI job, add
`--no-progress` to keep the log short.

## What the Extension Adds

The extension adds the following to PHPStan:

- Behavior methods are treated as methods of all models
  (`$this->Post->behaviorMethod()`).
- Controller, model and shell properties named after model classes are
  instances of those classes (`$this->Post` in a controller).
- Controller and component properties named after the components listed in
  `$components` are instances of those classes (`$this->Auth`).
- Shell properties named after task classes are instances of those classes.
- `ClassRegistry::init('Post')` returns a `Post` where possible, or a `Model`
  when only a table for it is defined in a schema file.
- `$this->Components->load('Name')` returns a `NameComponent`.

For other magic properties, add a `@property` tag to the class, as the
CakePHP core does. For example, a helper that uses other helpers:

```php
// src/View/Helper/LinkHelper.php
/**
 * @property HtmlHelper $Html
 */
class LinkHelper extends AppHelper
{
    public $helpers = ['Html'];

    public function home(): string
    {
        return $this->Html->link('Home', '/');
    }
}
```

### Behaviors and Schema Files

The extension finds behaviors and schema files with glob patterns that are
relative to the directory PHPStan runs from. The defaults cover the core
behaviors, `src/Model/Behavior`, `plugins/*/Model/Behavior` and
`config/Schema` in the modern layout, and `app/Model/Behavior`,
`app/Plugin/*/Model/Behavior` and `app/Config/Schema` in the legacy layout.
Add other locations to your `phpstan.neon`; they are merged with the
defaults:

```yaml
parameters:
    ModelBehaviorsExtension:
        behaviorPaths:
            - vendor/my-vendor/my-plugin/src/Model/Behavior/*.php
    SchemaService:
        schemaPaths:
            - vendor/my-vendor/my-plugin/config/Schema/*.php
```

## Choosing a Level

PHPStan has [rule levels](https://phpstan.org/user-guide/rule-levels) from 0
(the loosest) to 10. Each level adds checks to the previous ones. For example,
level 0 reports unknown classes and methods, level 3 checks return types,
level 5 checks the types of the arguments passed to methods and functions,
and level 6 requires type declarations everywhere.

Level 5 is a good target for a CakePHP 2 application: it finds real bugs, and
the fixes it asks for are small. The `pieceofcake2/app` skeleton and the
[maintained plugins](/plugins/maintained-plugins) run PHPStan at level 5 in
their CI. Level 6 and higher mostly ask for type declarations and array
shapes, which CakePHP 2 code rarely has.

For an existing application, start with level 0, fix the errors, and raise
the level one step at a time. If there are too many errors to fix at once,
record the current errors in a
[baseline](https://phpstan.org/user-guide/baseline) so that only new errors
are reported:

```bash
vendor/bin/phpstan analyse --generate-baseline
```

Add the generated `phpstan-baseline.neon` to the `includes` of your
`phpstan.neon`, and fix the recorded errors over time.
