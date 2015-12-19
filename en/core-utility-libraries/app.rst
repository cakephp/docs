App Class
#########

.. php:class:: App

The app class is responsible for path management, class location and class loading.
Make sure you follow the :ref:`file-and-classname-conventions`.

Packages
========

CakePHP is organized around the idea of packages, each class belongs to a
package or folder where other classes reside. You can configure each package
location in your application using ``App::build('APackage/SubPackage', $paths)``
to inform the framework where should each class be loaded. Almost every class in
the CakePHP framework can be swapped with your own compatible implementation. If
you wish to use your own class instead of the classes the framework provides,
just add the class to your libs folder emulating the directory location of where
CakePHP expects to find it.

For instance if you'd like to use your own HttpSocket class, put it under::

    app/Lib/Network/Http/HttpSocket.php

Once you've done this App will load your override file instead of the file
inside CakePHP.

Loading classes
===============

.. php:staticmethod:: uses(string $class, string $package)

    :rtype: void

    Classes are lazily loaded in CakePHP, however before the autoloader
    can find your classes you need to tell App, where it can find the files.
    By telling App which package a class can be found in, it can properly locate
    the file and load it the first time a class is used.

    Some examples for common types of classes are:

    Console Commands
        ``App::uses('AppShell', 'Console/Command');``
    Console Tasks
        ``App::uses('BakeTask', 'Console/Command/Task');``
    Controllers
        ``App::uses('PostsController', 'Controller');``
    Components
        ``App::uses('AuthComponent', 'Controller/Component');``
    Models
        ``App::uses('MyModel', 'Model');``
    Behaviors
        ``App::uses('TreeBehavior', 'Model/Behavior');``
    Views
        ``App::uses('ThemeView', 'View');``
    Helpers
        ``App::uses('HtmlHelper', 'View/Helper');``
    Libs
        ``App::uses('PaymentProcessor', 'Lib');``
    Vendors
        ``App::uses('Textile', 'Vendor');``
    Utilities
        ``App::uses('CakeText', 'Utility');``

    So basically the second param should simply match the folder path of the class file in core or app.

.. note::

    Loading vendors usually means you are loading packages that do not follow
    conventions. For most vendor packages using ``App::import()`` is
    recommended.

Loading files from plugins
--------------------------

Loading classes in plugins works much the same as loading app and
core classes except you must specify the plugin you are loading
from::

    // Load the class Comment in app/Plugin/PluginName/Model/Comment.php
    App::uses('Comment', 'PluginName.Model');

    // Load the class CommentComponent in
    // app/Plugin/PluginName/Controller/Component/CommentComponent.php
    App::uses('CommentComponent', 'PluginName.Controller/Component');


Finding paths to packages using App::path()
===========================================

.. php:staticmethod:: path(string $package, string $plugin = null)

    :rtype: array

    Used to read information stored path::

        // return the model paths in your application
        App::path('Model');

    This can be done for all packages that are apart of your application. You
    can also fetch paths for a plugin::

        // return the component paths in DebugKit
        App::path('Component', 'DebugKit');

.. php:staticmethod:: paths( )

    :rtype: array

    Get all the currently loaded paths from App. Useful for inspecting or
    storing all paths App knows about. For a paths to a specific package
    use :php:meth:`App::path()`

.. php:staticmethod:: core(string $package)

    :rtype: array

    Used for finding the path to a package inside CakePHP::

        // Get the path to Cache engines.
        App::core('Cache/Engine');

.. php:staticmethod:: location(string $className)

    :rtype: string

    Returns the package name where a class was defined to be located at.

Adding paths for App to find packages in
========================================

.. php:staticmethod:: build(array $paths = array(), mixed $mode = App::PREPEND)

    :rtype: void

    Sets up each package location on the file system. You can configure multiple
    search paths for each package, those will be used to look for files one
    folder at a time in the specified order. All paths must be terminated
    with a directory separator.

    Adding additional controller paths for example would alter where CakePHP
    looks for controllers. This allows you to split your application up across
    the filesystem.

    Usage::

        //will setup a new search path for the Model package
        App::build(array('Model' => array('/a/full/path/to/models/')));

        //will setup the path as the only valid path for searching models
        App::build(array('Model' => array('/path/to/models/')), App::RESET);

        //will setup multiple search paths for helpers
        App::build(array(
            'View/Helper' => array('/path/to/helpers/', '/another/path/')
        ));


    If reset is set to true, all loaded plugins will be forgotten and they will
    be needed to be loaded again.

    Examples::

        App::build(array('controllers' => array('/full/path/to/controllers/')));
        //becomes
        App::build(array('Controller' => array('/full/path/to/Controller/')));

        App::build(array('helpers' => array('/full/path/to/views/helpers/')));
        //becomes
        App::build(array('View/Helper' => array('/full/path/to/View/Helper/')));

    .. versionchanged:: 2.0
        ``App::build()`` will not merge app paths with core paths anymore.


.. _app-build-register:

Add new packages to an application
----------------------------------

``App::build()`` can be used to add new package locations. This is useful
when you want to add new top level packages or, sub-packages to your
application::

    App::build(array(
        'Service' => array('%s' . 'Service' . DS)
    ), App::REGISTER);

The ``%s`` in newly registered packages will be replaced with the
:php:const:`APP` path. You must include a trailing ``/`` in registered
packages. Once packages are registered, you can use ``App::build()`` to
append/prepend/reset paths like any other package.

.. versionchanged:: 2.1
    Registering packages was added in 2.1

Finding which objects CakePHP knows about
=========================================

.. php:staticmethod:: objects(string $type, mixed $path = null, boolean $cache = true)

    :rtype: mixed Returns an array of objects of the given type or false if incorrect.

    You can find out which objects App knows about using
    ``App::objects('Controller')`` for example to find which application controllers
    App knows about.

    Example usage::

        //returns array('DebugKit', 'Blog', 'User');
        App::objects('plugin');

        //returns array('PagesController', 'BlogController');
        App::objects('Controller');

    You can also search only within a plugin's objects by using the plugin dot syntax. ::

        // returns array('MyPluginPost', 'MyPluginComment');
        App::objects('MyPlugin.Model');

    .. versionchanged:: 2.0

    1. Returns ``array()`` instead of false for empty results or invalid types
    2. Does not return core objects anymore, ``App::objects('core')`` will
       return ``array()``.
    3. Returns the complete class name

Locating plugins
================

.. php:staticmethod:: pluginPath(string $plugin)

    :rtype: string

    Plugins can be located with App as well. Using ``App::pluginPath('DebugKit');``
    for example, will give you the full path to the DebugKit plugin::

        $path = App::pluginPath('DebugKit');

Locating themes
===============

.. php:staticmethod:: themePath(string $theme)

    :rtype: string

    Themes can be found ``App::themePath('purple');``, would give the full path to the
    `purple` theme.

.. _app-import:

Including files with App::import()
==================================

.. php:staticmethod:: import(mixed $type = null, string $name = null, mixed $parent = true, array $search = array(), string $file = null, boolean $return = false)

    :rtype: boolean

    At first glance ``App::import`` seems complex, however in most use
    cases only 2 arguments are required.

    .. note::

        This method is equivalent to ``require``'ing the file.
        It is important to realize that the class subsequently needs to be initialized.

    ::

        // The same as require('Controller/UsersController.php');
        App::import('Controller', 'Users');

        // We need to load the class
        $Users = new UsersController();

        // If we want the model associations, components, etc to be loaded
        $Users->constructClasses();

    **All classes that were loaded in the past using App::import('Core', $class) will need to be
    loaded using App::uses() referring to the correct package. This change has provided large
    performance gains to the framework.**

    .. versionchanged:: 2.0

    * The method no longer looks for classes recursively, it strictly uses the values for the
      paths defined in :php:meth:`App::build()`
    * It will not be able to load ``App::import('Component', 'Component')`` use
      ``App::uses('Component', 'Controller');``.
    * Using ``App::import('Lib', 'CoreClass');`` to load core classes is no longer possible.
    * Importing a non-existent file, supplying a wrong type or package name, or
      null values for ``$name`` and ``$file`` parameters will result in a false return
      value.
    * ``App::import('Core', 'CoreClass')`` is no longer supported, use
      :php:meth:`App::uses()` instead and let the class autoloading do the rest.
    * Loading Vendor files does not look recursively in the vendors folder, it
      will also not convert the file to underscored anymore as it did in the
      past.

Overriding classes in CakePHP
=============================

You can override almost every class in the framework, exceptions are the
:php:class:`App` and :php:class:`Configure` classes. Whenever you like to
perform such overriding, just add your class to your ``app/Lib`` folder mimicking
the internal structure of the framework. Some examples to follow:

* To override the :php:class:`Dispatcher` class, create ``app/Lib/Routing/Dispatcher.php``
* To override the :php:class:`CakeRoute` class, create ``app/Lib/Routing/Route/CakeRoute.php``
* To override the :php:class:`Model` class, create ``app/Lib/Model/Model.php``

When you load the overridden classes now, the files in ``app/Lib`` will be loaded
instead of the built-in core ones.

Loading Vendor Files
====================

You can use ``App::uses()`` to load classes in vendors directories. It follows
the same conventions as loading other files::

    // Load the class Geshi in app/Vendor/Geshi.php
    App::uses('Geshi', 'Vendor');

To load classes in subdirectories, you'll need to add those paths
with ``App::build()``::

    // Load the class ClassInSomePackage in
    // app/Vendor/SomePackage/ClassInSomePackage.php
    App::build(array('Vendor' => array(APP . 'Vendor' . DS . 'SomePackage' . DS)));
    App::uses('ClassInSomePackage', 'Vendor');

Your vendor files may not follow conventions, have a class that differs from
the file name or does not contain classes. You can load those files using
``App::import()``. The following examples illustrate how to load vendor
files from a number of path structures. These vendor files could be located in
any of the vendor folders.

To load **app/Vendor/geshi.php**::

    App::import('Vendor', 'geshi');

.. note::

    The geshi file must be a lower-case file name as CakePHP will not
    find it otherwise.

To load **app/Vendor/flickr/flickr.php**::

    App::import('Vendor', 'flickr', array('file' => 'flickr/flickr.php'));

To load **app/Vendor/some.name.php**::

    App::import('Vendor', 'SomeName', array('file' => 'some.name.php'));

To load **app/Vendor/services/well.named.php**::

    App::import(
        'Vendor',
        'WellNamed',
        array('file' => 'services' . DS . 'well.named.php')
    );

To load **app/Plugin/Awesome/Vendor/services/well.named.php**::

    App::import(
        'Vendor',
        'Awesome.WellNamed',
        array('file' => 'services' . DS . 'well.named.php')
    );

To load **app/Plugin/Awesome/Vendor/Folder/Foo.php**::

    App::import(
        'Vendor',
        'Awesome.Foo',
        array('file' => 'Folder' . DS . 'Foo.php'));

It wouldn't make a difference if your vendor files are inside your /vendors
directory. CakePHP will automatically find it.

To load **vendors/vendorName/libFile.php**::

    App::import(
        'Vendor',
        'aUniqueIdentifier',
        array('file' => 'vendorName' . DS . 'libFile.php')
    );

App Init/Load/Shutdown Methods
==============================

.. php:staticmethod:: init( )

    :rtype: void

    Initializes the cache for App, registers a shutdown function.

.. php:staticmethod:: load(string $className)

    :rtype: boolean

    Method to handle the automatic class loading. It will look for each class'
    package defined using :php:meth:`App::uses()` and with this information it
    will resolve the package name to a full path to load the class from. File
    name for each class should follow the class name. For instance, if a class
    is name ``MyCustomClass`` the file name should be ``MyCustomClass.php``

.. php:staticmethod:: shutdown( )

    :rtype: void

    Object destructor. Writes cache file if changes have been made to the
    ``$_map``.


.. meta::
    :title lang=en: App Class
    :keywords lang=en: compatible implementation,model behaviors,path management,loading files,php class,class loading,model behavior,class location,component model,management class,autoloader,classname,directory location,override,conventions,lib,textile,cakephp,php classes,loaded
