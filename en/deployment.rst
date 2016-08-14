Deployment
##########

Once your application is complete, or even before that you'll want to deploy it.
There are a few things you should do when deploying a CakePHP application.

Moving files
============

You are encouraged to create a git commit and pull or clone that commit or
repository on your server and run ``composer install``.
While this requires some knowledge about git and an existing install of ``git``
and ``composer`` this process will take care about library dependencies and file
and folder permissions.

Be aware that when deploying via FTP you will at least have to fix file and
folder permissions.

You can also use this deployment technique to setup a staging- or demo-server
(pre-production) and keep it in sync with your dev box.

Adjust config/app.php
=====================

Adjusting app.php, specifically the value of ``debug`` is extremely important.
Turning debug = ``false`` disables a number of development features that should
never be exposed to the Internet at large. Disabling debug changes the following
types of things:

* Debug messages, created with :php:func:`pr()` and :php:func:`debug()` are
  disabled.
* Core CakePHP caches are by default flushed every year (about 365 days), instead of every
  10 seconds as in development.
* Error views are less informative, and give generic error messages instead.
* PHP Errors are not displayed.
* Exception stack traces are disabled.

In addition to the above, many plugins and application extensions use ``debug``
to modify their behavior.

You can check against an environment variable to set the debug level dynamically
between environments. This will avoid deploying an application with debug
``true`` and also save yourself from having to change the debug level each time
before deploying to a production environment.

For example, you can set an environment variable in your Apache configuration::

    SetEnv CAKEPHP_DEBUG 1

And then you can set the debug level dynamically in **app.php**::

    $debug = (bool)getenv('CAKEPHP_DEBUG');

    return [
        'debug' => $debug,
        .....
    ];

Check Your Security
===================

If you're throwing your application out into the wild, it's a good idea to make
sure it doesn't have any obvious leaks:

* Ensure you are using the :doc:`/controllers/components/csrf` component.
* You may want to enable the :doc:`/controllers/components/security` component.
  It can help prevent several types of form tampering and reduce the possibility
  of mass-assignment issues.
* Ensure your models have the correct :doc:`/core-libraries/validation` rules
  enabled.
* Check that only your ``webroot`` directory is publicly visible, and that your
  secrets (such as your app salt, and any security keys) are private and unique
  as well.

Set Document Root
=================

Setting the document root correctly on your application is an important step to
keeping your code secure and your application safer. CakePHP applications
should have the document root set to the application's ``webroot``. This
makes the application and configuration files inaccessible through a URL.
Setting the document root is different for different webservers. See the
:ref:`url-rewriting` documentation for webserver specific
information.

In all cases you will want to set the virtual host/domain's document to be
``webroot/``. This removes the possibility of files outside of the webroot
directory being executed.

.. _symlink-assets:

Improve Your Application's Performance
======================================

Class loading can take a big share of your application's processing time.
In order to avoid this problem, it is recommended that you run this command in
your production server once the application is deployed::

    php composer.phar dumpautoload -o

Since handling static assets, such as images, JavaScript and CSS files of
plugins, through the ``Dispatcher`` is incredibly inefficient, it is strongly
recommended to symlink them for production. This can be done by using
the ``plugin`` shell::

    bin/cake plugin assets symlink

The above command will symlink the ``webroot`` directory of all loaded plugins
to appropriate path in the app's ``webroot`` directory.

If your filesystem doesn't allow creating symlinks the directories will be
copied instead of being symlinked. You can also explicitly copy the directories
using::

    bin/cake plugin assets copy

Deploying an update
===================

After deployment of an update you might also want to run ``bin/cake orm_cache
clear``, part of the :doc:`/console-and-shells/orm-cache` shell.

.. meta::
    :title lang=en: Deployment
    :keywords lang=en: stack traces,application extensions,set document,installation documentation,development features,generic error,document root,func,debug,caches,error messages,configuration files,webroot,deployment,cakephp,applications
