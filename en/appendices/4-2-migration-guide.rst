4.2 Migration Guide
###################

CakePHP 4.2 is an API compatible upgrade from 4.0. This page outlines the
deprecations and features added in 4.2.

Upgrading to 4.2.0
==================

You can use composer to upgrade to CakePHP 4.2.0::

    php composer.phar require --update-with-dependencies "cakephp/cakephp:4.2.x"

Deprecations
============

4.2 introduces a few deprecations. All of these features will continue for the
duration of 4.x but will be removed in 5.0. You can use the
:ref:`upgrade tool <upgrade-tool-use>` to automate updating usage of deprecated
features::

    bin/cake upgrade rector --rules cakephp42 <path/to/app/src>

.. note::
    This only updates CakePHP 4.2 changes. Make sure you apply CakePHP 4.1 changes first.

A new configuration option has been added to disable deprecations on a path by
path basis. See :ref:`deprecation-warnings` for more information.

Core
----

- ``Exception::responseHeader()`` is now deprecated. Users must use ``HttpException::setHeaders()``
  when setting HTTP response headers. Application and plugin exceptions that set response headers
  should be updated to subclass ``HttpException``.
- ``Cake\Core\Exception\Exception`` was renamed to
  ``Cake\Core\Exception\CakeException``.

Controller
----------

- ``Controller::setAction()`` is deprecated. Either update your code to use
  redirects, or call the required action as a method.

Database
--------

- ``Cake\Database\Exception`` was renamed to ``Cake\Database\Exception\DatabaseException``.

ORM
---

- ``TableLocator::allowFallbackClass()`` was added. This method lets you
  disable automatically generated fallback table classes. Disabling is
  currently opt-in, but will become the default in the future.
- ``ORM\Behavior::getTable()`` has been deprecated. Use ``table()`` instead.
  This change makes method names dissimilar between ``ORM\Table`` as the return
  value of these methods is different.


Behavior Changes
================

While the following changes do not change the signature of any methods they do
change the semantics or behavior of methods.

Collection
----------

- ``Collection::groupBy()`` and ``Collection::indexBy()`` now throw an exception when
  the path does not exist or the path contains a null value. Users who need to support
  null should use a callback to return a default value instead.

Controller
----------

- ``Controller::$components`` was marked protected. It was previously documented
  as protected. This should not impact most application code as implementations
  can change the visibility to public.

Component
---------

- ``FlashComponent::set()`` now sets the ``element`` option to ``error`` by
  default when used with an ``Exception`` instance.

Database
--------

- The ``TimeType`` will now correctly marshall values in the ``H:i`` format.
  Previously these values would be cast to ``null`` after validation.
- ``Sqlserver`` driver will retry connect after receiving "Azure Sql Database pausd" errors.

Error
-----

- ``ExceptionRenderer`` now uses the exception code as the HTTP status code
  for ``HttpException`` only. Other exceptions that should return a non-500
  HTTP code are controlled by ``ExceptionRenderer::$exceptionHttpCodes``.

  .. note::
      If you need to restore the previous behavior until your exceptions are updated,
      you can create a custom ExceptionRenderer and override the ``getHttpCode()`` function.
      See :ref:`custom-exceptionrenderer` for more information.

- ``ConsoleErrorHandler`` now uses the exception code as the exit code for
  ``ConsoleException`` only.

Validation
----------

- ``Validation::time()`` will now reject a string if minutes are missing. Previously,
  this would accept hours-only digits although the api documentation showed minutes were required.
- ``Validation::comparison()`` (and as a result other comparison methods which use it)
  now only work for numeric string. Earlier it relied on pretty brittle behavior
  of casting any given value to float for comparison which could lead of incorrect
  results for non-numeric strings.

Breaking Changes
================

Behind the API, some breaking changes are necessary moving forward.
They usually only affect tests.

I18n
----
- The dependency on `Aura.Intl <https://github.com/auraphp/Aura.Intl>`_ package has been
  removed as it is no longer maintained. If your app/plugin has :ref:`custom translation loaders <creating-generic-translators>`
  then they need to now return a ``Cake\I18n\Package`` instance instead of ``Aura\Intl\Package``.
  Both the classes are API compatible so you won't need to change anything else.

Testing
-------

- The fixture names around UUIDs have been consolidated (``UuidItemsFixture``, ``BinaryUuidItemsFixture``).
  If you use any of them, make sure you updated these names.
  The ``UuidportfoliosFixture`` was unused in core and removed now.

New Features
============

We're adding a new process to enable us to ship features, collect feedback from
the community and evolve those features. We're calling this process
:ref:`experimental-features`.

Core
----

- Experimental support for a :doc:`/development/dependency-injection` container
  was added.

Console
-------

- ``ConsoleIo::comment()`` was added. This method formats text with a blue
  foreground like comments in the generated help text.
- ``TableHelper`` now supports a ``<text-right>`` formatting tag, which aligns
  cell content with the right edge instead of the left.

Database
--------

- ``SqlServer`` now creates client-side buffered cursors for prepared statements by default.
  This was changed to fix significant performance issues with server-side SCROLL cursors.
  Users should see a performance boost with most results sets.

  .. warning::
      For users with large query results, this may cause an error allocating the client-side buffer unless
      ``Query::disableBufferedResults()`` is called.
      The maximum buffer size can be configured in ``php.ini`` with ``pdo_sqlsrv.client_buffer_max_kb_size``.
      See https://docs.microsoft.com/en-us/sql/connect/php/cursor-types-pdo-sqlsrv-driver?view=sql-server-ver15#pdo_sqlsrv-and-client-side-cursors
      for more information.
- ``Query::isResultsCastingEnabled()`` was added to get the current result
  casting mode.
- ``StringExpression`` was added to use string literals with collation.
- ``IdentifierExpression`` now supports collation.

Http
----

- ``Cake\Http\Middleware\SessionCsrfProtectionMiddleware`` was added. Instead of
  storing CSRF tokens in a cookie, this middleware stores tokens in the session.
  This makes CSRF tokens user scoped and time based with the session, offering
  enhanced security over cookie based CSRF tokens. This middleware is a drop in
  replacement for the ``CsrfProtectionMiddleware``.
- The ``hal+json``, ``hal+xml``, and ``jsonld`` types were added to
  ``Response`` making them usable with ``withType()``.
- ``Client::createFromUrl()`` was added. This method can be used to create
  HTTP clients scoped to specific domains including a base path.
- A new utility class ``Cake\Http\FlashMessage`` was added whose instance is
  available through ``ServerRequest::getFlash()``. The class similar to the
  ``FlashComponent`` allows you to set flash messages. It can be particularly
  useful for setting flash messages from middlewares.

ORM
---

- ``Table::subquery()`` and  ``Query::subquery()`` were added. These methods
  lets you create query objects that don't have automatic aliasing. This helps
  reduce overhead and complexity of building subqueries and common table
  expressions.
- ``IsUnique`` rule now accepts the ``allowMultipleNulls`` option that was available
  in 3.x. This is disabled by default unlike in 3.x.

TestSuite
---------

- ``EmailTrait::assertMailSubjectContains()`` and
  ``assertMailSubjectContainsAt()`` were added.
- ``mockService()`` was added to ``ConsoleIntegrationTestTrait`` and
  ``IntegrationTestCaseTrait``. This method enables services injected with the
  :doc:`/development/dependency-injection` container to be replaced with mock
  or stub objects.

View
----

- Context classes now include the ``comment``, ``null``, and ``default``
  metadata options in the results of ``attributes()``.
- ``ViewBuilder::addHelper()`` now accepts an ``$options`` parameter to pass
  options into helper constructors.
- The ``assetUrlClassName`` option was added to ``UrlHelper``. This option lets
  you replace the default asset URL resolver with an application specific one.
  This can be useful if you need to customize asset cache busting parameters.
