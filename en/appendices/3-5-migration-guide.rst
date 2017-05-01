3.5 Migration Guide
###################

CakePHP 3.5 is an API compatible upgrade from 3.4. This page outlines the
changes and improvements made in 3.5.

Deprecations
============

The following is a list of deprecated methods, properties and behaviors. These
features will continue to function until 4.0.0 after which they will be removed.

* ``Cake\Http\Client\CookieCollection`` is deprecated. Use
  ``Cake\Http\Cookie\CookieCollection`` instead.

Deprecated Combined Get/Set Methods
-----------------------------------

In the past CakePHP has leveraged 'modal' methods that provide both
a get and set mode. These methods complicate IDE autocompletion and our ability
to add stricter return types in the future. For these reasons, combined get/set
methods are being split into separate get and set methods.

The following is a list of methods that are deprecated and replaced with
``getX()`` and ``setX()`` methods:

``Cake\Console\Shell``
    * ``io()``
``Cake\Console\ConsoleIo``
    * ``outputAs()``
``Cake\Console\ConsoleOutput``
    * ``outputAs()``
``Cake\Datasource\ModelAwareTrait``
    * ``modelType()``
``Cake\Database\Query``
    * ``valueBinder()`` is now ``getValueBinder()``
``Cake\Datasource\QueryTrait``
    * ``eagerLoaded()`` (now ``isEagerLoaded()``)
``Cake\Event\EventDispatcherTrait``
    * ``eventManager()``
``Cake\Error\Debugger``
    * ``outputAs()`` (now ``getOutputFormat()`` / ``setOutputFormat()``)
``Cake\Http\ServerRequest``
    * ``env()`` (now ``getEnv()`` / ``withEnv()``)
``Cake\ORM\LocatorAwareTrait``
    * ``tableLocator()``
``Cake\Utility\Security``
    * ``salt()``
``Cake\View\View``
    * ``template()``
    * ``layout()``
    * ``theme()``
    * ``templatePath()``
    * ``layoutPath()``
    * ``autoLayout()`` (now ``isAutoLayoutEnabled()`` / ``enableAutoLayout()``)

Behavior Changes
================

While these changes are API compatible, they represent minor variances in
behavior that may affect your application:

* ``BehaviorRegistry``, ``HelperRegistry`` and ``ComponentRegistry`` will now
  raise exceptions when ``unload()`` is called with an unknown object name. This
  change should help find errors easier by making possible typos more visible.
* ``HasMany`` associations now gracefully handle empty values set for the
  association property, similar to ``BelongsToMany`` associations - that is they
  treat ``false``, ``null``, and empty strings the same way as empty arrays. For
  ``HasMany`` associations this now results in all associated records to be
  deleted/unlinked in case the ``replace`` save strategy is being used.
  Consequently this allows to use forms to delete/unlink all associated records
  by passing an empty string. Previously this would have required custom
  marshalling logic, without that it would have only been possible to remove all
  but one record, as form data cannot be used to describe empty arrays.
* ``Http\Client`` no longer uses the ``cookie()`` method results when building
  requests. Instead the ``Cookie`` header and internal CookieCollection are
  used. This should only effect applications that have a custom HTTP adapter in
  their clients.
* Multi-word subcommand names previouly required camelBacked names to be used
  when invoking shells. Now subcommands can be invoked with underscored_names.
  For example: ``cake tool initMyDb`` can now be called with ``cake tool
  init_my_db``. If your shells previously bound two subcommands with different
  inflections, only the last bound command will function.

New Features
============

* New Cookie & CookieCollection classes have been added. These classes allow you
  to work with cookies in an object-orientated way, and are available on
  ``Cake\Http\ServerRequest``, ``Cake\Http\Repsonse``, and
  ``Cake\Http\Client\Response``. See the :ref:`request-cookies` and
  :ref:`response-cookies` for more information.
* New middleware has been added to make applying security headers easier. See
  :ref:`security-header-middleware` for more information.
* New middleware has been added to transparently encrypt cookie data. See
  :ref:`encrypted-cookie-middleware` for more information.
* ``Cake\Event\EventManager::on()`` and ``off()`` methods are now chainable
  making it simpler to set multiple events at once.
* ``Cake\Validation\Validator::regex()`` was added for a more convenient way
  to validate data against a regex pattern.
* ``Cake\Routing\Router::reverseToArray()`` was added. This method allow you to
  convert a request object into an array that can be used to generate URL
  strings.
* ``Cake\Routing\RouteBuilder::resources()`` had the ``path`` option
  added. This option lets you make the resource path and controller name not
  match.
* New abstract types were added for ``smallinteger`` and ``tinyinteger``.
  Existing ``SMALLINT`` and ``TINYINT`` columns will now be reflected as these
  new abstract types. ``TINYINT(1)`` columns will continue to be treated as
  boolean columns in MySQL.
* ``Cake\Validation\Validator::addDefaultProvider()`` was added. This method
  lets you inject validation providers into all the validators created in your
  application.
