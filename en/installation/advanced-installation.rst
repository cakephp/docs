Advanced Installation
#####################

There may be some situations where you wish to place CakePHP's
directories on different places on the filesystem. This may be due
to a shared host restriction, or maybe you just want a few of your
apps to share the same Cake libraries. This section describes how
to spread your CakePHP directories across a filesystem.

First, realize that there are three main parts to a Cake
application:


#. The core CakePHP libraries, in /lib/Cake.
#. Your application code, in /app.
#. The application’s webroot, usually in /app/webroot.

Each of these directories can be located anywhere on your file
system, with the exception of the webroot, which needs to be
accessible by your web server. You can even move the webroot folder
out of the app folder as long as you tell Cake where you've put
it.

To configure your Cake installation, you'll need to make some
changes to the following files.


-  /app/webroot/index.php
-  /app/webroot/test.php (if you use the
   :doc:`Testing </development/testing>` feature.)

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
example) to look like the following::

    // /app/webroot/index.php (partial, comments removed) 
    
    if (!defined('ROOT')) {
        define('ROOT', DS . 'home' . DS . 'me');
    }
    
    if (!defined('APP_DIR')) {
        define ('APP_DIR', 'myapp');
    }
    
    if (!defined('CAKE_CORE_INCLUDE_PATH')) {
        define('CAKE_CORE_INCLUDE_PATH', DS . 'usr' . DS . 'lib');
    }

It is recommended to use the ``DS`` constant rather than slashes to
delimit file paths. This prevents any missing file errors you might
get as a result of using the wrong delimiter, and it makes your
code more portable.

Apache and mod\_rewrite (and .htaccess)
=======================================

This section was moved to :doc:`URL rewriting </installation/url-rewriting>`.


.. meta::
    :title lang=en: Advanced Installation
    :keywords lang=en: libraries folder,core libraries,application code,different places,filesystem,constants,webroot,restriction,apps,web server,lib,cakephp,directories,path
