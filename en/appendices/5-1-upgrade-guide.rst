5.1 Upgrade Guide
#################

The 5.1.0 release is a backwards compatible with 5.0. It adds new functionality
and introduces new deprecations. Any functionality deprecated in 5.x will be
removed in 6.0.0.

Behavior Changes
================

- FormHelper no longer generates ``aria-required`` attributes on input elements
  that also have the ``required`` attribute set. The ``aria-required`` attribute
  is redundant on these elements and generates HTML validation warnings. If you
  are using ``aria-required`` attribute in styling or scripting you'll need to
  update your application.


Deprecations
============

I18n
----

- The ``_cake_core_`` cache config key has been renamed to ``_cake_translations_``.


New Features
============

Console
-------

- ``Arguments::getBooleanOption()`` and ``Arguments::getMultipleOption()`` were added.

Http
----

- ``SecurityHeadersMiddleware::setPermissionsPolicy()`` was added. This method
  adds the ability to define ``permissions-policy`` header values.
- ``Client`` now emits ``HttpClient.beforeSend`` and ``HttpClient.afterSend``
  events when requests are sent. You can use these events to perform logging,
  caching or collect telemetry.

Validation
----------

- ``Validation::enum()`` and ``Validator::enum()`` were added. These validation
  methods simplify validating backed enum values.

View
----

- View cells now emit events around their actions ``Cell.beforeAction`` and
  ``Cell.afterAction``.
