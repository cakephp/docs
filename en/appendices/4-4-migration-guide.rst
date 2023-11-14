4.4 Migration Guide
###################

CakePHP 4.4 is an API compatible upgrade from 4.0. This page outlines the
deprecations and features added in 4.4.

Upgrading to 4.4.0
==================

You can can use composer to upgrade to CakePHP 4.4.0::

    php composer.phar require --update-with-dependencies "cakephp/cakephp:^4.4"

.. note::
    CakePHP 4.4 requires PHP 7.4 or greater.

Deprecations
============

4.4 introduces a few deprecations. All of these features will continue for the
duration of 4.x but will be removed in 5.0.

You can use the
:ref:`upgrade tool <upgrade-tool-use>` to automate updating usage of deprecated
features::

    bin/cake upgrade rector --rules cakephp44 <path/to/app/src>

.. note::
    This only updates CakePHP 4.4 changes. Make sure you apply CakePHP 4.3 changes first.

A new configuration option has been added to disable deprecations on a path by
path basis. See :ref:`deprecation-warnings` for more information.

Controller
----------

- The ``paginator`` option for ``Controller::paginate()`` is deprecated. Instead
  use the ``className`` option.
- The ``paginator`` option for ``PaginatorComponent`` is deprecated. Instead
  use the ``className`` option.

Datasource
----------

- ``FactoryLocator::add()`` no longer accepts closure factory functions. Instead
  you must pass an instance of the ``LocatorInterface``.
- ``Cake\Datasource\Paging\Paginator`` has been renamed to
  ``Cake\Datasource\Paging\NumericPaginator``.

ErrorHandler & ConsoleErrorHandler
----------------------------------

The ``ErrorHandler`` and ``ConsoleErrorHandler`` classes are now deprecated.
They have been replaced by the new ``ExceptionTrap`` and ``ErrorTrap`` classes.
The trap classes provide a more extensible and consistent error & exception
handling framework. To upgrade to the new system you can replace the usage of
``ErrorHandler`` and ``ConsoleErrorHandler`` (such as in your ``config/bootstrap.php``) with::

    use Cake\Error\ErrorTrap;
    use Cake\Error\ExceptionTrap;

    (new ErrorTrap(Configure::read('Error')))->register();
    (new ExceptionTrap(Configure::read('Error')))->register();

If you have defined the ``Error.errorLogger`` configure value, you will need to
use ``Error.logger`` instead.

See the :doc:`/development/errors` for more detailed documentation. Additionally
the following methods related to the deprecated error handling system are
deprecated:

* ``Debugger::outputError()``
* ``Debugger::getOutputFormat()``
* ``Debugger::setOutputFormat()``
* ``Debugger::addFormat()``
* ``Debugger::addRenderer()``
* ``ErrorLoggerInterface::log()``. Implement ``logException()`` instead.
* ``ErrorLoggerInterface::logMessage()``. Implement ``logError()`` instead.


RequestHandlerComponent
------------------------

The RequestHandlerComponent has been soft-deprecated. Like ``AuthComponent``
using ``RequestHandler`` will not trigger runtime deprecations but it **will**
be removed in 5.0.

- Replace ``accepts()`` with ``$this->request->accepts()``.
- Replace ``requestedWith()`` with a custom request detector (for example,
  ``$this->request->is('json')``).
- Replace ``prefers()`` with ``ContentTypeNegotiation``. See :ref:`controller-viewclasses`.
- Replace ``renderAs()`` with controller content negotiation features on
  ``Controller``.
- Replace ``checkHttpCache`` option with :doc:`/controllers/components/check-http-cache`.
- Use :ref:`controller-viewclasses` instead of defining view class mappings in
  ``RequestHandlerComponent``.

The automatic view switching for 'ajax' requests offered by
``RequestHandlerComponent`` is deprecated. Instead you can either
handle this in a controller action or ``Controller.beforeRender`` callback
with::

    // In a controller action, or in beforeRender.
    if ($this->request->is('ajax')) {
        $this->viewBuilder()->setClassName('Ajax');
    }

Alternatively, you can have the HTML view class switch to the ``ajax`` layout as
required in your controller actions or view templates.

PaginatorComponent
------------------

The ``PaginatorComponent`` is deprecated and will be removed in 5.0.
Use the ``Controller::$paginate`` property or the ``$settings`` parameter of
``Controller::paginate()`` method to specify required paging settings.

ORM
---

- ``SaveOptionsBuilder`` was deprecated. Use an array for options instead.

Plugins
-------

- Plugin class names should now match the plugin name with a "Plugin" suffix. For
  example, the plugin class for ``ADmad/I18n`` plugin would be ``ADmad\I18n\I18nPlugin``
  instead of ``ADmad\I18n\Plugin``, as was the case for CakePHP 4.3 and below.
  The old style name for existing majors should be kept to avoid BC breaks.
  The new naming convention should be followed when developing a new plugin or
  when doing a major release.

Routing
-------

- Cached route files have been deprecated. There are a number of edge cases
  that are impossible to resolve with cached routes. Because the feature of
  cached routes is non-functional for many use cases it will be removed in 5.x

TestSuite
---------

- ``ConsoleIntegrationTestTrait`` was moved to the console package along with
  dependencies to allow testing console applications without requiring the full
  cakephp/cakephp package.

  - ``Cake\TestSuite\ConsoleIntegrationTestTrait`` moved to ``Cake\Console\TestSuite\ConsoleIntegrationTestTrait``
  - ``Cake\TestSuite\Constraint\Console\*`` moved to ``Cake\Console\TestSuite\Constraint\*``
  - ``Cake\TestSuite\Stub\ConsoleInput`` moved to ``Cake\Console\TestSuite\StubConsoleInput``
  - ``Cake\TestSuite\Stub\ConsoleOutput`` moved to ``Cake\Console\TestSuite\StubConsoleOutput``
  - ``Cake\TestSuite\Stub\MissingConsoleInputException`` moved to ``Cake\Console\TestSuite\MissingConsoleInputException``

- ``ContainerStubTrait`` was moved to the core package to allow testing console applications
  without requiring the full cakephp/cakephp package.

  - ``Cake\TestSuite\ContainerStubTrait`` moved to ``Cake\Core\TestSuite\ContainerStubTrait``

- ``HttpClientTrait`` was moved to the http package to allow testing http applications
  without requiring the full cakephp/cakephp package.

  - ``Cake\TestSuite\HttpClientTrait`` moved to ``Cake\Http\TestSuite\HttpClientTrait``

Behavior Changes
================

While the following changes do not change the signature of any methods they do
change the semantics or behavior of methods.

ORM
---

* ``Table::saveMany()`` now triggers the ``Model.afterSaveCommit`` event with
  entities that are still 'dirty' and contain the original field values. This
  aligns the event payload for ``Model.afterSaveCommit`` with ``Table::save()``.

Routing
-------

* ``Router::parseRequest()`` now raises ``BadRequestException`` instead of
  ``InvalidArgumentException`` when an invalid HTTP method is used by a client.

New Features
============

Cache
-----

* ``RedisEngine`` now supports ``deleteAsync()`` and ``clearBlocking()``
  methods. These methods use the ``UNLINK`` operation in redis to mark data for
  removal later by Redis.

Command
-------

* ``bin/cake routes`` now highlights collisions in route templates.
* ``Command::getDescription()`` allows you to set a custom description. See :ref:`console-command-description`

Controller
----------

* ``Controller::viewClasses()`` was added. This method should be implemented by
  controllers that need to perform content-type negotiation. View classes will
  need to implement the static method ``contentType()`` to participate in
  content-type negotiation.

Core
----

* The previously experimental API for the :doc:`/development/dependency-injection` container,
  introduced in CakePHP 4.2, is now considered stable.

Database
--------

* The ``SQLite`` driver now supports shared in memory databases in PHP8.1+.
* ``Query::expr()`` was added as an alternative to ``Query::newExpr()``.
* The ``QueryExpression::case()`` builder now supports inferring the type
  from expressions passed to ``then()`` and ``else()`` that implement
  ``\Cake\Database\TypedResultInterface``.

Error
-----

* ``ErrorTrap`` and ``ExceptionTrap`` were added. These classes form the
  foundation of an updated error handling system for applications. Read more
  about these classes in :doc:`/development/errors`.

Http
----

* ``Response::checkNotModified()`` was deprecated.
  Use ``Response::isNotModified()`` instead.
* ``BaseApplication::handle()`` now adds the ``$request`` into the service
  container all the time.
* ``HttpsEnforcerMiddleware`` now has an ``hsts`` option that allows you to
  configure the ``Strict-Transport-Security`` header.

Mailer
------

* ``Mailer`` now accepts a ``autoLayout`` config which disabled auto layout
  in the ``ViewBuilder`` if set to ``false``.

ORM
---

* The ``cascadeCallbacks`` option was added to ``TreeBehavior``. When enabled,
  ``TreeBehavior`` will iterate a ``find()`` result and delete records
  individually. This enables ORM callbacks to be used when deleting tree nodes.

Plugins
-------

* Plugin classes should now be named to match the plugin name instead of just ``Plugin``.
  For example, you should now use ``ADmad\I18n\I18nPlugin`` instead of ``ADmad\I18n\Plugin``.

Routing
-------

* ``RoutingMiddleware`` now sets the "route" request attribute with the matched
  ``Route`` instance.


View
----

* ``View::contentType()`` was added. Views should implement this method in order
  to participate in content-type negotiation.
* ``View::TYPE_MATCH_ALL`` was added. This special content-type allows you to
  build fallback views for when content-type negotiation provides no matches.
