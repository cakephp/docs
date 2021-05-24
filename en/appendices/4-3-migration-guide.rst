4.3 Migration Guide
###################

CakePHP 4.3 is an API compatible upgrade from 4.0. This page outlines the
deprecations and features added in 4.3.

Upgrading to 4.3.0
==================

You can can use composer to upgrade to CakePHP 4.3.0::

    php composer.phar require --update-with-dependencies "cakephp/cakephp:^4.3@beta"

Deprecations
============

4.3 introduces a few deprecations. All of these features will continue for the
duration of 4.x but will be removed in 5.0. You can use the
:ref:`upgrade tool <upgrade-tool-use>` to automate updating usage of deprecated
features::

    bin/cake upgrade rector --rules cakephp43 <path/to/app/src>

.. note::
    This only updates CakePHP 4.3 changes. Make sure you apply CakePHP 4.2 changes first.

A new configuration option has been added to disable deprecations on a path by
path basis. See :ref:`deprecation-warnings` for more information.

Log
---

- ``FileLog`` moved the ``dateFormat`` config option to ``DefaultFormatter``.
- ``ConsoleLog`` moved the ``dateFormat`` config option to ``DefaultFormatter``.
- ``SyslogLog`` moved the ``format`` config option to ``SyslogFormatter``.

Behavior Changes
================

While the following changes do not change the signature of any methods they do
change the semantics or behavior of methods.

Command
-------

- ``cake i18n extract`` no longer has a ``--relative-paths`` option. This option
  is on by default now.

ORM
---

- Aligned ``Entity::isEmpty()`` and ``Entity::hasValue()`` to treat '0' as a non-empty value. 
  This aligns the behavior with documentation and original intent.
- ``TranslateBehavior`` entity validation errors are now set in the
  ``_translations.{lang}`` path instead of ``{lang}``. This normalizes the
  entity error path with the fields used for request data. If you have forms
  that modify multiple translations at once, you may need to update how you
  render validation errors.

Routing
-------

- ``RouteBuilder::resources()`` now generates routes that use 'braced'
  placeholders.

Validation
----------

- ``Validator::setProvider()`` now raises an exception when a non-object,
  non-string provider name is used. Previously there would be no error, but the
  provider would also not work.


Breaking Changes
================

Behind the API, some breaking changes are necessary moving forward.
They usually only affect tests.

Log
---

- ``BaseLog::_getFormattedDate()`` and ``dateFormat`` config were removed
  since the message formatting logic was moved into log formatters.


New Features
============

Database
========

- Database mapping types can now implement
  ``Cake\Database\Type\ColumnSchemaAwareInterface`` to specify 
  column sql generation and column schema reflection. This allows
  custom types handle non-standard columns.
- Logged queries now use ``TRUE`` and ``FALSE`` for postgres, sqlite and mysql
  drivers. This makes it easier to copy queries and run them in an interactive
  prompt.
- The ``DatetimeType`` can now convert request data from the user's timezone
  to the application timezone. See
  :ref:`converting-request-data-from-user-timezone` for more information.

Http
====

- The ``CspMiddleware`` now sets the ``cspScriptNonce`` and ``cspStyleNonce``
  request attributes which streamlines the adoption of strict
  content-security-policy rules.
  
Log
---

- Log engines now use formatters to format the message string before writing.
  This can be configured with the ``formatter`` config option. Any log engine configs
  that were moved to the formatter are copied with a deprecation notice.
- ``AbstractFormatter`` was added for all custom formatters to extend.
- ``DefaultFormatter`` was added which creates the existing message format used by
  ``ConsoleLog`` and ``FileLog`. This formatter is the default for that log engine.
- ``SyslogFormatter`` was added which creates the existing message format used by
  ``SyslogLog``. This formatter is the default for that log engine.

ORM
---

- Queries that ``contain()`` HasMany and BelongsToMany associations now
  propagate the status of result casting. This ensures that results from all
  associations are either cast with type mapping objects or not at all.
- ``Table`` now includes ``label`` in the list of fields that are candidates for
  ``displayField`` defaults.
- Added ``Query::whereNotInListOrNull()`` and ``QueryExpression::notInOrNull()`` for nullable
  columns since ``null != value`` is always false and the ``NOT IN`` test will always fail when
  the column is null.

View
====

- ``HtmlHelper::script()`` and ``HtmlHelper::css()`` now add the ``nonce``
  attribute to generated tags when the ``cspScriptNonce`` and ``cspStyleNonce``
  request attributes are present.
