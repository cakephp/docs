# CakePHP Folder Structure

After you've downloaded the CakePHP application skeleton, there are a few top
level folders you should see:

- `bin/` holds the Cake console executables so you can execute e.g. `bin/cake bake all`.

- `config/` holds the [Configuration](../development/configuration) files.
  Database connection details, bootstrapping, core configuration files
  and more should be stored here.

- `plugins/` is where the [Plugins](../plugins) your application uses are stored.

- `logs/` contains your log files, can be adjusted via [Log Configuration](../core-libraries/logging.md#logging-configuration).

- `src/` will be where your application's source files like Controllers, Models, Commands etc. will be placed.

- `templates/` has presentational files placed here:
  elements, error pages, layouts, and view template files.

- `resources/` is primarily used for the `locales/` subfolder storing language files for static internationalization.

- `tests/` will be where you put the test cases for your application.

- `tmp/` is where CakePHP stores temporary data. The actual data it
  stores depends on how you have CakePHP configured, but this folder
  is usually used to store translation messages, model descriptions and sometimes
  session information.

- `vendor/` is where CakePHP and other application dependencies will
  be installed by [Composer](https://getcomposer.org). **Editing these files is not
  advised, as Composer will overwrite your changes next time you update.**

- `webroot/` is the public document root of your application. It
  contains all the files you want to be publicly reachable.

Make sure that the `tmp/` and `logs/` folders exist and are writable,
otherwise the performance of your application will be severely
impacted. In debug mode, CakePHP will warn you if these directories are not
writable.

## The src Folder

CakePHP's `src/` folder is where you will do most of your application
development. Let's look a little closer at the folders inside.

### Command

Contains your application's console commands. See
[Command Objects](../console-commands/commands) to learn more.

> [!NOTE]
> The folder `Command/` is not present by default.
> It will be auto generated when you create your first command using bake.

### Console

Contains the installation script executed by Composer.

### Controller

Contains your application's [Controllers](../controllers) and their components.

### Middleware

Stores any [Middleware](../controllers/middleware) for your application.

### Model

Contains your application's [Tables](../orm/table-objects.md), [Entities](../orm/entities.md) and [Behaviors](../orm/behaviors.md).

### View

Presentational classes are placed here: [Views](../views.md), [Cells](../views/cells.md), [Helpers](../views/helpers.md).
