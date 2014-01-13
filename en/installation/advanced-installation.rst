Advanced Installation
#####################

Installing CakePHP with PEAR installer
======================================

CakePHP publishes a PEAR package that you can install using the pear installer.
Installing with the pear installer can simplify sharing CakePHP libraries
across multiple applications. To install CakePHP with pear you'll need to do the
following::

    pear channel-discover pear.cakephp.org
    pear install cakephp/CakePHP

.. note::

    On some systems installing libraries with pear will require ``sudo``.

After installing CakePHP with pear, if pear is configured correctly you should
be able to use the ``cake`` command to create a new application. Since CakePHP
will be located on PHP's ``include_path`` you won't need to make any other
changes.

Sharing CakePHP libraries with multiple applications
====================================================

There may be some situations where you wish to place CakePHP's
directories on different places on the filesystem. This may be due
to a shared host restriction. This section describes how
to spread your CakePHP directories across a filesystem.

First, realize that there are three main parts to a Cake
application:

#. The core CakePHP libraries, in /lib/Cake.
#. Your application code, in /App.
#. The application's webroot, usually in /App/webroot.

Each of these directories can be located anywhere on your file
system, with the exception of the webroot, which needs to be
accessible by your web server. You can even move the webroot folder
out of the app folder as long as you tell CakePHP where you've put
it.

To configure your CakePHP installation, you'll need to make some
changes to the following files.


-  /App/webroot/index.php
-  /App/webroot/test.php (if you use the
   :doc:`Testing </development/testing>` feature.)

There are three constants that you'll need to edit: ``ROOT``,
``APP_DIR``, and ``CAKE_CORE_INCLUDE_PATH``.


- ``ROOT`` should be set to the path of the directory that contains your
  app folder.
- ``APP_DIR`` should be set to the (base)name of your app folder.
- ``CAKE_CORE_INCLUDE_PATH`` should be set to the path of your CakePHP
  libraries folder. Generally you will not need to change this if you use any of
  the :doc:`suggested installation </installation>` methods.

Let's run through an example so you can see what an advanced
installation might look like in practice. Imagine that I wanted to
set up CakePHP to work as follows:

- My application's webroot directory will be /var/www/mysite/.
- My application's app directory will be /home/me/myapp.
- CakePHP is installed via composer.

Given this type of setup, I would need to edit my webroot/index.php
file (which will end up at /var/www/mysite/index.php, in this
example) to look like the following::

    // App/Config/paths.php (partial, comments removed)
    define('ROOT', '/home/me');
    define ('APP_DIR', 'myapp');
    define('CAKE_CORE_INCLUDE_PATH', DS . 'usr' . DS . 'lib');


.. meta::
    :title lang=en: Advanced Installation
    :keywords lang=en: libraries folder,core libraries,application code,different places,filesystem,constants,webroot,restriction,apps,web server,lib,cakephp,directories,path
