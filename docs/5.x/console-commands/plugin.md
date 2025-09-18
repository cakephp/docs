<a id="plugin-shell"></a>

# Plugin Tool

The plugin tool allows you to load and unload plugins via the command prompt.
If you need help, run:

``` bash
bin/cake plugin --help
```

## Loading Plugins

Via the `Load` task you are able to load plugins in your
**config/bootstrap.php**. You can do this by running:

``` bash
bin/cake plugin load MyPlugin
```

This will add the following to your **src/Application.php**:

``` php
// In the bootstrap method add:
$this->addPlugin('MyPlugin');
```

## Unloading Plugins

You can unload a plugin by specifying its name:

``` bash
bin/cake plugin unload MyPlugin
```

This will remove the line `$this->addPlugin('MyPlugin',...)` from
**src/Application.php**.

## Plugin Assets

CakePHP by default serves plugins assets using the `AssetMiddleware` middleware.
While this is a good convenience, it is recommended to symlink / copy
the plugin assets under app's webroot so that they can be directly served by the
web server without invoking PHP. You can do this by running:

``` bash
bin/cake plugin assets symlink
```

Running the above command will symlink all plugins assets under app's webroot.
On Windows, which doesn't support symlinks, the assets will be copied in
respective folders instead of being symlinked.

You can symlink assets of one particular plugin by specifying its name:

``` bash
bin/cake plugin assets symlink MyPlugin
```
