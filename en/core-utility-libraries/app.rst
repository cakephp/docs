The App Class
#############

App is responsible for path management, class location and class loading.

::

Make sure you follow the
:ref:`file-and-classname-conventions`.

Adding paths
------------

You can add paths to the search indexes App uses to find classes using `App::build()`.  Adding
additional controller paths for example would alter where CakePHP looks for controllers.
This allows you to split your application up across the filesystem.

Packages
--------

CakePHP is organized around the idea of packages, each class belongs to a package or folder where other
classes reside. You can configure each package location in your application using `App::build('APackage/SubPackage', $paths)`
to inform the framework where should each class be loaded. Almost every class in the CakePHP framework can be swapped
by your own compatible implementation. If you wish to use you own class instead of the classes the framework provides,
just add the class to your libs folder mocking the directory location of where CakePHP expects to find it.

For instance if you'd like to use your own HttpSocket class, put it under

 	app/libs/Network/Http/HttpSocket.php

Inspecting loaded paths
-----------------------

You can inspect the currently loaded paths using `App::path('Controller')` for example to see loaded
controller paths.

It is also possible to inspect paths for plugin classes, for instance, to see a plugin's helpers you would call
`App::path('View/Helper', 'MyPlugin')`

Locating plugins and themes
---------------------------

Plugins and Themes can be located with App as well.  Using App::pluginPath('DebugKit') for example, will
give you the full path to the DebugKit plugin.  App::themePath('purple'), would give the full path to the
`purple` theme.

Inspecting known objects
------------------------

You can find out which objects App knows about using App::objects('Controller') for example to find
which application controllers App knows about.


Using App::path()
~~~~~~~~~~~~~~~~~

``App::path($package, $plugin = null):``

Used to read information stored path.

`App::path('Model'); will return all paths for models`

Added in Cake 2.0:

Now supports plugins, App::path('Controller', 'Users') will return the folder location the controllers in the User plugin

Won't core paths anymore, it will only return paths defined in App::build() or default ones in app (or correspondent plugin)


Using App:build()
~~~~~~~~~~~~~~~~~

``App::build($paths = array(), $mode = App::PREPEND);``

Sets up each package location on the file system. You can configure multiple search paths
for each package, those will be used to look for files one folder at a time in the specified order
All paths should be terminated with a Directory separator

Usage:

`App::build(array(Model' => array('/a/full/path/to/models/'))); will setup a new search path for the Model package`

`App::build(array('Model' => array('/path/to/models/')), App::RESET); will setup the path as the only valid path for searching models`

`App::build(array('View/Helper' => array('/path/to/helpers/', '/another/path/))); will setup multiple search paths for helpers`

If reset is set to true, all loaded plugins will be forgotten and they will be needed to be loaded again.

As of Cake 2.0:

Will not merge app patch with core paths anymore.

Examples:

App::build(array('controllers' => array('/full/path/to/controllers'))) becomes App::build(array('Controller' => array('/full/path/to/Controller')))
App::build(array('helpers' => array('/full/path/to/controllers'))) becomes App::build(array('View/Helper' => array('/full/path/to/View/Helper')))


Using App:objects
~~~~~~~~~~~~~~~~~

``App::objects($type, $path = null, $cache = true);``

Returns an array of objects of the given type.

Example usage:

`App::objects('plugin');` returns `array('DebugKit', 'Blog', 'User');`

`App::objects('Controller');` returns `array('PagesController', 'BlogController');`

You can also search only within a plugin's objects by using the plugin dot
syntax.

`App::objects('MyPlugin.Model');` returns `array('MyPluginPost', 'MyPluginComment');`

As of Cake 2.0

Returns array() instead of false for empty results or invalid types
Does not return core objects anymore, App::objects('core') will return array()
Returns the complete class name


.. _app-import:

Using App::import()
-------------------

``App::import($type, $name, $parent, $search, $file, $return);``

At first glance ``App::import`` seems complex, however in most use
cases only 2 arguments are required.

Importing Core Libs
-------------------

Core libraries such as Sanitize, and Xml can be loaded by:

::

    App::import('Core', 'Sanitize');

The above would make the Sanitize class available for use.

Importing Controllers, Models, Components, Behaviors, and Helpers
-----------------------------------------------------------------

All application related classes should also be loaded with
App::import(). The following examples illustrate how to do so.

Loading Controllers
~~~~~~~~~~~~~~~~~~~

``App::import('Controller', 'MyController');``

Calling ``App::import`` is equivalent to ``require``'ing the file.
It is important to realize that the class subsequently needs to be
initialized.

::

    <?php
    // The same as require('controllers/users_controller.php');
    App::import('Controller', 'Users');
    
    // We need to load the class
    $Users = new UsersController;
    
    // If we want the model associations, components, etc to be loaded
    $Users->constructClasses();
    ?>

Loading Models
~~~~~~~~~~~~~~

``App::import('Model', 'MyModel');``

Loading Components
~~~~~~~~~~~~~~~~~~

``App::import('Component', 'Auth');``

::

    <?php
    App::import('Component', 'Mailer');
    
    // We need to load the class
    $Mailer = new MailerComponent();
    
    ?>

Loading Behaviors
~~~~~~~~~~~~~~~~~

``App::import('Behavior', 'Tree');``

Loading Helpers
~~~~~~~~~~~~~~~

``App::import('Helper', 'Html');``

Loading from Plugins
--------------------

Loading classes in plugins works much the same as loading app and
core classes except you must specify the plugin you are loading
from.

::

    App::import('Model', 'PluginName.Comment');

To load APP/plugins/plugin\_name/vendors/flickr/flickr.php

::

    App::import('Vendor', 'PluginName.flickr/flickr');

Loading Vendor Files
--------------------

The vendor() function has been deprecated. Vendor files should now
be loaded through App::import() as well. The syntax and additional
arguments are slightly different, as vendor file structures can
differ greatly, and not all vendor files contain classes.



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

    This is missing a ton of methods.
