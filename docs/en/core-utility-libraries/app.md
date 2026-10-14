# App Class

`class` **App**

The app class is responsible for path management, class location and class loading.
Make sure you follow the [File And Classname Conventions](../getting-started/cakephp-conventions#file-and-classname-conventions).

## Packages

CakePHP is organized around the idea of packages, each class belongs to a
package or folder where other classes reside. You can configure each package
location in your application using `App::build('APackage/SubPackage', $paths)`
to inform the framework where should each class be loaded. Almost every class in
the CakePHP framework can be swapped with your own compatible implementation. If
you wish to use your own class instead of the classes the framework provides,
just add the class to your libs folder emulating the directory location of where
CakePHP expects to find it.

For instance if you'd like to use your own HttpSocket class, put it under:

    src/Lib/Network/Http/HttpSocket.php

and register it with `App::uses()` as described in
[Overriding classes in CakePHP](#overriding-classes-in-cakephp). App will then
load your override file instead of the file inside CakePHP.

## Loading classes

`static` App::**uses**(string $class, string $package)

Return type: `void`

Classes are lazily loaded in CakePHP. CakePHP's own classes are loaded by
Composer's classmap autoloader, so you never need to declare them. The same
applies to your application classes when your `composer.json` has a classmap
for them, as in the application skeleton:

``` json
"autoload": {
    "classmap": ["src/"]
}
```

With a classmap, run `composer dump-autoload` after adding a new class file.

`App::uses()` is needed for classes that Composer does not know about: your
application classes when you don't use a classmap, and classes of plugins that
don't support Composer autoloading. By telling App which package a class can be
found in, it can properly locate the file and load it the first time a class
is used.

::: pieceofcake2
Framework classes are loaded by Composer's
classmap autoloader and no longer call `App::uses()` for each other. Existing
`App::uses()` calls keep working. See the [migration guide](/appendices/migrating-from-cakephp-2-10).
:::

Some examples for common types of classes are:

Console Commands  
`App::uses('AppShell', 'Console/Command');`

Console Tasks  
`App::uses('ImportTask', 'Console/Command/Task');`

Controllers  
`App::uses('PostsController', 'Controller');`

Components  
`App::uses('AuthComponent', 'Controller/Component');`

Models  
`App::uses('MyModel', 'Model');`

Behaviors  
`App::uses('TreeBehavior', 'Model/Behavior');`

Views  
`App::uses('ThemeView', 'View');`

Helpers  
`App::uses('HtmlHelper', 'View/Helper');`

Libs  
`App::uses('PaymentProcessor', 'Lib');`

Vendors  
`App::uses('Textile', 'Vendor');`

Utilities  
`App::uses('CakeText', 'Utility');`

So basically the second param should simply match the folder path of the class file in core or app.

> [!NOTE]
> Third-party libraries are normally installed and autoloaded with Composer,
> so you don't need `App::uses()` or `App::import()` for them. For the few
> files that are not available through Composer and do not follow
> conventions, use `App::import()`.

### Loading files from plugins

Loading classes in plugins works much the same as loading app and
core classes except you must specify the plugin you are loading
from:

``` php
// Load the class Comment in plugins/PluginName/Model/Comment.php
App::uses('Comment', 'PluginName.Model');

// Load the class CommentComponent in
// plugins/PluginName/Controller/Component/CommentComponent.php
App::uses('CommentComponent', 'PluginName.Controller/Component');
```

## Finding paths to packages using App::path()

`static` App::**path**(string $package, string $plugin = null)

Return type: `array`

Used to read information stored path:

``` php
// return the model paths in your application
App::path('Model');
```

This can be done for all packages that are apart of your application. You
can also fetch paths for a plugin:

``` php
// return the component paths in DebugKit
App::path('Component', 'DebugKit');
```

`static` App::**paths**( )

Return type: `array`

Get all the currently loaded paths from App. Useful for inspecting or
storing all paths App knows about. For a paths to a specific package
use `App::path()`

`static` App::**core**(string $package)

Return type: `array`

Used for finding the path to a package inside CakePHP:

``` php
// Get the path to Cache engines.
App::core('Cache/Engine');
```

`static` App::**location**(string $className)

Return type: `string`

Returns the package name where a class was defined to be located at.

## Adding paths for App to find packages in

`static` App::**build**(array $paths = [], mixed $mode = App::PREPEND)

Return type: `void`

Sets up each package location on the file system. You can configure multiple
search paths for each package, those will be used to look for files one
folder at a time in the specified order. All paths must be terminated
with a directory separator.

Adding additional controller paths for example would alter where CakePHP
looks for controllers. This allows you to split your application up across
the filesystem.

Usage:

``` php
//will setup a new search path for the Model package
App::build(['Model' => ['/a/full/path/to/models/']]);

//will setup the path as the only valid path for searching models
App::build(['Model' => ['/path/to/models/']], App::RESET);

//will setup multiple search paths for helpers
App::build([
    'View/Helper' => ['/path/to/helpers/', '/another/path/'],
]);
```

If reset is set to true, all loaded plugins will be forgotten and they will
be needed to be loaded again. Package names are the folder names, such as
`Controller` or `View/Helper`. `App::build()` does not merge app paths with
core paths.

<a id="app-build-register"></a>

### Add new packages to an application

`App::build()` can be used to add new package locations. This is useful
when you want to add new top level packages or, sub-packages to your
application:

``` php
App::build([
    'Service' => ['%s' . 'Service' . DS],
], App::REGISTER);
```

The `%s` in newly registered packages will be replaced with the
`APP` path. You must include a trailing `/` in registered
packages. Once packages are registered, you can use `App::build()` to
append/prepend/reset paths like any other package.

::: info Changed in version 2.1
Registering packages was added in 2.1
:::

## Finding which objects CakePHP knows about

`static` App::**objects**(string $type, mixed $path = null, boolean $cache = true)

Return type: `mixed`. Returns an array of objects of the given type or false if incorrect.

You can find out which objects App knows about using
`App::objects('Controller')` for example to find which application controllers
App knows about.

Example usage:

``` php
//returns ['DebugKit', 'Blog', 'User'];
App::objects('plugin');

//returns ['PagesController', 'BlogController'];
App::objects('Controller');
```

You can also search only within a plugin's objects by using the plugin dot syntax.

``` php
// returns ['MyPluginPost', 'MyPluginComment'];
App::objects('MyPlugin.Model');
```

`App::objects()` returns the complete class names. It returns `[]` for empty
results or invalid types, and it does not return core objects
(`App::objects('core')` returns `[]`).

## Locating plugins

`static` App::**pluginPath**(string $plugin)

Return type: `string`

Plugins can be located with App as well. Using `App::pluginPath('DebugKit');`
for example, will give you the full path to the DebugKit plugin:

``` php
$path = App::pluginPath('DebugKit');
```

## Locating themes

`static` App::**themePath**(string $theme)

Return type: `string`

Themes can be found `App::themePath('purple');`, would give the full path to the
`purple` theme.

<a id="app-import"></a>

## Including files with App::import()

`static` App::**import**(mixed $type = null, string $name = null, mixed $parent = true, array $search = [], string $file = null, boolean $return = false)

Return type: `boolean`

At first glance `App::import` seems complex, however in most use
cases only 2 arguments are required.

> [!NOTE]
> This method is equivalent to `require`'ing the file.
> It is important to realize that the class subsequently needs to be initialized.

``` php
// The same as require('Controller/UsersController.php');
App::import('Controller', 'Users');

// We need to load the class
$Users = new UsersController();

// If we want the model associations, components, etc to be loaded
$Users->constructClasses();
```

Keep in mind:

- The method does not look for files recursively, it strictly uses the
  paths defined in `App::build()`.
- It cannot load core classes; they are autoloaded.
- Importing a non-existent file, supplying a wrong type or package name, or
  null values for `$name` and `$file` parameters will result in a false return
  value.
- Loading Vendor files does not look recursively in the vendors folder, and
  the file name is not converted to underscored form.

## Overriding classes in CakePHP

You can override almost every class in the framework, exceptions are the
`App` and `Configure` classes. Whenever you like to
perform such overriding, add your class to your `src/Lib` folder
(`app/Lib` in the legacy layout) mimicking the internal structure of the
framework, and register it with `App::uses()` before the class is first used,
for example in `config/bootstrap.php`. Some examples to follow:

- To override the `Dispatcher` class, create `src/Lib/Routing/Dispatcher.php`
  and call `App::uses('Dispatcher', 'Routing');`
- To override the `CakeRoute` class, create `src/Lib/Routing/Route/CakeRoute.php`
  and call `App::uses('CakeRoute', 'Routing/Route');`
- To override the `Model` class, create `src/Lib/Model/Model.php`
  and call `App::uses('Model', 'Model');`

`App::load()` is registered in front of Composer's autoloader. For classes
registered with `App::uses()`, it searches your application's folders,
including `src/Lib`, before the core, so your files are loaded instead of the
built-in core ones. Without the `App::uses()` call the
core class is loaded by Composer. If your `composer.json` has a classmap for
`src/`, exclude the override files with `exclude-from-classmap` to avoid
Composer's "Ambiguous class resolution" warning.

::: pieceofcake2
Because the framework no longer calls
`App::uses()` for its own classes, an override in `src/Lib` is used only when
your application registers it with `App::uses()`. Check your overrides after
upgrading.
:::

## Loading Vendor Files

Libraries installed with Composer are autoloaded and need no extra code. This
section applies to files that you copy into your project by hand. Put them in
the `vendors/` directory of your project (`app/Vendor/` in the legacy layout),
which Composer does not manage.

You can use `App::uses()` to load classes in vendors directories. It follows
the same conventions as loading other files:

``` php
// Load the class Geshi in vendors/Geshi.php
App::uses('Geshi', 'Vendor');
```

To load classes in subdirectories, you'll need to add those paths
with `App::build()`:

``` php
// Load the class ClassInSomePackage in
// vendors/SomePackage/ClassInSomePackage.php
App::build(['Vendor' => [ROOT . DS . 'vendors' . DS . 'SomePackage' . DS]]);
App::uses('ClassInSomePackage', 'Vendor');
```

Your vendor files may not follow conventions, have a class that differs from
the file name or does not contain classes. You can load those files using
`App::import()`. The following examples illustrate how to load vendor
files from a number of path structures. These vendor files could be located in
any of the vendor folders.

To load **vendors/geshi.php**:

``` php
App::import('Vendor', 'geshi');
```

> [!NOTE]
> The geshi file must be a lower-case file name as CakePHP will not
> find it otherwise.

To load **vendors/flickr/flickr.php**:

``` php
App::import('Vendor', 'flickr', ['file' => 'flickr/flickr.php']);
```

To load **vendors/some.name.php**:

``` php
App::import('Vendor', 'SomeName', ['file' => 'some.name.php']);
```

To load **vendors/services/well.named.php**:

``` php
App::import(
    'Vendor',
    'WellNamed',
    ['file' => 'services' . DS . 'well.named.php'],
);
```

To load **plugins/Awesome/Vendor/services/well.named.php**:

``` php
App::import(
    'Vendor',
    'Awesome.WellNamed',
    ['file' => 'services' . DS . 'well.named.php'],
);
```

To load **plugins/Awesome/Vendor/Folder/Foo.php**:

``` php
App::import(
    'Vendor',
    'Awesome.Foo',
    ['file' => 'Folder' . DS . 'Foo.php'],
);
```

Vendor files in `src/Vendor/` are found as well.

To load **vendors/vendorName/libFile.php**:

``` php
App::import(
    'Vendor',
    'aUniqueIdentifier',
    ['file' => 'vendorName' . DS . 'libFile.php'],
);
```

## App Init/Load/Shutdown Methods

`static` App::**init**( )

Return type: `void`

Initializes the cache for App, registers a shutdown function.

`static` App::**load**(string $className)

Return type: `boolean`

Method to handle the automatic class loading. It will look for each class'
package defined using `App::uses()` and with this information it
will resolve the package name to a full path to load the class from. File
name for each class should follow the class name. For instance, if a class
is name `MyCustomClass` the file name should be `MyCustomClass.php`

`static` App::**shutdown**( )

Return type: `void`

Object destructor. Writes cache file if changes have been made to the
`$_map`.
