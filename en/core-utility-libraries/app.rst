The App Class
#############

The app class is responsible for path management, class location and class loading. 
Make sure you follow the :ref:`file-and-classname-conventions`.

Packages
========

CakePHP is organized around the idea of packages, each class belongs to a
package or folder where other classes reside. You can configure each package
location in your application using ``App::build('APackage/SubPackage', $paths)``
to inform the framework where should each class be loaded. Almost every class in
the CakePHP framework can be swapped with your own compatible implementation. If
you wish to use you own class instead of the classes the framework provides,
just add the class to your libs folder emulating the directory location of where
CakePHP expects to find it.

For instance if you'd like to use your own HttpSocket class, put it under::

    app/libs/Network/Http/HttpSocket.php


New Class Loader
================

Although there has been a huge refactoring in how the classes are loaded, in very 
few occasions you will need to change your application code respect the way you were 
used to do it. The biggest change is the introduction of a new method::

    <?php
    App::uses('AuthComponent', 'Controller/Component');

We decided the function name to emulate PHP 5.3's ``use`` keyword, just as a way
of declaring where a classname should be located at. The first parameter of
:php:meth:`App::uses()` is the complete name of the class you intend to load,
and the second one, the package name (or namespace) where it belongs to. The
main difference with CakePHP 1.3's :php:meth:`App::import()` is that the former
won't actually import the class, it will just setup the system so when the class
is used for the first time it will be located.

Some examples on using :php:meth:`App::uses()` when migrating from
:php:meth:`App::import()`::

    <?php
    App::import('Controller', 'Pages');
    // becomes 
    App::uses('PagesController', 'Controller');

    App::import('Component', 'Email');
    // becomes 
    App::uses('EmailComponent', 'Controller/Component');

    App::import('View', 'Media');
    // becomes 
    App::uses('MediaView', 'View');

    App::import('Core', 'Xml');
    // becomes 
    App::uses('Xml', 'Utility');

    App::import('Datasource', 'MongoDb.MongoDbSource')
    // becomes 
    App::uses('MongoDbSource', 'MongoDb.Model/Datasource')

All classes that were loaded in the past using ``App::import('Core', $class);``
will need to be loaded using ``App::uses()`` referring to the correct package.
See the api to locate the class in their new folder. Some examples::

    <?php
    App::import('Core', 'CakeRoute');
    // becomes 
    App::uses('CakeRoute', 'Routing/Route');

    App::import('Core', 'Sanitize');
    // becomes
    App::uses('Sanitize', 'Utility');

    App::import('Core', 'HttpSocket');
    // becomes 
    App::uses('HttpSocket', 'Network/Http');

In contrast to how :php:meth:`App::import()` worked in the past, the new class
loader will not locate classes recursively. This led to an impressive
performance gain even on develop mode, at the cost of some seldom used features
that always caused side effects. To be clear again, the class loader will only
fetch the classes exactly in the package you told to find it.


.. php:class:: App

Finding paths to packages using App::path()
===========================================

.. php:staticmethod:: path($package, $plugin = null)

    Used to read information stored path::

        <?php
        App::path('Model'); will return all paths for models

    .. versionadded:: 2.0:

    1. The method now supports plugins, ``App::path('Controller', 'Users')``
       will return the folder location for the controllers in the User plugin.

    2. Won't core paths anymore, it will only return paths defined in
       :php:meth:`App::build()` or default ones in app (or correspondent plugin).

    3. The App class had the following properties removed, use method
       :php:meth:`App::path()` to access their value::

            <?php
            App::$models
            App::$behaviors
            App::$controllers
            App::$components
            App::$datasources
            App::$libs
            App::$views
            App::$helpers
            App::$plugins
            App::$vendors
            App::$locales
            App::$shells


Adding paths for App to find packages in
========================================

.. php:staticmethod:: build($paths = array(), $mode = App::PREPEND)

    Sets up each package location on the file system. You can configure multiple
    search paths for each package, those will be used to look for files one
    folder at a time in the specified order.  All paths should be terminated
    with a Directory separator.

    Adding additional controller paths for example would alter where CakePHP
    looks for controllers.  This allows you to split your application up across
    the filesystem.

    Usage::

        <?php
        //will setup a new search path for the Model package
        App::build(array(Model' => array('/a/full/path/to/models/'))); 

        //will setup the path as the only valid path for searching models
        App::build(array('Model' => array('/path/to/models/')), App::RESET); 

        //will setup multiple search paths for helpers
        App::build(array('View/Helper' => array('/path/to/helpers/', '/another/path/))); 


    If reset is set to true, all loaded plugins will be forgotten and they will
    be needed to be loaded again.

    .. versionchanged:: 2.0

    Will not merge app paths with core paths anymore.

    Examples::

        <?php
        App::build(array('controllers' => array('/full/path/to/controllers'))) 
        //becomes 
        App::build(array('Controller' => array('/full/path/to/Controller')))

        App::build(array('helpers' => array('/full/path/to/controllers'))) 
        //becomes 
        App::build(array('View/Helper' => array('/full/path/to/View/Helper')))


Finding which objects CakePHP knows about
=========================================

.. php:staticmethod:: objects($type, $path = null, $cache = true)

    Returns an array of objects of the given type.

    You can find out which objects App knows about using
    ``App::objects('Controller')`` for example to find which application controllers
    App knows about.

    Example usage::

        <?php
        App::objects('plugin'); //returns array('DebugKit', 'Blog', 'User');
        App::objects('Controller'); //returns array('PagesController', 'BlogController');


    You can also search only within a plugin's objects by using the plugin dot syntax.::

        <?php
        App::objects('MyPlugin.Model'); //returns array('MyPluginPost', 'MyPluginComment');

    .. versionchanged:: 2.0

    1. Returns ``array()`` instead of false for empty results or invalid types
    2. Does not return core objects anymore, ``App::objects('core')`` will
       return ``array()``.
    3. Returns the complete class name


Locating plugins
================

.. php:staticmethod:: pluginPath($plugin)

    Plugins can be located with App as well. Using ``App::pluginPath('DebugKit');``
    for example, will give you the full path to the DebugKit plugin.

Locating themes
===============

.. php:staticmethod:: themePath($theme)

    Themes can be found ``App::themePath('purple');``, would give the full path to the
    `purple` theme.

.. _app-import:

Including files with App::import()
==================================

.. php:staticmethod:: import($type, $name, $parent, $search, $file, $return)

    At first glance ``App::import`` seems complex, however in most use
    cases only 2 arguments are required.

    .. note::

        This method is equivalent to ``require``'ing the file.
        It is important to realize that the class subsequently needs to be initialized.

    ::

        <?php
        // The same as require('controllers/users_controller.php');
        App::import('Controller', 'Users');
        
        // We need to load the class
        $Users = new UsersController;
        
        // If we want the model associations, components, etc to be loaded
        $Users->constructClasses();
        ?>

    **All classes that were loaded in the past using App::import('Core', $class) will need to be 
    loaded using App::uses() referring to the correct package. This change has provided large
    perfomance gains to the framework.**

    .. versionchanged:: 2.0

    * The method no longer looks for classes recursively, it stricty uses the values for the 
      paths defined in :php:meth:`App::build()`
    * It will not be able to load ``App::import('Component', 'Component')`` use
      ``App::uses('Component', 'Controller');``;
    * Using ``App::import('Lib', 'CoreClass');`` to load core classes is no longer possible.
    * Importing a non-existent file, supplying a wrong type or package name, or
      null values for ``$name`` and ``$file`` parameters will result in a false return
      value
    * ``App::import('Core', 'CoreClass')`` is not loger supported, use
      :php:meth:`App::uses()` instead and let the class autoloading do the rest
    * Loading Vendor files does not look recursively in the vendors folder, it
      will also not convert anymore the file to underscored as it did on the
      past

Importing Controllers, Models, Behaviors, and Helpers
-----------------------------------------------------------------

All application related classes should be loaded with :php:meth:`App::uses()`.
The following examples illustrate how to do so.

Loading Controllers
~~~~~~~~~~~~~~~~~~~

Controller
    ``App::uses('PostsController', 'Controller');``
Model
    ``App::import('Model', 'MyModel');``
Behaviors
    ``App::import('Behavior', 'Tree');``
Helpers
    ``App::import('Helper', 'Html');``
Loading from plugins
    Loading classes in plugins works much the same as loading app and
    core classes except you must specify the plugin you are loading
    from::

        <?php
        App::import('Model', 'PluginName.Comment');

To load ``APP/Plugin/PluginName/Vendor/flickr/flickr.php``::

    <?php
    App::import('Vendor', 'PluginName.flickr/flickr');

Loading Vendor Files
--------------------

The following examples illustrate how to load vendor files from a
number of path structures. These vendor files could be located in
any of the vendor folders.

Vendor examples
~~~~~~~~~~~~~~~

To load **vendors/geshi.php**

::

    App::import('Vendor', 'geshi');

.. note::

    The geishi file must be a lower-case file name as Cake will not
    find it otherwise.

To load **vendors/flickr/flickr.php**

::

    App::import('Vendor', 'flickr/flickr');

To load **vendors/some.name.php**

::

    App::import('Vendor', 'SomeName', array('file' => 'some.name.php'));

To load **vendors/services/well.named.php**

::

    App::import('Vendor', 'WellNamed', array('file' => 'services'.DS.'well.named.php'));

It wouldn't make a difference if your vendor files are inside your
/app/vendors directory. Cake will automatically find it.

To load **app/vendors/vendorName/libFile.php**

::

    App::import('Vendor', 'aUniqueIdentifier', array('file' =>'vendorName'.DS.'libFile.php'));

.. todo::

    This is missing a ton of methods. And vendors docs are wrong.
