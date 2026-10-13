# CakePHP Folder Structure

After you've downloaded and extracted CakePHP, these are the files
and folders you should see:

- app
- lib
- vendors
- plugins
- .htaccess
- index.php
- README

You'll notice three main folders:

- The *app* folder will be where you work your magic: it's where
  your application's files will be placed.
- The *lib* folder is where we've worked our magic. Make a
  personal commitment **not** to edit files in this folder. We can't
  help you if you've modified the core. Instead, look into modifying
  [Application Extensions](../getting-started/cakephp-structure#application-extensions).
- Finally, the *vendors* folder is where you'll place third-party
  PHP libraries you need to use with your CakePHP applications.

::: pieceofcake2 Directory layout
With the pieceofcake2 fork there is no archive to extract and no `lib/` folder.
CakePHP is installed by Composer into `vendor/pieceofcake2/cakephp` (framework
code in `src/Cake/`), and third-party libraries also go into `vendor/`. Two
application layouts are supported:

**Legacy layout** (the layout described on this page):

```text
your-project/
├── app/            (Config/, Controller/, Model/, View/, Test/, tmp/, webroot/, ...)
├── plugins/        (Composer-installed plugins)
├── vendor/         (Composer, including pieceofcake2/cakephp)
└── composer.json
```

**Modern layout** (CakePHP 5-style, see [pieceofcake2/app](https://github.com/pieceofcake2/app)):

```text
your-project/
├── bin/cake
├── config/         (configuration files)
├── src/            (all PHP code: Controller/, Model/, View/Helper/, Console/, Lib/)
├── templates/      (all .ctp view files)
├── resources/locales/
├── tests/          (TestCase/, Fixture/)
├── plugins/
├── vendor/
├── logs/
├── tmp/
├── webroot/        (document root)
└── composer.json
```

See [Directory Structure](/pieceofcake2/directory-structure) for details and a migration map.
:::

## The App Folder

CakePHP's *app* folder is where you will do most of your application
development. Let's look a little closer at the folders inside
*app*.

::: pieceofcake2 Modern layout
In the modern layout these folders are located as follows:

| Legacy (`app/`)          | Modern                       |
|--------------------------|------------------------------|
| `app/Config`             | `config/`                    |
| `app/Console`            | `src/Console/`               |
| `app/Controller`         | `src/Controller/`            |
| `app/Lib`                | `src/Lib/`                   |
| `app/Locale`             | `resources/locales/`         |
| `app/Model`              | `src/Model/`                 |
| `app/Plugin`             | `plugins/` (use Composer)    |
| `app/Test`               | `tests/` (`TestCase/`, `Fixture/`) |
| `app/tmp`                | `tmp/` (logs in `logs/`)     |
| `app/Vendor`             | `vendor/` (use Composer)     |
| `app/View` (`.ctp` files)| `templates/`                 |
| `app/View/Helper`        | `src/View/Helper/`           |
| `app/webroot`            | `webroot/`                   |

The framework detects both layouts automatically.
:::

Config  
Holds the (few) configuration files CakePHP uses. Database
connection details, bootstrapping, core configuration files and
more should be stored here.

Console  
Contains the console commands and console tasks for your application.
This directory can also contain a `Templates` directory to customize the
output of bake. For more information see [Shells, Tasks & Console Tools](../console-and-shells).

Controller  
Contains your application's controllers and their components.

Lib  
Contains libraries that do not come from 3rd parties or
external vendors. This allows you to separate your organization's
internal libraries from vendor libraries.

Locale  
Stores string files for internationalization.

Model  
Contains your application's models, behaviors, and datasources.

Plugin  
Contains plugin packages.

Test  
This directory contains all the test cases and test fixtures for your
application. The `Test/Case` directory should mirror your application and
contain one or more test cases per class in your application. For more
information on test cases and test fixtures, refer to the [Testing](../development/testing)
documentation.

tmp  
This is where CakePHP stores temporary data. The actual data it
stores depends on how you have CakePHP configured, but this folder
is usually used to store model descriptions, logs, and sometimes
session information.

Make sure that this folder exists and is writable,
or the performance of your application will be severely
impacted. In debug mode, CakePHP will warn you if the folder is
absent or not writable.

Vendor  
Any third-party classes or libraries should be placed here. Doing
so makes them easy to access using the App::import('vendor',
'name') function. Keen observers will note that this seems
redundant, as there is also a *vendors* folder at the top level of
our directory structure. We'll get into the differences between the
two when we discuss managing multiple applications and more complex
system setups.

View  
Presentational files are placed here: elements, error pages,
helpers, layouts, and view files.

webroot  
In a production setup, this folder should serve as the document
root for your application. Folders here also serve as holding
places for CSS stylesheets, images, and JavaScript files.
