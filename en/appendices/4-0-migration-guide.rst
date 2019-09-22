4.0 Migration Guide
###################

CakePHP 4.0 contains breaking changes, and is not backwards compatible with 3.x
releases. Before attempting to upgrade to 4.0, first upgrade to 3.8 and resolve
all deprecation warnings.

To upgrade to 4.0.x run the following composer command:

.. code-block:: bash

    php composer.phar require --update-with-dependencies "cakephp/cakephp:4.0.*"

Deprecated Features Removed
===========================

All methods, properties and functionality that were emitting deprecation warnings
as of 3.8 have been removed.

Authentication functionality has been split into standalone plugins
`Authentication <https://github.com/cakephp/authentication>`__ and
`Authorization <https://github.com/cakephp/authorization>`__. The former
RssHelper can be found as standalone `Feed plugin
<https://github.com/dereuromark/cakephp-feed>`__ with similar functionality.

Deprecations
============

The following is a list of deprecated methods, properties and behaviors. These
features will continue to function in 4.x and will be removed in 5.0.0.

Component
---------

* ``AuthComponent`` and related classes have been deprecated and will be removed
  in 5.0.0. You should use the authentication and authorization libs mentioned
  above instead.

Filesystem
----------

* This package is deprecated and will be removed in 5.0. It has a number of
  design problems and fixing this infrequently used package does not seem worth
  the effort when there are a great selection of packages already.

ORM
---

* Using ``Entity::isNew()`` as a setter is deprecated. Use ``setNew()`` instead.
* ``Entity::unsetProperty()`` has been renamed to ``Entity::unset()`` to match
  the other methods.

View
----

* The ``_serialize``, ``_jsonOptions`` and ``_jsonp`` special view variables of
  ``JsonView`` are
  now deprecated. Instead you should use
  ``viewBuilder()->setOption($optionName, $optionValue)`` to set these options.
* The ``_serialize``, ``_rootNode`` and ``_xmlOptions`` special view variables of
  ``XmlView`` are
  now deprecated. Instead you should use
  ``viewBuilder()->setOption($optionName, $optionValue)`` to set these options.
* ``HtmlHelper::tableHeaders()`` now prefers header cells with attributes to be
  defined as a nested list. e.g ``['Title', ['class' => 'special']]``.

Mailer
-----

* The ``Cake\Mailer\Email`` class has been deprecated. Use ``Cake\Mailer\Mailer``
  instead.

App
---
* The 2nd argument ``$plugin`` of ``App::path()`` is deprecated.
  Use ``\Cake\Core\Plugin::classPath()/templatePath()`` instead for plugin paths.

Breaking Changes
================

In addition to the removal of deprecated features there have been breaking
changes made:

Cache
-----

* ``Cake\Cache\CacheEngine::gc()`` and all implementations of this method have
  been removed. This method was a no-op in most cache drivers and was only used
  in file caching.

Controller
----------

* ``Cake\Controller\Controller::referer()`` now defaults the ``local``
  parameter to true, instead of false. This makes using referer headers safer as
  they will be constrained to your application's domain by default.
* Controller method name matching when invoking actions is now case sensitive.
  For example if your controller method is ``forgotPassword()`` then using string
  ``forgotpassword`` in URL will not match as action name.

Database
--------

* Type mapping classes in ``Cake\Database\TypeInterface`` no longer inherit from
  ``Type``, and leverage ``BatchCastingInterface`` features now.
* ``Cake\Database\Type::map()`` only functions as a setter now. You must use
  ``Type::getMap()`` to inspect type instances.
* Date, Time, Timestamp, and Datetime column types now return immutable time
  objects by default now.
* ``BoolType`` no longer marshals non-empty string values to ``true`` and
  empty string to ``false``. Instead non-boolean string values are converted to ``null``.
* ``DecimalType`` now uses strings to represent decimal values instead of floats.
  Using floats caused loss in precision.
* ``JsonType`` now preserves ``null`` when preparing values for database
  context. In 3.x it would emit ``'null'``.
* ``StringType`` now marshals array values to ``null`` instead of an empty
  string.
* ``Cake\Database\Connection::setLogger()`` no longer accepts ``null`` to
  disable logging. Instead pass an instance of ``Psr\Log\NullLogger`` to disable
  logging.
* The internals of ``Database\Log\LoggingStatement``, ``Database\QueryLogger``
  and ``Database\Log\LoggedQuery`` have changed. If you extend these classes you
  will need to update your code.
* The internals of ``Cake\Database\Log\LoggingStatement``, ``Cake\Database\QueryLogger``
  and ``Cake\Database\Log\LoggedQuery`` have changed. If you extend these classes
  you will need to update your code.
* The internals of ``Cake\Database\Schema\CacheCollection`` and ``Cake\Database\SchemaCache``
  have changed. If you extend these classes you will need to update your code.

Datasources
-----------

* ``ModelAwareTrait::$modelClass`` is now protected.

Error
-----
* The internals of error handler classes ``BaseErrorHandler``, ``ErrorHandler``
  and ``ConsoleErrorHandler`` have changed. If you have extended these classes
  you should update them accordingly.
* ``ErrorHandlerMiddleware`` now takes an error handler class name or instance
  as constructor argument instead of exception render class name or instance.

Event
-----

* Calling ``getSubject()`` on an event with no subject will now raise an
  exception.

Http
----

* ``Cake\Http\ServerRequest::referer()`` now defaults the ``local``
  parameter to true, instead of false. This makes using referer headers safer as
  they will be constrained to your application's domain by default.
* The default value of ``Cake\Http\ServerRequest::getParam()`` when a parameter is missing
  is now ``null`` and not ``false``.
* ``Cake\Http\Client\Request::body()`` has been removed. Use ``getBody()`` or
  ``withBody()`` instead.
* ``Cake\Http\Client\Response::isOk()`` now returns ``true`` for all 2xx and 3xx
  response codes.
* ``Cake\Http\Cookie\Cookie::getExpiresTimestamp()`` now returns an integer.
  This makes it type match the one used in ``setcookie()``.
* ``Cake\Http\ServerRequest::referer()`` now returns ``null`` when the current
  request has no referer. Previously it would return ``/``.
* The Session cookie name is no longer set to ``CAKEPHP`` by default. Instead
  the default cookie name defined in your ``php.ini`` file is used. You can use
  the ``Session.cookie`` configuration option to set the cookie name.
* ``Cake\Cookie\CookieCollection::get()`` now throws an exception when accessing
  a cookie that doesn't exist. Use ``has()`` to check for cookie existence.
* The signature of ``Cake\Http\ResponseEmitter::emit()`` has changed, it no longer
  has the 2nd argument.
* The default value of ``App.mergeFilesAsObjects`` is now ``true``. If your
  application uses file uploads you can set this flag to ``false`` to retain
  compatibility with the behavior in 3.x.

I18n
----

* JSON encoding ``Cake\I18n\Date`` and ``Cake\I18n\FrozenDate`` objects now results
  in strings with only the date part, in format ``yyyy-MM-dd`` instead of earlier format
  ``yyyy-MM-dd'T'HH:mm:ssxxx``.

Mailer
------

* ``Email::set()`` has been removed. Use ``Email::setViewVars()`` instead.
* ``Email::createView()`` has been removed.
* ``Email::viewOptions()`` has been removed. Use
  ``$email->getRenderer()->viewBuilder()->setOptions()`` instead.

ORM
---

* Conditions that have null values must explicitly use the ``IS`` operator now.
  In previous versions using ``['name' => null]`` would generate SQL like
  ``name = NULL`` which always matches 0 rows. This situation will now raise an
  exception. You will need to update your where clauses to use
  ``['name IS' => null]`` instead.

Router
------

* ``RouteBuilder::resources()`` now inflects resource names to dasherized form
  instead of underscored by default in URLs. You can retain underscored
  inflection by using ``'inflect' => 'underscore'`` in ``$options`` argument.
* ``Router::plugin()`` and ``Router::prefix()`` now use plugin/prefix name in
  dasherized form in URL by default. You can retain underscored from (or any other
  custom path) by using ``'path'`` key in ``$options`` argument.
* ``Router`` maintains reference to only a single instance of request now instead
  of a stack of requests. ``Router::pushRequest()``, ``Router::setRequestInfo()``
  and ``Router::setRequestContext()`` have been removed, use ``Router::setRequest()``
  instead. ``Router::popRequest()`` has been removed. ``Router::getRequest()``
  no longer has a ``$current`` argument.

TestSuite
---------

* ``Cake\TestSuite\TestCase::$fixtures`` cannot be a comma separated string
  anymore. It must be an array.

Utility
-------
* ``Cake\Utility\Xml::fromArray()`` now requires an array for the ``$options``
  parameter.
* ``Cake\Filesystem\Folder::copy($to, array $options = [])`` and
  ``Cake\Filesystem\Folder::move($to, array $options = [])`` have now the target
  path extracted as first argument.
* The ``readFile`` option of ``Xml::build()`` is no longer true by default.
  Instead you must enable ``readFile`` to read local files.
* ``Hash::sort()`` now accepts the ``SORT_ASC`` and ``SORT_DESC`` constants in
  the direction parameter.

View
----

* Templates have been moved from ``src/Template/`` to ``templates/`` folder on
  app and plugin root. With this change the ``src`` folder now only contains files
  with classes that are autoloaded via composer's autoloader.
* Special templates folders like ``Cell``, ``Element``, ``Email`` and ``Plugin``
  have be renamed to lower case ``cell``, ``element``, ``email`` and ``plugin``
  respectively. This provides better visual distinction between special folders
  and the folders corresponding to your app's controller names which are in
  ``CamelCase`` form.
* The template extension has also been changed from ``.ctp`` to ``.php``.
  The special extension provided no real benefit and instead required editors/IDEs
  to be configured to recognise files with ``.ctp`` extension as PHP files.
* You can no longer use ``false`` as argument for ``ViewBuilder::setLayout()``
  or ``View::setLayout()`` to set ``View::$layout`` property to ``false``.
  Instead use ``ViewBuilder::disableAutoLayout()`` and ``View::disableAutoLayout()``
  to render a view template without a layout.
* ``Cake\View\View`` will re-render views if ``render()`` is called multiple
  times instead of returning ``null``.
* Constants ``View::NAME_ELEMENT`` and ``View::NAME_LAYOUT`` have been removed.
  You can use ``View::TYPE_ELEMENT`` and ``View::TYPE_LAYOUT``.

Helper
------

* ``Cake\View\Helper\PaginatorHelper::hasPage()`` has had its arguments
  reversed. This makes it consistent with other paginator methods where the
  'model' is the second argument.
* ``Cake\View\Helper\UrlHelper::build()`` no longer accepts a boolean for the
  second parameter. You must use ``['fullBase' => true]`` instead.
* You must now only use ``null`` as 1st argument of ``FormHelper::create()`` to
  create a form without context. Passing any other value for which context cannot
  be inferred will result in an exception being thrown.
* ``Cake\View\Helper\FormHelper`` and ``Cake\View\Helper\HtmlHelper`` now
  use HTML data attribute ``data-confirm-message`` to hold the confirmation
  message for methods which have the ``confirm`` option.
* ``Cake\View\Helper\FormHelper::button()`` now HTML entity encodes the button
  text and HTML attributes by default. A new option ``escapeTitle`` has been
  added to allow controlling escaping the title separately from other HTML
  attributes.

Miscellaneous
-------------

* ``App::path()`` now uses ``$type`` ``templates`` instead of ``Template`` to
  get templates path. Similarly ``locales`` is used instead of ``Locale`` to
  get path to locales folder.
* ``ObjectRegistry::get()`` now throws exception if object with provided name is not loaded.
  You should use ``ObjectRegistry::has()`` to ensure that the object exists in registry.
  The magic getter ``ObjectRegistry::__get()`` will continue to return ``null`` if object
  with given name is not loaded.
* Locale files have been moved from ``src/Locale`` to ``resources/locales``.
* The ``cacert.pem`` file that was bundled in CakePHP has been replaced by
  a dependency on `composer/ca-bundle <https://packagist.org/packages/composer/ca-bundle>__`.


New Features
============

Console
-------

* Command classes can implement the ``defaultName()`` method to overwrite the
  conventions based CLI name.

Table
-----

* ``Table::newEmptyEntity()`` has been added to create a new and empty entity
  object.  This does not trigger any field validation. The entity can be
  persisted without validation error as an empty record. ``Table::newEntity()``
  now requires an array as input and enforces validation to prevent accidental
  saves without validation being triggered.

Database
--------

* If your database's timezone does not match PHP timezone then you can use the
  ``DateTime::setTimezone()`` method. See :ref:`datetime-type` for details.
* ``Cake\Database\Log\LoggedQuery`` now implements ``JsonSerializable``.
* ``Cake\Database\Connection`` now allows using any PSR-3 logger. As a result
  those using the standalone database package are no longer forced to use
  the ``cakephp/log`` package for logging.
* ``Cake\Database\Connection`` now allows using any PSR-16 cacher. As a result
  those using the standalone database package are no longer forced to use
  the ``cakephp/cache`` package for caching. New methods ``Cake\Database\Connection::setCache()``
  and ``Cake\Database\Connection::getCache()`` have been added.
* ``Cake\Database\ConstraintsInterface`` was extracted from
  ``Cake\Datasource\FixtureInterface``. This interface should be
  implemented by fixture implementations that support constraints, which from
  our experience is generally relational databases.

Error
-----

* If an error is raised by a controller action in a prefixed route,
  ``ErrorController`` will attempt to use a prefixed error template if one is
  available. This behavior is only applied when ``debug`` is off.

Http
----

* CakePHP now supports the `PSR-15: HTTP Server Request Handlers <https://www.php-fig.org/psr/psr-15/>`__ specification.
  As a consequence the middlewares now implement ``Psr\Http\Server\MiddlewareInterface``.
  CakePHP 3.x style invokable double pass middlewares are still supported for backwards compatibility.
* ``Cake\Http\Client`` now follows `PSR-18: HTTP Client <https://www.php-fig.org/psr/psr-18/>`__ specifications.
* ``Cake\Http\Client\Response::isSuccess()`` was added. This method returns true
  if the response status code is 2xx.
* ``CspMiddleware`` was added to make defining Content Security Policy headers
  simpler.

Mailer
------

* Email message generation responsibility has now been transferred to
  ``Cake\Mailer\Renderer``.  This is mainly an architectural change and doesn't
  impact how ``Email`` class is used. The only difference is that you now need
  to use ``Email::setViewVars()`` instead of ``Email::set()`` to set template
  variables.

ORM
---

* ``Table::saveManyOrFail()`` method has been added that will throw
  ``PersistenceFailedException`` with the specific entity that failed in case of
  an error. The entities are saved transaction safe.
* ``Table::deleteMany()`` and ``Table::deleteManyOrFail()`` methods have been
  added for removing many entities at once including callbacks. The entities are
  removed transaction safe.

Routing
-------

* ``Cake\Routing\Asset`` was added. This class exposes asset URL generation in
  a static interface similar to ``Router::url()``. See :ref:`asset-routing` for
  more information.

TestSuite
---------

* ``TestSuite\EmailTrait::assertMailContainsAttachment()`` was added.

View
----

* ``FormHelper`` now generates HTML5 validation messages for fields marked as
  "notEmpty" in an entity's ORM table class. This feature can be toggled with the
  ``autoSetCustomValidity`` class configuration option.
* ``FormHelper`` now generates native HTML5 input tags for datetime fields.
  Check the :ref:`Form Helper <create-datetime-controls>` page for more details.
  If you need to retain the former markup, a shimmed FormHelper can be found in `Shim plugin <https://github.com/dereuromark/cakephp-shim>`__ with the old behavior/generation (4.x branch).
