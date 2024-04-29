5.1 Migration Guide
###################

The 5.1.0 release is a backwards compatible with 5.0. It adds new functionality
and introduces new deprecations. Any functionality deprecated in 5.x will be
removed in 6.0.0.

Behavior Changes
================

- Connection now creats unique read and write drivers if the keys ``read`` or
  ``write`` are present in the config regardless of values.
- FormHelper no longer generates ``aria-required`` attributes on input elements
  that also have the ``required`` attribute set. The ``aria-required`` attribute
  is redundant on these elements and generates HTML validation warnings. If you
  are using ``aria-required`` attribute in styling or scripting you'll need to
  update your application.

- Text Utility and TextHelper methods around truncation and maximum length are using
  a UTF-8 character for ``ellipsis`` instead of ``...`` legacy characters.

- ``TableSchema::setColumnType()`` now throws an exception if the specified column
  does not exist.

- ``PluginCollection::addPlugin()`` now throws an exception if a plugin of the same
  name is already added.

- ``TestCase::loadPlugins()`` will now clear out any previously loaded plugins. So
  you must specify all plugins required for any subsequent tests.

Deprecations
============

I18n
----

- The ``_cake_core_`` cache config key has been renamed to ``_cake_translations_``.


New Features
============

Cache
-----

- ``RedisEngine`` now supports a ``tls`` option that enables connecting to redis
  over a TLS connection. You can use the ``ssl_ca``, ``ssl_cert`` and
  ``ssl_key`` options to define the TLS context for redis.

Command
-------

- ``bin/cake plugin list`` has been added to list all available plugins,
  their load configuration and version.
- Optional ``Command`` arguments can now have a ``default`` value.

Console
-------

- ``Arguments::getBooleanOption()`` and ``Arguments::getMultipleOption()`` were added.

Core
----

- ``PluginConfig`` was added. Use this class to get all available plugins, their load config and versions.
- The ``toString``, ``toInt``, ``toBool`` functions were added. They give you
  a typesafe way to cast request data or other input and return ``null`` when conversion fails.
- ``pathCombine()`` was added to help build paths without worrying about duplicate and trailing slashes.

Database
--------

- ``SelectQuery::__debugInfo()`` now includes which connection role the query
  is for.

Datasource
----------

- ``RulesChecker::remove()``, ``removeCreate()``, ``removeUpdate()``, and
  ``removeDelete()`` methods were added. These methods allow you to remove rules
  by name.

Http
----

- ``SecurityHeadersMiddleware::setPermissionsPolicy()`` was added. This method
  adds the ability to define ``permissions-policy`` header values.
- ``Client`` now emits ``HttpClient.beforeSend`` and ``HttpClient.afterSend``
  events when requests are sent. You can use these events to perform logging,
  caching or collect telemetry.
- ``Http\Server::terminate()`` was added. This method triggers the
  ``Server.terminate`` event which can be used to run logic after the response
  has been sent in fastcgi environments. In other environments the
  ``Server.terminate`` event runs *before* the response has been sent.

I18n
----

- ``Number::formatter()`` and ``currency()`` now accept a ``roundingMode``
  option to override how rounding is done.

TestSuite
---------

- ``ConnectionHelper`` methods are now all static. This class has no state and
  its methods were updated to be static.
- ``LogTestTrait`` was added. This new trait makes it easy to capture logs in
  your tests and make assertions on the presence or absence of log messages.

Utility
-------

- ``Hash::insert()`` and ``Hash::remove()`` now accept ``ArrayAccess`` objects along with ``array`` data.

Validation
----------

- ``Validation::enum()`` and ``Validator::enum()`` were added. These validation
  methods simplify validating backed enum values.
- ``Validation::enumOnly()`` and ``Validation::enumExcept()`` were added to check for specific cases
  and further simplify validating backed enum values.

View
----

- View cells now emit events around their actions ``Cell.beforeAction`` and
  ``Cell.afterAction``.
- ``NumberHelper::format()`` now accepts a ``roundingMode`` option to override how
  rounding is done.

Helpers
-------

- ``TextHelper::autoLinkUrls()`` has options added for better link label printing:
  * ``stripProtocol``: Strips ``http://`` and ``https://`` from the beginning of the link. Default off.
  * ``maxLength``: The maximum length of the link label. Default off.
  * ``ellipsis``: The string to append to the end of the link label. Defaults to UTF8 version.
