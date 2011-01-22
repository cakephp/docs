3.3.3 Advanced Installation
---------------------------

There may be some situations where you wish to place CakePHP's
directories on different places on the filesystem. This may be due
to a shared host restriction, or maybe you just want a few of your
apps to share the same Cake libraries. This section describes how
to spread your CakePHP directories across a filesystem.

First, realize that there are three main parts to a Cake
application:


#. The core CakePHP libraries, in /cake.
#. Your application code, in /app.
#. The application’s webroot, usually in /app/webroot.

Each of these directories can be located anywhere on your file
system, with the exception of the webroot, which needs to be
accessible by your web server. You can even move the webroot folder
out of the app folder as long as you tell Cake where you've put
it.

To configure your Cake installation, you'll need to make some
changes to following files.


-  /app/webroot/index.php
-  /app/webroot/test.php (if you use the
   `Testing <view/1196/Testing>`_ feature.)

There are three constants that you'll need to edit: ``ROOT``,
``APP_DIR``, and ``CAKE_CORE_INCLUDE_PATH``.


-  ``ROOT`` should be set to the path of the directory that
   contains your app folder.
-  ``APP_DIR`` should be set to the (base)name of your app folder.
-  ``CAKE_CORE_INCLUDE_PATH`` should be set to the path of your
   CakePHP libraries folder.

Let’s run through an example so you can see what an advanced
installation might look like in practice. Imagine that I wanted to
set up CakePHP to work as follows:


-  The CakePHP core libraries will be placed in /usr/lib/cake.
-  My application’s webroot directory will be /var/www/mysite/.
-  My application’s app directory will be /home/me/myapp.

Given this type of setup, I would need to edit my webroot/index.php
file (which will end up at /var/www/mysite/index.php, in this
example) to look like the following:

::

    // /app/webroot/index.php (partial, comments removed) 
    
    if (!defined('ROOT')) {
        define('ROOT', DS.'home'.DS.'me');
    }
    
    if (!defined('APP_DIR')) {
        define ('APP_DIR', 'myapp');
    }
    
    if (!defined('CAKE_CORE_INCLUDE_PATH')) {
        define('CAKE_CORE_INCLUDE_PATH', DS.'usr'.DS.'lib');
    }

It is recommended to use the ``DS`` constant rather than slashes to
delimit file paths. This prevents any missing file errors you might
get as a result of using the wrong delimiter, and it makes your
code more portable.

Additional Class Paths
~~~~~~~~~~~~~~~~~~~~~~

It’s occasionally useful to be able to share MVC classes between
applications on the same system. If you want the same controller in
both applications, you can use CakePHP’s bootstrap.php to bring
these additional classes into view.

In bootstrap.php, define some specially-named variables to make
CakePHP aware of other places to look for MVC classes:

::

    App::build(array(
        'plugins' => array('/full/path/to/plugins/', '/next/full/path/to/plugins/'),
        'models' =>  array('/full/path/to/models/', '/next/full/path/to/models/'),
        'views' => array('/full/path/to/views/', '/next/full/path/to/views/'),
        'controllers' => array('/full/path/to/controllers/', '/next/full/path/to/controllers/'),
        'datasources' => array('/full/path/to/datasources/', '/next/full/path/to/datasources/'),
        'behaviors' => array('/full/path/to/behaviors/', '/next/full/path/to/behaviors/'),
        'components' => array('/full/path/to/components/', '/next/full/path/to/components/'),
        'helpers' => array('/full/path/to/helpers/', '/next/full/path/to/helpers/'),
        'vendors' => array('/full/path/to/vendors/', '/next/full/path/to/vendors/'),
        'shells' => array('/full/path/to/shells/', '/next/full/path/to/shells/'),
        'locales' => array('/full/path/to/locale/', '/next/full/path/to/locale/'),
        'libs' => array('/full/path/to/libs/', '/next/full/path/to/libs/')
    ));

Also changed is the order in which boostrapping occurs. In the past
``app/config/core.php`` was loaded **after**
``app/config/bootstrap.php``. This caused any ``App::import()`` in
an application bootstrap to be un-cached and considerably slower
than a cached include. In 1.3 core.php is loaded and the core cache
configs are created **before** bootstrap.php is loaded.
