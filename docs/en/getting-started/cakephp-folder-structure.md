# CakePHP Folder Structure

After you've created a new application from the
[pieceofcake2/app](https://github.com/pieceofcake2/app) skeleton (see
[Installation](../installation)), these are the files and folders you should
see:

- bin
- config
- logs
- plugins
- resources
- src
- templates
- tests
- tmp
- vendor
- webroot
- composer.json

You'll notice a few main folders:

- The *src*, *config* and *templates* folders will be where you work your
  magic: they're where your application's files will be placed.
- The *vendor* folder is managed by Composer. It contains CakePHP itself
  (`vendor/pieceofcake2/cakephp`) and any third-party PHP libraries you add
  with Composer. Make a personal commitment **not** to edit files in this
  folder. We can't help you if you've modified the core. Instead, look into
  modifying [Application Extensions](../getting-started/cakephp-structure#application-extensions).
- The *webroot* folder is the document root of your application.

## The Application Folders

Let's look a little closer at the folders of the application.

bin  
Contains the `cake` console script, which runs the shells of CakePHP and of
your application, for example `bin/cake server` or `bin/cake test`. For more
information see [Shells, Tasks & Console Tools](../console-and-shells).

config  
Holds the (few) configuration files CakePHP uses. Database
connection details, bootstrapping, core configuration files and
more should be stored here. `config/define.php` defines the paths of the
application folders.

logs  
CakePHP writes its log files here. See [Logging](../core-libraries/logging).

plugins  
Contains plugin packages. Plugins installed with Composer are placed here.

resources/locales  
Stores string files for internationalization.

src  
Contains the PHP code of your application:

- `src/Console/Command` contains the console commands (shells) and, in
  `Task/`, the console tasks for your application. `src/Console/Templates`
  can contain templates to customize the output of bake.
- `src/Controller` contains your application's controllers and, in
  `Component/`, their components.
- `src/Lib` contains libraries that do not come from 3rd parties or
  external vendors. This allows you to separate your organization's
  internal libraries from vendor libraries.
- `src/Model` contains your application's models and, in `Behavior/` and
  `Datasource/`, behaviors and datasources.
- `src/View/Helper` contains your application's helpers.

templates  
Presentational files are placed here: view files in a folder per controller
(for example `templates/Posts/index.ctp`), elements in `Elements/`, error pages
in `Errors/`, layouts in `Layouts/` and email templates in `Emails/`.

tests  
This directory contains all the test cases and test fixtures for your
application. The `tests/TestCase` directory should mirror your application and
contain one or more test cases per class in your application. Fixtures are
stored in `tests/Fixture`. For more information on test cases and test fixtures,
refer to the [Testing](../development/testing) documentation.

tmp  
This is where CakePHP stores temporary data. The actual data it
stores depends on how you have CakePHP configured, but this folder
is usually used to store model descriptions, cached views, and sometimes
session information.

Make sure that this folder exists and is writable,
or the performance of your application will be severely
impacted. In debug mode, CakePHP will warn you if the folder is
absent or not writable.

vendor  
Contains the packages installed by Composer, including CakePHP itself. Add
third-party libraries with `composer require` and they are autoloaded
through `vendor/autoload.php`. Don't edit or add files here by hand.

webroot  
In a production setup, this folder should serve as the document
root for your application. Folders here also serve as holding
places for CSS stylesheets, images, and JavaScript files.

## The Legacy `app/` Layout

Applications created with older versions of CakePHP 2 keep all of their code in
an `app/` folder. CakePHP supports this layout as well, and detects which
layout an application uses. The folders correspond as follows:

| Legacy (`app/`)           | Modern                             |
|---------------------------|------------------------------------|
| `app/Config`              | `config/`                          |
| `app/Console`             | `src/Console/`                     |
| `app/Console/cake`        | `bin/cake`                         |
| `app/Controller`          | `src/Controller/`                  |
| `app/Lib`                 | `src/Lib/`                         |
| `app/Locale`              | `resources/locales/`               |
| `app/Model`               | `src/Model/`                       |
| `app/Plugin`              | `plugins/`                         |
| `app/Test/Case`, `app/Test/Fixture` | `tests/TestCase/`, `tests/Fixture/` |
| `app/tmp`                 | `tmp/`                             |
| `app/tmp/logs`            | `logs/`                            |
| `app/Vendor`              | `vendor/` (managed by Composer)    |
| `app/View` (`.ctp` files) | `templates/`                       |
| `app/View/Helper`         | `src/View/Helper/`                 |
| `app/webroot`             | `webroot/`                         |

### Moving to the Modern Layout

You can move a legacy application to the modern layout gradually, while it
keeps running on CakePHP 2:

1. Copy `config/define.php`, `bin/cake`, `webroot/index.php` and
   `webroot/test.php` from the [pieceofcake2/app](https://github.com/pieceofcake2/app)
   skeleton. `config/define.php` sets `APP_DIR` to `src`.
2. Move your files according to the table above, for example configuration
   files first, then the PHP code in `src/`, then the templates, and finally
   the tests. The code itself, including `App::uses()` calls, does not need
   to change. Tests can stay in `app/Test/` for a while, because the test
   suite finds tests in both `Test/Case/` and `tests/TestCase/`.
3. Install plugins and third-party libraries with Composer instead of keeping
   them in `app/Plugin/` and `app/Vendor/`.
4. Optionally, add `"classmap": ["src/"]` to the `autoload` section of
   `composer.json` and run `composer dump-autoload`, so you can remove
   `App::uses()` calls for your own classes.

Because the modern layout matches the one used by CakePHP 5, moving to it first
lets you separate the folder restructuring from a later upgrade of the code.
