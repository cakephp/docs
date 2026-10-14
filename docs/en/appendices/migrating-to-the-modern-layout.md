# Migrating to the Modern Layout

The Piece of Cake 2 fork supports two application layouts:

- **Legacy layout**: the traditional CakePHP 2.x layout with an `app/`
  directory.
- **Modern layout**: a CakePHP 5.x-style layout with `config/`, `src/`,
  `templates/`, `tests/` and so on at the project root. The
  [pieceofcake2/app](https://github.com/pieceofcake2/app) skeleton uses it.

Both layouts work with the same framework version; you can stay on the legacy
layout, or move to the modern one gradually.

## Legacy and modern layouts

::: code-group

```text [Legacy (app/)]
your-project/
├── app/
│   ├── Config/          (uppercase, nested)
│   ├── Controller/
│   ├── Model/
│   ├── View/            (templates + helpers mixed)
│   ├── Test/
│   ├── Plugin/
│   ├── Vendor/
│   └── tmp/
│       └── logs/
├── vendors/
└── ...
```

```text [Modern (src/)]
your-project/
├── bin/
│   └── cake
├── config/              (lowercase, top-level)
├── src/                 (all PHP code)
│   ├── Controller/
│   ├── Model/
│   └── View/            (Helper classes only)
├── templates/           (all .ctp files, separated)
├── resources/
│   └── locales/
├── tests/               (lowercase, top-level)
├── plugins/             (Composer-managed)
├── vendor/              (standard Composer)
├── logs/                (separated from tmp/)
├── tmp/
└── webroot/
```

:::

## File migration map

| From (legacy)       | To (modern)                |
|---------------------|----------------------------|
| `app/Config/*`      | `config/*`                 |
| `app/Controller/*`  | `src/Controller/*`         |
| `app/Model/*`       | `src/Model/*`              |
| `app/View/**/*.ctp` | `templates/**/*.ctp`       |
| `app/View/Helper/*` | `src/View/Helper/*`        |
| `app/Console/*`     | `src/Console/*`            |
| `app/Console/cake`  | `bin/cake`                 |
| `app/Lib/*`         | `src/Lib/*`                |
| `app/Locale/*`      | `resources/locales/*`      |
| `app/Test/*`        | `tests/*`                  |
| `app/Plugin/*`      | `plugins/*` (use Composer) |
| `app/Vendor/*`      | `vendor/*` (use Composer)  |
| `app/tmp/logs/*`    | `logs/*`                   |
| `app/tmp/*`         | `tmp/*`                    |
| `app/webroot/*`     | `webroot/*`                |

Inside `tests/`, the modern layout uses `tests/TestCase/` and `tests/Fixture/`
instead of `Test/Case/` and `Test/Fixture/`. The test suite and fixture loader
detect both.

## How the framework finds the layout

The path constants are defined in the application's `config/define.php` and the
framework's own `config/define.php`. When a constant is not defined by the
application, the framework detects the layout:

- `CONFIG` is `ROOT/config/` if that directory exists, otherwise
  `ROOT/APP_DIR/Config/`.
- `TMP` is `ROOT/tmp/` if it exists, otherwise `APP/tmp/`.
- `LOGS` is `ROOT/logs/` when `ROOT/tmp/` exists, otherwise `TMP/logs/`.
- `TESTS` is `ROOT/tests/` if it exists, otherwise `APP/Test/`.
- Templates are also looked up in `ROOT/templates/`, and locales in
  `ROOT/resources/locales/`.

The modern skeleton's `config/define.php` sets, among others:

```php
define('ROOT', dirname(__DIR__));
define('APP_DIR', 'src'); // instead of 'app'
define('WEBROOT_DIR', 'webroot');
define('WWW_ROOT', ROOT . DS . WEBROOT_DIR . DS);
define('VENDORS', ROOT . DS . 'vendor' . DS);
```

`webroot/index.php`, `webroot/test.php` and `bin/cake` load this file. Your
existing application code (`App::uses()`, controllers, models, views) works
without modification in either layout.

## Gradual migration to CakePHP 5

Moving from CakePHP 2.x to 5.x in one step means changing code, folder
structure and APIs at the same time. The modern layout lets you split this into
smaller steps:

```text
Step 1: CakePHP 2.x with traditional structure
        ↓ (modernize folder structure only)
Step 2: CakePHP 2.x with CakePHP 5.x-style structure  ← you can stop here
        ↓ (upgrade code only)
Step 3: CakePHP 5.x with CakePHP 5.x-style structure
```

- Smaller, manageable changes: folder restructuring is separate from code changes.
- Each step can be tested before moving on.
- You can stay on Step 2 indefinitely.
- Smaller changes are easier for teams to review.

### Step 2: restructure on CakePHP 2.x

1. **Update `composer.json`**:

   ```json
   {
       "require": {
           "php": ">=8.0",
           "pieceofcake2/cakephp": "^2.12"
       },
       "autoload": {
           "classmap": ["src/"]
       },
       "config": {
           "vendor-dir": "vendor/",
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

   If your plugins were installed into `app/Plugin/`, the `installer-paths`
   setting now points to `plugins/`. Remove the plugins from `app/Plugin/` and
   run `composer install` to install them into `plugins/`.

2. **Update the bootstrap files**: copy `config/define.php`,
   `webroot/index.php`, `webroot/test.php` and `bin/cake` from
   [pieceofcake2/app](https://github.com/pieceofcake2/app).
3. **Move files** according to the [migration map](#file-migration-map). This
   can be done gradually, for example in this order:
   1. Configuration: `app/Config/*` → `config/*`
   2. PHP code: `app/Controller/*`, `app/Model/*` → `src/`
   3. Templates: `app/View/**/*.ctp` → `templates/`
   4. Tests: `app/Test/*` → `tests/`
   5. Dependencies: use Composer for plugins and vendors
4. **Verify** that the application still works.
5. **Optionally rely on Composer autoloading**: with `"classmap": ["src/"]`
   and after `composer dump-autoload`, you can remove `App::uses()` calls from
   your controllers, models, helpers and shells.

   ```php
   // Before
   App::uses('AppController', 'Controller');

   class UsersController extends AppController
   {
       // ...
   }

   // After (with Composer autoload)
   class UsersController extends AppController
   {
       // ...
   }
   ```

::: warning
Run `composer dump-autoload` every time you create a new class file. The
classmap must be regenerated before new classes can be found.
Plugins that don't support Composer autoloading still need `App::uses()` or
`CakePlugin::load()`.
:::

### Step 3: upgrade to CakePHP 5

With the folder structure already in place, the upgrade to CakePHP 5.x is
limited to code changes: require CakePHP 5.x in `composer.json`, update code
for the API changes, and fix compatibility issues. See the
[CakePHP 5.x Migration Guide](https://book.cakephp.org/5/en/appendices/5-0-migration-guide.html).
