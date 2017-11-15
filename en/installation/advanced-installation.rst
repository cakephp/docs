Advanced Installation
#####################

Installing CakePHP with PEAR Installer
======================================

CakePHP publishes a PEAR package that you can install using the PEAR installer.
Installing with the PEAR installer can simplify sharing CakePHP libraries
across multiple applications. To install CakePHP with PEAR you'll need to do the
following::

    pear channel-discover pear.cakephp.org
    pear install cakephp/CakePHP

.. note::

    On some systems installing libraries with PEAR will require ``sudo``.

After installing CakePHP with PEAR, if PEAR is configured correctly you should
be able to use the ``cake`` command to create a new application. Since CakePHP
will be located on PHP's ``include_path`` you won't need to make any other
changes.

Installing CakePHP with Composer
================================

Before starting you should make sure that you have got an up to date PHP
version:

.. code-block:: bash

    php -v

You should at least have got installed PHP 5.3.0 (CLI) or higher.
Your webserver's PHP version must also be of 5.3.0 or higher, and should best be
the same version your command line interface (CLI) PHP version is of.

Installing Composer
-------------------

Composer is a dependency management tool for PHP 5.3+. It solves many of the
problems the PEAR installer has, and simplifies managing multiple versions of
libraries. `Packagist <https://packagist.org/>`_ is the main repository of
Composer installable packages. Since CakePHP also publishes releases to
Packagist, you can install CakePHP using `Composer <http://getcomposer.org>`_.

- Installing Composer on Linux and Mac OS X

  #. Run the installer script as described in the
     `official Composer documentation <https://getcomposer.org/download/>`_
     and follow the instructions to install Composer.
  #. Execute the following command to move the composer.phar to a directory
     that is in your path::

         mv composer.phar /usr/local/bin/composer

- Installing Composer on Windows

  For Windows systems, you can download Composer's Windows installer
  `here <https://github.com/composer/windows-setup/releases/>`__.  Further
  instructions for Composer's Windows installer can be found within the
  README `here <https://github.com/composer/windows-setup>`__.

Create a CakePHP Project
------------------------

Before installing CakePHP you'll need to setup a ``composer.json`` file. A
composer.json file for a CakePHP application would look like the following::

    {
        "name": "example-app",
        "require": {
            "cakephp/cakephp": "2.10.*"
        },
        "config": {
            "vendor-dir": "Vendor/"
        }
    }

Save this JSON into ``composer.json`` in the APP directory of your project.
Next download the composer.phar file into your project. After you've downloaded
Composer, install CakePHP. In the same directory as your ``composer.json`` run
the following::

    $ php composer.phar install

Once Composer has finished running you should have a directory structure that looks like::

    example-app/
        composer.phar
        composer.json
        Vendor/
            bin/
            autoload.php
            composer/
            cakephp/

You are now ready to generate the rest of your application skeleton::

    $ Vendor/bin/cake bake project <path to project>

By default ``bake`` will hard-code :php:const:`CAKE_CORE_INCLUDE_PATH`. To
make your application more portable you should modify ``webroot/index.php``,
changing ``CAKE_CORE_INCLUDE_PATH`` to be a relative path::

    define(
        'CAKE_CORE_INCLUDE_PATH',
        ROOT . DS . APP_DIR . DS . 'Vendor' . DS . 'cakephp' . DS . 'cakephp' . DS . 'lib'
    );

.. note::

    If you are planning to create unit tests for your application you'll also
    need to make the above change to ``webroot/test.php``

If you're installing any other libraries with Composer, you'll need to setup
the autoloader, and work around an issue in Composer's autoloader. In your
``Config/bootstrap.php`` file add the following::

    // Load Composer autoload.
    require APP . 'Vendor/autoload.php';

    // Remove and re-prepend CakePHP's autoloader as Composer thinks it is the
    // most important.
    // See: http://goo.gl/kKVJO7
    spl_autoload_unregister(array('App', 'load'));
    spl_autoload_register(array('App', 'load'), true, true);

You should now have a functioning CakePHP application installed via Composer. Be
sure to keep the composer.json and composer.lock file with the rest of your
source code.

Sharing CakePHP Libraries with multiple Applications
====================================================

There may be some situations where you wish to place CakePHP's directories on
different places on the filesystem. This may be due to a shared host
restriction, or maybe you just want a few of your apps to share the same CakePHP
libraries. This section describes how to spread your CakePHP directories across
a filesystem.

First, realize that there are three main parts to a CakePHP application:

#. The core CakePHP libraries, in /lib/Cake.
#. Your application code, in /app.
#. The application's webroot, usually in /app/webroot.

Each of these directories can be located anywhere on your file system, with the
exception of the webroot, which needs to be accessible by your web server. You
can even move the webroot folder out of the app folder as long as you tell
CakePHP where you've put it.

To configure your CakePHP installation, you'll need to make some changes to the
following files.

-  /app/webroot/index.php
-  /app/webroot/test.php (if you use the
   :doc:`Testing </development/testing>` feature.)

There are three constants that you'll need to edit: ``ROOT``, ``APP_DIR``, and
``CAKE_CORE_INCLUDE_PATH``.

-  ``ROOT`` should be set to the path of the directory that contains your app
   folder.
-  ``APP_DIR`` should be set to the (base)name of your app folder.
-  ``CAKE_CORE_INCLUDE_PATH`` should be set to the path of your CakePHP
   libraries folder.

Let's run through an example so you can see what an advanced installation might
look like in practice. Imagine that I wanted to set up CakePHP to work as
follows:

-  The CakePHP core libraries will be placed in /usr/lib/cake.
-  My application's webroot directory will be /var/www/mysite/.
-  My application's app directory will be /home/me/myapp.

Given this type of setup, I would need to edit my webroot/index.php file (which
will end up at /var/www/mysite/index.php, in this example) to look like the
following::

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

It is recommended to use the ``DS`` constant rather than slashes to delimit file
paths. This prevents any missing file errors you might get as a result of using
the wrong delimiter, and it makes your code more portable.

Apache and mod\_rewrite (and .htaccess)
=======================================

This section was moved to :doc:`URL rewriting </installation/url-rewriting>`.


.. meta::
    :title lang=en: Advanced Installation
    :keywords lang=en: libraries folder,core libraries,application code,different places,filesystem,constants,webroot,restriction,apps,web server,lib,cakephp,directories,path
