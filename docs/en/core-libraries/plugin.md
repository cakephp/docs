# Plugin Class

`class` Cake\\Core\\**Plugin**

The Plugin class is responsible for resource location and path management of plugins.

## Locating Plugins

### Plugin::path()

`static` Cake\\Core\\Plugin::**path**(string $plugin): string

Plugins can be located with Plugin. Using `Plugin::path('DebugKit');`
for example, will give you the full path to the DebugKit plugin:

``` php
$path = Plugin::path('DebugKit');
```

## Check if a Plugin is Loaded

You can check dynamically inside your code if a specific plugin has been loaded:

``` php
$isLoaded = Plugin::isLoaded('DebugKit');
```

Use `Plugin::loaded()` if you want to get a list of all currently loaded plugins.

## Finding Paths to Namespaces

### Plugin::classPath()

`static` Cake\\Core\\Plugin::**classPath**(string $plugin): string

Used to get the location of the plugin's class files:

``` php
$path = App::classPath('DebugKit');
```

## Finding Paths to Resources

### Plugin::templatePath()

`static` Cake\\Core\\Plugin::**templatePath**(string $plugin): string

The method returns the path to the plugins' templates:

``` php
$path = Plugin::templatePath('DebugKit');
```

The same goes for the config path:

``` php
$path = Plugin::configPath('DebugKit');
```
