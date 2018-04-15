Application
===========

The ``Application`` is the heart of your application. It controls
how your application is configured, and what plugins, middleware, console
commands and routes are included.

You can find your ``Application`` class at **src/Application.php**. By default
it will be pretty slim and only define a few default
:doc:`/controllers/middleware`. Applications can define the following hook
methods:

* ``bootstrap`` Used to load :doc:`configuration files
  </development/configuration>`, define constants and other global functions.
  By default this will include **config/bootstrap.php**. This is the ideal place
  to load the :doc:`/plugins` your application uses.
* ``routes`` Used to load :doc:`routes </development/routing>`. By default this
  will include **config/routes.php**.
* ``middleware`` Used to add :doc:`middleware </controllers/middleware>` to your application.
* ``console`` Used to add :doc:`console commands </console-and-shells>` to your
  application. By default this will automatically discover shells & commands in
  your application and all plugins.
* ``events`` Used to add :doc:`event listeners </core-libraries/events>` to the
  application event manager.

.. _adding-http-stack:

Adding the new HTTP Stack to an Existing Application
====================================================

Using the Application class and HTTP Middleware in an existing application
requires a few changes to your code.

#. First update your **webroot/index.php**. Copy the file contents from the `app
   skeleton <https://github.com/cakephp/app/tree/master/webroot/index.php>`__.
#. Create an ``Application`` class. See the :ref:`using-middleware` section
   above for how to do that. Or copy the example in the `app skeleton
   <https://github.com/cakephp/app/tree/master/src/Application.php>`__.
#. Create **config/requirements.php** if it doesn't exist and add the contents from the `app skeleton <https://github.com/cakephp/app/blob/master/config/requirements.php>`__.

Once those three steps are complete, you are ready to start re-implementing any
application/plugin dispatch filters as HTTP middleware.

If you are running tests you will also need to update your
**tests/bootstrap.php** by copying the file contents from the `app skeleton
<https://github.com/cakephp/app/tree/master/tests/bootstrap.php>`_.

.. meta::
    :title lang=en: CakePHP Application
    :keywords lang=en: http, middleware, psr-7, events, plugins, application, baseapplication
