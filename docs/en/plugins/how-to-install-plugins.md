# How To Install Plugins

The usual way to install a CakePHP plugin is with Composer. Plugins that are
not published as Composer packages can be copied into your application, or
added with Git.

But don't forget to [Enable Plugins](#enable-plugins) afterwards.

Plugins are installed in the `plugins/` directory at the root of your project.
CakePHP looks for plugins in `plugins/` and also in the application's
`Plugin/` directory (`app/Plugin/` in the legacy `app/` layout), so `plugins/`
works with both application layouts.

## Composer

If you aren't familiar with the dependency management tool named Composer,
take the time to read the
[Composer documentation](https://getcomposer.org/doc/00-intro.md).

Before installing a plugin, check [Repositories and Plugins](/plugins/maintained-plugins)
for a PHP 8 compatible fork. To install the DebugKit plugin, for example, run:

``` bash
composer require --dev pieceofcake2/debug_kit
```

or add it as a dependency to your project's `composer.json` and run
`composer update`:

``` json
{
    "require-dev": {
        "pieceofcake2/debug_kit": "^2.2"
    }
}
```

> [!NOTE]
> Use "require-dev" if you only want to include the plugin for your
> development environment, as in this example. Use "require" for plugins your
> application needs in production.

CakePHP 2 plugins are published as packages of the type `cakephp-plugin`,
which [composer/installers](https://github.com/composer/installers) installs
into a plugin directory rather than into `vendor/`. The following settings in
your `composer.json` are required so that each plugin is installed into
`plugins/<Name>/`. The [pieceofcake2/app](https://github.com/pieceofcake2/app)
skeleton already contains them:

``` json
{
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

Since Composer 2.2, Composer plugins only run when they are listed in
`config.allow-plugins`, so `composer/installers` must be allowed there. If it
is not allowed, the plugin ends up in `vendor/`. Without the `installer-paths`
setting, `composer/installers` puts the plugin in a `Plugin/` directory at the
project root. In both cases `CakePlugin::load()` cannot find the plugin.

In an application that uses the legacy `app/` layout, set the installer path to
`app/Plugin/` instead:

``` json
"extra": {
    "installer-paths": {
        "app/Plugin/{$name}/": ["type:cakephp-plugin"]
    }
}
```

## Manually

To install a plugin that is not available through Composer, copy the plugin
folder into your `plugins/` folder. If you're installing a plugin named
'ContactManager' then you should have a folder in `plugins/`
named 'ContactManager' under which are the plugin's View, Model,
Controller, webroot and any other directories.

## Git Clone

If the plugin you want to install is hosted as a Git repo, you can also clone it.
Let's assume the imaginary plugin 'ContactManager' is hosted on GitHub.
You could clone it by executing the following command in your `plugins/` folder:

``` bash
git clone https://github.com/example/contact-manager.git ContactManager
```

## Git Submodule

If the plugin you want to install is hosted as a Git repo,
but you prefer not to clone it, you can also integrate it as a Git submodule.
Execute the following commands in the root folder of your project:

``` bash
git submodule add https://github.com/example/contact-manager.git plugins/ContactManager
git submodule update --init
```

<a id="enable-plugins"></a>

## Enable the Plugin

Plugins need to be loaded manually in `config/bootstrap.php`
(`app/Config/bootstrap.php` in the legacy `app/` layout).

You can either load one by one or all of them in a single call:

``` php
CakePlugin::loadAll(); // Loads all plugins at once
CakePlugin::load('ContactManager'); // Loads a single plugin
```

`loadAll()` loads all plugins available, while allowing you to set certain
settings for specific plugins. `load()` works similarly, but only loads the
plugins you explicitly specify.

Classes of plugins that are autoloaded by Composer can be used right away.
For plugins that don't support Composer autoloading, load their classes with
`App::uses()` as before, for example
`App::uses('MyPluginHelper', 'MyPlugin.View/Helper');`. Check the plugin's
documentation to see which applies.
