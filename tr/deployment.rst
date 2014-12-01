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
is publicly visible, and that your secrets (such as your app salt and
any security keys) are private and unique as well!

Set document root
=================

Setting the document root correctly on your application is an important step to
keeping your code secure and your application safer. CakePHP applications
should have the document root set to the application's ``app/webroot``. This
makes the application and configuration files inaccessible through a URL.
Setting the document root is different for different webservers. See the
:doc:`/installation/url-rewriting` documentation for webserver specific
information.

In all cases you will want to set the virtual host/domain's document to be
``app/webroot/``. This removes the possibility of files outside of the webroot
directory being executed.

Update core.php
===============

Updating core.php, specifically the value of ``debug`` is extremely important.
Turning debug = 0 disables a number of development features that should never be
exposed to the Internet at large. Disabling debug changes the following types of
things:

* Debug messages, created with :php:func:`pr()` and :php:func:`debug()` are
  disabled.
* Core CakePHP caches are by default flushed every 999 days, instead of every
  10 seconds as in development.
* Error views are less informative, and give generic error messages instead.
* Errors are not displayed.
* Exception stack traces are disabled.

In addition to the above, many plugins and application extensions use ``debug``
to modify their behavior.

You can check against an environment variable to set the debug level dynamically
between environments. This will avoid deploying an application with debug > 0 and
also save yourself from having to change the debug level each time before deploying
to a production environment.

For example, you can set an environment variable in your Apache configuration::

	SetEnv CAKEPHP_DEBUG 2

And then you can set the debug level dynamically in ``core.php``::

	if (getenv('CAKEPHP_DEBUG')) {
		Configure::write('debug', 2);
	} else {
		Configure::write('debug', 0);
	}

Improve your application's performance
======================================

Since handling static assets, such as images, JavaScript and CSS files of plugins,
through the Dispatcher is incredibly inefficient, it is strongly recommended to symlink
them for production. For example like this::

    ln -s app/Plugin/YourPlugin/webroot/css/yourplugin.css app/webroot/css/yourplugin.css

.. meta::
    :title lang=en: Deployment
    :keywords lang=en: stack traces,application extensions,set document,installation documentation,development features,generic error,document root,func,debug,caches,error messages,configuration files,webroot,deployment,cakephp,applications
