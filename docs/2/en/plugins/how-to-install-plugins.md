# How To Install Plugins

There are four ways to install a CakePHP plugin:

- Through Composer
- Manually
- As Git Submodule
- By Git Cloning

But don't forget to [Enable Plugins](#enable-plugins) afterwards.

## Manually

To install a plugin manually, you just have to drop the plugin folder
into your app/Plugin/ folder. If you're installing a plugin named
'ContactManager' then you should have a folder in app/Plugin/
named 'ContactManager' under which are the plugin's View, Model,
Controller, webroot and any other directories.

## Composer

If you aren't familiar with the dependency management tool named Composer,
take the time to read the
[Composer documentation](https://getcomposer.org/doc/00-intro.md).

To install the imaginary plugin 'ContactManager' through Composer,
add it as dependency to your project's `composer.json`:

``` json
{
    "require": {
        "cakephp/contact-manager": "1.2.*"
    }
}
```

If a CakePHP plugin is of the type `cakephp-plugin`, as it should,
Composer will install it inside your /Plugin directory,
rather than in the usual vendors folder.

> [!NOTE]
> Consider using "require-dev" if you only want to include
> the plugin for your development environment.

Alternatively, you can use the
[Composer CLI tool to require](https://getcomposer.org/doc/03-cli.md#require)
(and install) plugins:

    php composer.phar require cakephp/contact-manager:1.2.*

## Git Clone

If the plugin you want to install is hosted as a Git repo, you can also clone it.
Let's assume the imaginary plugin 'ContactManager' is hosted on GitHub.
You could clone it by executing the following command in your app/Plugin/ folder:

    git clone git://github.com/cakephp/contact-manager.git ContactManager

## Git Submodule

If the plugin you want to install is hosted as a Git repo,
but you prefer not to clone it, you can also integrate it as a Git submodule.
Execute the following commands in your app folder:

    git submodule add git://github.com/cakephp/contact-manager.git Plugin/ContactManager
    git submodule init
    git submodule update

<a id="enable-plugins"></a>

## Enable the Plugin

Plugins need to be loaded manually in `app/Config/bootstrap.php`.

You can either load one by one or all of them in a single call:

``` css
CakePlugin::loadAll(); // Loads all plugins at once
CakePlugin::load('ContactManager'); // Loads a single plugin
```

`loadAll()` loads all plugins available, while allowing you to set certain
settings for specific plugins. `load()` works similarly, but only loads the
plugins you explicitly specify.
