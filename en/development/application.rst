Application
###########

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
  to load :doc:`/plugins` and global :doc:`event listeners </core-libraries/events>`.
* ``routes`` Used to load :doc:`routes </development/routing>`. By default this
  will include **config/routes.php**.
* ``middleware`` Used to add :doc:`middleware </controllers/middleware>` to your application.
* ``console`` Used to add :doc:`console commands </console-commands>` to your
  application. By default this will automatically discover console commands in
  your application and all plugins.

Bootstrapping your Application
==============================

If you have any additional configuration needs, you should add them to your
application's **config/bootstrap.php** file. This file is included before each
request, and CLI command.

This file is ideal for a number of common bootstrapping tasks:

- Defining convenience functions.
- Declaring constants.
- Defining cache configuration.
- Defining logging configuration.
- Loading custom inflections.
- Loading configuration files.

It might be tempting to place formatting functions there in order to use them in
your controllers. As you'll see in the :doc:`/controllers` and :doc:`/views`
sections there are better ways you add custom logic to your application.

.. _application-bootstrap:

Application::bootstrap()
------------------------

In addition to the **config/bootstrap.php** file which should be used to
configure low-level concerns of your application, you can also use the
``Application::bootstrap()`` hook method to load/initialize plugins, and attach
global event listeners::

    // in src/Application.php
    namespace App;

    use Cake\Http\BaseApplication;

    class Application extends BaseApplication
    {
        public function bootstrap()
        {
            // Call the parent to `require_once` config/bootstrap.php
            parent::bootstrap();

            // CakePHP has the ability to fallback to using the `Cake\ORM\Table`
            // class to represent your database tables when a related class is
            // not created for that table. But using this "auto-tables" feature
            // can make debugging more difficult in some scenarios. So we disable
            // this feature except for the CLI environment (since the classes
            // would not be present when using the `bake` code generation tool).
            if (PHP_SAPI !== 'cli') {
                FactoryLocator::add(
                    'Table',
                    (new TableLocator())->allowFallbackClass(false)
                );
            }

            // Load MyPlugin
            $this->addPlugin('MyPlugin');
        }
    }

Loading plugins and events in ``Application::bootstrap()`` makes
:ref:`integration-testing` easier as events and routes will be re-processed on
each test method.

.. meta::
    :title lang=en: CakePHP Application
    :keywords lang=en: http, middleware, psr-7, events, plugins, application, baseapplication,auto tables,auto-tables,generic table,class
