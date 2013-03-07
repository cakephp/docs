Deployment
##########

Once your application is complete, or even before that you'll want to deploy it.
There are a few things you should do when deploying a CakePHP application.

Check your security
===================

If you're throwing your application out into the wild, it's a good idea to make
sure it doesn't have any leaks. Check the :doc:`/core-libraries/components/security-component` to guard against
CSRF attacks, form field tampering, and others. Doing :doc:`/models/data-validation`, and/or 
:doc:`/core-utility-libraries/sanitize` is also a great idea, for protecting your
database and also against XSS attacks. Check that only your ``webroot`` directory 
is publicly visible, and that your secrets (such as your app salt, and
any security keys) are private and unique as well!

Set document root
=================

Setting the document root correctly on your application is an important step to
keeping your code secure and your application safer. CakePHP applications
should have the document root set to the application's ``app/webroot``.  This
makes the application and configuration files inaccessible through a URL.
Setting the document root is different for different webservers.  See the
:doc:`/installation/advanced-installation` documentation for webserver specific
information.

Update core.php
===============

Updating core.php, specifically the value of ``debug`` is extremely important.
Turning debug = 0 disables a number of development features that should never be
exposed to the Internet at large. Disabling debug changes the following types of
things:

* Debug messages, created with :php:func:`pr()` and :php:func:`debug()` are
  disabled.
* Core CakePHP caches are flushed every 99 years, instead of every 10 seconds as
  in development.
* Error views are less informative, and give generic error messages instead.
* Errors are not displayed.
* Exception stack traces are disabled.

In addition to the above, many plugins and application extensions use ``debug``
to modify their behavior.


Multiple CakePHP applications using the same core
=================================================

There are a few ways you can configure multiple applications to use the same
CakePHP core.  You can either use PHP's ``include_path`` or set the
``CAKE_CORE_INCLUDE_PATH`` in your application's ``webroot/index.php``.
Generally using PHP's ``include_path`` is easier and more robust.  CakePHP comes
preconfigured to look on the ``include_path`` as well so it's simple to use.

In your ``php.ini`` file, locate the existing ``include_path`` directive, and
either append to it or add an ``include_path`` directive::

    include_path = '.:/usr/share/php:/usr/share/cakephp-2.0/lib'

This assumes you are running a \*nix server, and have CakePHP in
``/usr/share/cakephp-2.0``.

Improve your application's performance
======================================

Since handling static assets, such as images, JavaScript and CSS files of plugins,
through the Dispatcher is incredibly inefficient, it is strongly recommended to symlink
them for production. For example like this::

    ln -s app/Plugin/YourPlugin/webroot/css/yourplugin.css app/webroot/css/yourplugin.css

.. meta::
    :title lang=en: Deployment
    :keywords lang=en: stack traces,application extensions,set document,installation documentation,development features,generic error,document root,func,debug,caches,error messages,configuration files,webroot,deployment,cakephp,applications
