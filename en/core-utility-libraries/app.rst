App Class
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

    app/Lib/Network/Http/HttpSocket.php

Once you've done this App will load your override file instead of the file
inside CakePHP.

.. php:class:: App

Loading classes
===============

.. php:staticmethod:: uses($class, $package)

    Classes are lazily loaded in CakePHP, however before the autoloader
    can find your classes you need to tell App, where it can find the files.
    By telling App which package a class can be found in, it can properly locate
    the file and load it the first time a class is used.

    Some examples for common types of classes are:

    Controller
        ``App::uses('PostsController', 'Controller');``
    Component
        ``App::uses('AuthComponent', 'Controller/Component');``
    Model
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

Loading files from plugins
--------------------------

Loading classes in plugins works much the same as loading app and
core classes except you must specify the plugin you are loading
from::

    <?php
    App::uses('Comment', 'PluginName.Model');


Finding paths to packages using App::path()
===========================================

.. php:staticmethod:: path($package, $plugin = null)

    Used to read information stored path::

        <?php
        // return the model paths in your application
        App::path('Model');

    This can be done for all packages that are apart of your application. You
    can also fetch paths for a plugin::

        <?php
        // return the component paths in DebugKit
        App::path('Component', 'DebugKit');

.. php:staticmethod:: core($package)

    Used for finding the path to a package inside CakePHP::

        <?php
        // Get the path to Cache engines.
        App::core('Cache/Engine');

Adding paths for App to find packages in
========================================

.. php:staticmethod:: build($paths = array(), $mode = App::PREPEND)

    Sets up each package location on the file system. You can configure multiple
    search paths for each package, those will be used to look for files one
    folder at a time in the specified order.  All paths should be terminated
    with a directory separator.

    Adding additional controller paths for example would alter where CakePHP
    looks for controllers.  This allows you to split your application up across
    the filesystem.

    Usage::

        <?php
        //will setup a new search path for the Model package
        App::build(array('Model' => array('/a/full/path/to/models/'))); 

        //will setup the path as the only valid path for searching models
        App::build(array('Model' => array('/path/to/models/')), App::RESET); 

        //will setup multiple search paths for helpers
        App::build(array('View/Helper' => array('/path/to/helpers/', '/another/path/'))); 


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
        //returns array('DebugKit', 'Blog', 'User');
        App::objects('plugin');

        //returns array('PagesController', 'BlogController');
        App::objects('Controller');

    You can also search only within a plugin's objects by using the plugin dot syntax.::

        <?php
        // returns array('MyPluginPost', 'MyPluginComment');
        App::objects('MyPlugin.Model');

    .. versionchanged:: 2.0

    1. Returns ``array()`` instead of false for empty results or invalid types
    2. Does not return core objects anymore, ``App::objects('core')`` will
       return ``array()``.
    3. Returns the complete class name

Locating plugins
================

.. php:staticmethod:: pluginPath($plugin)

    Plugins can be located with App as well. Using ``App::pluginPath('DebugKit');``
    for example, will give you the full path to the DebugKit plugin::

        <?php
        $path = App::pluginPath('DebugKit');

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
        // The same as require('Controller/UsersController.php');
        App::import('Controller', 'Users');
        
        // We need to load the class
        $Users = new UsersController;
        
        // If we want the model associations, components, etc to be loaded
        $Users->constructClasses();

    **All classes that were loaded in the past using App::import('Core', $class) will need to be 
    loaded using App::uses() referring to the correct package. This change has provided large
    performance gains to the framework.**

    .. versionchanged:: 2.0

    * The method no longer looks for classes recursively, it strictly uses the values for the 
      paths defined in :php:meth:`App::build()`
    * It will not be able to load ``App::import('Component', 'Component')`` use
      ``App::uses('Component', 'Controller');``;
    * Using ``App::import('Lib', 'CoreClass');`` to load core classes is no longer possible.
    * Importing a non-existent file, supplying a wrong type or package name, or
      null values for ``$name`` and ``$file`` parameters will result in a false return
      value
    * ``App::import('Core', 'CoreClass')`` is no longer supported, use
      :php:meth:`App::uses()` instead and let the class autoloading do the rest
    * Loading Vendor files does not look recursively in the vendors folder, it
      will also not convert anymore the file to underscored as it did on the
      past

Overriding classes in CakePHP
=============================

You can override almost every class in the framework, exceptions are the
:php:class:`App` and :php:class:`Configure` classes. whenever you like to
perform such overriding, just add your class to your app/Lib folder mimicking
the internal structure of the framework.  Some examples to follow

* To override the :php:class:`Dispatcher` class, create ``app/Lib/Routing/Dispatcher.php``
* To override the :php:class:`CakeRoute` class, create ``app/Lib/Routing/Route/CakeRoute.php``
* To override the :php:class:`Model` class, create ``app/Lib/Model/Model.php``

When you load the replaced files, the app/Lib files will be loaded instead of
the built-in core classes.

Loading Vendor Files
====================

Vendor files containing classes can be loaded using ``App::uses()``.
You might also have vendor files that do not have classes, you can load those
using ``App::import()``. The following examples illustrate how to load vendor
files from a number of path structures. These vendor files could be located in
any of the vendor folders.

To load **vendors/geshi.php**::

    App::import('Vendor', 'geshi');

.. note::

    The geshi file must be a lower-case file name as Cake will not
    find it otherwise.

To load **vendors/flickr/flickr.php**::

    App::import('Vendor', 'flickr/flickr');

To load **vendors/some.name.php**::

    App::import('Vendor', 'SomeName', array('file' => 'some.name.php'));

To load **vendors/services/well.named.php**::

    App::import('Vendor', 'WellNamed', array('file' => 'services'.DS.'well.named.php'));

It wouldn't make a difference if your vendor files are inside your
/app/vendors directory. Cake will automatically find it.

To load **app/vendors/vendorName/libFile.php**::

    App::import('Vendor', 'aUniqueIdentifier', array('file' =>'vendorName'.DS.'libFile.php'));

.. todo::

    This is missing a ton of methods. And vendors docs are wrong.


.. meta::
    :title lang=en: App Class
    :keywords lang=en: compatible implementation,model behaviors,path management,loading files,php class,class loading,model behavior,class location,component model,management class,autoloader,classname,directory location,override,conventions,lib,textile,cakephp,php classes,loaded