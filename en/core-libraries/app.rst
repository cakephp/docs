App Class
#########

.. php:namespace:: Cake\Core

.. php:class:: App

The App class is responsible for resource location and path management.

Finding Classes
===============

.. php:staticmethod:: classname($name, $type = '', $suffix = '')

This method is used to resolve classnames throughout CakePHP. It resolves
the short form names CakePHP uses and returns the fully resolved classname::

    // Resolve a short classname with the namespace + suffix.
    App::classname('Auth', 'Controller/Component', 'Component');
    // Returns Cake\Controller\Component\AuthComponent

    // Resolve a plugin name.
    App::classname('DebugKit.Toolbar', 'Controller/Component', 'Component');
    // Returns DebugKit\Controller\Component\ToolbarComponent

    // Names with \ in them will be returned unaltered.
    App::classname('App\Cache\ComboCache');
    // Returns App\Cache\ComboCache

When resolving classes, the ``App`` namespace will be tried, and if the
class does not exist the ``Cake`` namespace will be attempted. If both
classnames do not exist, ``false`` will be returned.

Finding Paths to Namespaces
===========================

.. php:staticmethod:: path(string $package, string $plugin = null)

Used to get locations for paths based on conventions::

    // Get the path to Controller/ in your application
    App::path('Controller');

This can be done for all namespaces that are part of your application. You
can also fetch paths for a plugin::

    // Returns the component paths in DebugKit
    App::path('Component', 'DebugKit');

``App::path()`` will only return the default path, and will not be able to
provide any information about additional paths the autoloader is configured
for.

.. php:staticmethod:: core(string $package)

Used for finding the path to a package inside CakePHP::

    // Get the path to Cache engines.
    App::core('Cache/Engine');


Locating Plugins
================

.. php:staticmethod:: Plugin::path(string $plugin)

Plugins can be located with Plugin. Using ``Plugin::path('DebugKit');``
for example, will give you the full path to the DebugKit plugin::

    $path = Plugin::path('DebugKit');

Locating Themes
===============

Since themes are plugins, you can use the methods above to get the path to
a theme.

Loading Vendor Files
====================

Ideally vendor files should be autoloaded with ``Composer``, if you have vendor
files that cannot be autoloaded or installed with Composer you will need to use
``require`` to load them.

If you cannot install a library with Composer, it is best to install each library in
a directory following Composer's convention of ``vendor/$author/$package``.
If you had a library called AcmeLib, you could install it into
``vendor/Acme/AcmeLib``. Assuming it did not use PSR-0 compatible classnames
you could autoload the classes within it using ``classmap`` in your
application's ``composer.json``::

    "autoload": {
        "psr-4": {
            "App\\": "src/",
            "App\\Test\\": "tests/"
        },
        "classmap": [
            "vendor/Acme/AcmeLib"
        ]
    }

If your vendor library does not use classes, and instead provides functions, you
can configure Composer to load these files at the beginning of each request
using the ``files`` autoloading strategy::

    "autoload": {
        "psr-4": {
            "App\\": "src/",
            "App\\Test\\": "tests/"
        },
        "files": [
            "vendor/Acme/AcmeLib/functions.php"
        ]
    }

After configuring the vendor libraries you will need to regenerate your
application's autoloader using::

    $ php composer.phar dump-autoload

If you happen to not be using Composer in your application, you will need to
manually load all vendor libraries yourself.

.. meta::
    :title lang=en: App Class
    :keywords lang=en: compatible implementation,model behaviors,path management,loading files,php class,class loading,model behavior,class location,component model,management class,autoloader,classname,directory location,override,conventions,lib,textile,cakephp,php classes,loaded
