<a id="plugin-shell"></a>

# Plugin Shell

The plugin shell allows you to load and unload plugins via the command prompt.
If you need help, run:

    bin/cake plugin --help

## Loading Plugins

Via the `Load` task you are able to load plugins in your
**config/bootstrap.php**. You can do this by running:

    bin/cake plugin load MyPlugin

This will add the following to your **src/Application.php**:

``` php
// In the bootstrap method add:
$this->addPlugin('MyPlugin');

// Prior to 3.6, add the following to config/bootstrap.php
Plugin::load('MyPlugin');
```

If you are loading a plugin that only provides CLI tools - like bake - you can
update your `bootstrap_cli.php` with:

    bin/cake plugin load --cli MyPlugin
    bin/cake plugin unload --cli MyPlugin

::: info Added in version 3.4.0
As of 3.4.0 the `--cli` option is supported
:::

## Unloading Plugins

You can unload a plugin by specifying its name:

    bin/cake plugin unload MyPlugin

This will remove the line `$this->addPlugin('MyPlugin',...)` from
**src/Application.php**.

## Plugin Assets

CakePHP by default serves plugins assets using the `AssetMiddleware` middleware.
While this is a good convenience, it is recommended to symlink / copy
the plugin assets under app's webroot so that they can be directly served by the
web server without invoking PHP. You can do this by running:

    bin/cake plugin assets symlink

Running the above command will symlink all plugins assets under app's webroot.
On Windows, which doesn't support symlinks, the assets will be copied in
respective folders instead of being symlinked.

You can symlink assets of one particular plugin by specifying its name:

    bin/cake plugin assets symlink MyPlugin
