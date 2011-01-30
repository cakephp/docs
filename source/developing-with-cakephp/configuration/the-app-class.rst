3.4.4 The App Class
-------------------

Loading additional classes has become more streamlined in CakePHP.
In previous versions there were different functions for loading a
needed class based on the type of class you wanted to load. These
functions have been deprecated, all class and library loading
should be done through App::import() now. App::import() ensures
that a class is only loaded once, that the appropriate parent class
has been loaded, and resolves paths automatically in most cases.

Make sure you follow the
:ref:`file-and-classname-conventions`.

Using App::import()
~~~~~~~~~~~~~~~~~~~

``App::import($type, $name, $parent, $search, $file, $return);``

At first glance ``App::import`` seems complex, however in most use
cases only 2 arguments are required.

Importing Core Libs
~~~~~~~~~~~~~~~~~~~

Core libraries such as Sanitize, and Xml can be loaded by:

::

    App::import('Core', 'Sanitize');

The above would make the Sanitize class available for use.

Importing Controllers, Models, Components, Behaviors, and Helpers
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

All application related classes should also be loaded with
App::import(). The following examples illustrate how to do so.

Loading Controllers
^^^^^^^^^^^^^^^^^^^

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
^^^^^^^^^^^^^^

``App::import('Model', 'MyModel');``

Loading Components
^^^^^^^^^^^^^^^^^^

``App::import('Component', 'Auth');``

::

    <?php
    App::import('Component', 'Mailer');
    
    // We need to load the class
    $Mailer = new MailerComponent();
    
    ?>

Loading Behaviors
^^^^^^^^^^^^^^^^^

``App::import('Behavior', 'Tree');``

Loading Helpers
^^^^^^^^^^^^^^^

``App::import('Helper', 'Html');``

Loading from Plugins
~~~~~~~~~~~~~~~~~~~~

Loading classes in plugins works much the same as loading app and
core classes except you must specify the plugin you are loading
from.

::

    App::import('Model', 'PluginName.Comment');

To load APP/plugins/plugin\_name/vendors/flickr/flickr.php

::

    App::import('Vendor', 'PluginName.flickr/flickr');

Loading Vendor Files
~~~~~~~~~~~~~~~~~~~~

The vendor() function has been deprecated. Vendor files should now
be loaded through App::import() as well. The syntax and additional
arguments are slightly different, as vendor file structures can
differ greatly, and not all vendor files contain classes.



The following examples illustrate how to load vendor files from a
number of path structures. These vendor files could be located in
any of the vendor folders.

Vendor examples
^^^^^^^^^^^^^^^

To load **vendors/geshi.php**

::

    App::import('Vendor', 'geshi');

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
