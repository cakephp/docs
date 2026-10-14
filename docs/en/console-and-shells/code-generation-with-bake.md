# Code Generation with Bake

CakePHP's Bake console is another effort to get you up and running
in CakePHP – fast. The Bake console can create any of CakePHP's
basic ingredients: models, views and controllers. And we aren't
just talking skeleton classes: Bake can create a fully functional
application in just a few minutes. In fact, Bake is a natural step
to take once an application has been scaffolded.

## Installing Bake

Bake is provided by the [pieceofcake2/bake](https://github.com/pieceofcake2/bake)
plugin. Applications created from the pieceofcake2/app skeleton already have it
as a development dependency. Otherwise install it with Composer:

``` bash
composer require --dev pieceofcake2/bake
```

Composer installs the plugin into `plugins/Bake/`. This relies on the
`allow-plugins` and `installer-paths` settings in your `composer.json` described in
[Installing a plugin with Composer](/plugins/how-to-install-plugins#composer); the
pieceofcake2/app skeleton already has them. Load the plugin in your
`config/bootstrap.php`:

``` php
// config/bootstrap.php
CakePlugin::load('Bake');
```

Because Bake is a development dependency, it is not installed when you deploy
with `composer install --no-dev`. Loading a plugin that is not installed throws
a `MissingPluginException`, so make sure this line only runs where the plugin is
installed.

::: pieceofcake2
Bake is no longer part of the core. It must be installed
and loaded as the pieceofcake2/bake plugin before `bake` commands are available.
:::

## Running Bake

See [The CakePHP Console](../console-and-shells#the-cakephp-console) section for
instructions on how to use the CakePHP console in general. Bake is run from the
project root with `bin/cake bake`. The cake console is run using the PHP CLI
(command line interface). If you have problems running the script, ensure that
you have the PHP CLI installed and that it has the proper extensions enabled
(eg: `pdo_mysql`). If the database host is 'localhost' and the connection fails
from the command line, try '127.0.0.1' instead.

When running Bake for the first time, you'll be prompted to create
a Database Configuration file, if you haven't created one already.

After you've created a Database Configuration file, running Bake
will present you with the following options:

``` text
---------------------------------------------------------------
App : src
Path: /path-to/project/src/
---------------------------------------------------------------
Interactive Bake Shell
---------------------------------------------------------------
[D]atabase Configuration
[M]odel
[V]iew
[C]ontroller
[P]roject
[F]ixture
[T]est case
[Q]uit
What would you like to Bake? (D/M/V/C/P/F/T/Q)
>
```

Alternatively, you can run any of these commands directly from the
command line:

``` bash
$ bin/cake bake db_config
$ bin/cake bake model
$ bin/cake bake view
$ bin/cake bake controller
$ bin/cake bake project
$ bin/cake bake fixture
$ bin/cake bake test
$ bin/cake bake plugin plugin_name
$ bin/cake bake all
```

Use `bin/cake bake --help` to see all subcommands and options. For example,
`--connection` (`-c`) selects the database connection and `--theme` (`-t`)
selects a bake theme.

::: info Changed in version 2.5
Test files produced by `bake test` include calls to PHPUnit's `markTestIncomplete()` to draw attention to empty test methods. Before 2.5, empty tests pass silently.
:::

### Where baked files are written

Bake writes the generated files to the directories of your application's
layout:

| File type | Modern layout | Legacy layout |
|---|---|---|
| Models | `src/Model/` | `app/Model/` |
| Controllers | `src/Controller/` | `app/Controller/` |
| View templates | `templates/<Controller>/` | `app/View/<Controller>/` |
| Test cases | `tests/TestCase/<Type>/` | `app/Test/Case/<Type>/` |
| Fixtures | `tests/Fixture/` | `app/Test/Fixture/` |

For a plugin with a `tests/` directory, test cases and fixtures are written to
the plugin's `tests/TestCase/` and `tests/Fixture/`; otherwise to its
`Test/Case/` and `Test/Fixture/`.

::: info
These locations require pieceofcake2/bake 1.0.3 or later. Earlier versions
wrote view templates to `src/View/`, test cases to `tests/Case/` and fixtures
to `src/Test/Fixture/` in the modern layout, so the files had to be moved.
:::

`bake project` copies the legacy `app/` skeleton contained in the Bake plugin. To
start a new application with the modern layout, use
`composer create-project pieceofcake2/app` instead (see
[Installation](../installation)).

## Modify default HTML produced by "baked" templates

If you wish to modify the default HTML output produced by the
"bake" command, you create a bake theme. The default templates are in the Bake
plugin's `plugins/Bake/Console/Templates/default/` directory:

- `actions/` - controller actions
- `classes/` - controller, model, fixture and test classes
- `views/` - view templates (`index.ctp`, `view.ctp` and `form.ctp`)

Bake looks for themes in `src/Console/Templates/` of your application and in
`Console/Templates/` of each loaded plugin.

### For baking custom views

1.  Go into: `plugins/Bake/Console/Templates/default/views`
2.  Notice the 3 files there
3.  Copy them to your:
    `src/Console/Templates/[themename]/views`
4.  Make changes to the HTML output to control the way "bake" builds
    your views

The `[themename]` path segment should be the name of the bake
theme that you are creating. Bake theme names need to be unique, so
don't use 'default'. When more than one theme is available, Bake asks
which one to use, or you can choose it with the `--theme` option:

``` bash
bin/cake bake view Posts --theme myTheme
```

In the legacy layout, themes go into `app/Console/Templates/[themename]/`.

### For baking custom projects

1.  Go into: `plugins/Bake/Console/Templates/skel`
2.  Notice the base application files there
3.  Copy them to your:
    `src/Console/Templates/skel`
4.  Make changes to the HTML output to control the way "bake" builds
    your views
5.  Pass the skeleton path parameter to the project task

<!-- -->

    bin/cake bake project --skel src/Console/Templates/skel

> [!NOTE]
> - You must run the specific project task `bin/cake bake project` so
>   that the path parameter can be passed.
> - The template path is relative to the current path of the Command
>   Line Interface.
> - Since the full path to the skeleton needs to be manually
>   entered, you can specify any directory holding your template build
>   you want, including using multiple templates.
