2.6 Migration Guide
###################

CakePHP 2.6 is a fully API compatible upgrade from 2.5.  This page outlines
the changes and improvements made in 2.6.

Basics.php
==========

- ``stackTrace()`` has been added as a convenience wrapper function for ``Debugger::trace()``.
  It directly echos just as ``debug()`` does. But only if debug level is on.
- New i18n functions have been added. The new functions allow you to include
  message context which allows you disambiguate possibly confusing message
  strings. For example 'read' can mean multiple things in English depending on
  the context. The new ``__x``, ``__xn``, ``__dx``, ``__dxn``, ``__dxc``,
  ``__dxcn``, and ``__xc`` functions provide access to the new features.

Cache
=====

RedisEngine
-----------

- The ``RedisEngine`` now has a default prefix of ``Inflector::slug(APP_DIR)``.

Console
=======

ConsoleOptionParser
-------------------

- ``ConsoleOptionParser::removeSubcommand()`` was added.

Shell
-----

- ``overwrite()`` has been added to allow generating progress bars or to avoid outputting
  too many lines by replacing text that has been already outputted to the screen.

Controller
==========

AuthComponent
-------------

- ``AuthComponent`` had the ``userFields`` option added.
- AuthComponent now triggers an ``Auth.afterIdentify`` event after a user has
  been identified and logged in. The event will contain the logged in user as
  data.

Behavior
========

AclBehavior
-----------

- ``Model::parentNode()`` now gets the type (Aro, Aco) passed as first argument: ``$model->parentNode($type)``.

Datasource
==========

Mysql
-----

- The ``RLIKE`` wildcard operator has been added to allow regular expression pattern lookups this way.
- Schema migrations with MySQL now support an ``after`` key when adding
  a column. This key allows you to specify which column the new one should be
  added after.


Model
=====

Model
-----

- ``Model::save()`` had the ``atomic`` option back-ported from 3.0.
- ``Model::afterFind()`` now always uses a consistent format for afterFind().
  When ``$primary`` is false, the results will always be located under
  ``$data[0]['ModelName']``. You can set the ``useConsistentAfterFind`` property
  to false on your models to restore the original behavior.

Network
=======

CakeRequest
-----------

- ``CakeRequest::param()`` can now read values using :ref:`hash-path-syntax`
  like ``data()``.
- ``CakeRequest:setInput()`` was added.

HttpSocket
----------

- ``HttpSocket::head()`` was added.
- You can now use the ``protocol`` option to override the specific protocol to
  use when making a request.


I18n
====

- Configure value ``I18n.preferApp`` can now be used to control the order of translations.
  If set to true it will prefer the app translations over any plugins' ones.


Utility
=======

CakeTime
--------

- ``CakeTime::timeAgoInWords()`` now supports ``strftime()`` compatible absolute
  date formats. This helps make localizing formatted times easier.

Hash
----

- ``Hash::get()`` now raises an exception when the path argument is invalid.
- ``Hash::nest()`` now raises an exception when the nesting operation results in
  no data.


Validation
----------

- ``Validation::between`` has been deprecated, you should use
  :php:meth:`Validation::lengthBetween` instead.
- ``Validation::ssn`` has been deprecated and can be provided as standalone/plugin solution.


View
====

JsonView
--------

- ``JsonView`` now supports the ``_jsonOptions`` view variable.
  This allows you to configure the bit-mask options used when generating JSON.

XmlView
-------

- ``XmlView`` now supports the ``_xmlOptions`` view variable.
  This allows you to configure the options used when generating XML.


Helper
======

HtmlHelper
----------

- :php:meth:`HtmlHelper::css()` had the ``once`` option added. It works the same
  as the ``once`` option for ``HtmlHelper::script()``. The default value is
  ``false`` to maintain backwards compatibility.
- The ``$confirmMessage`` argument of :php:meth:`HtmlHelper::link()` has been
  deprecated. You should instead use key ``confirm`` in ``$options`` to specify
  the message.

FormHelper
----------

- The ``$confirmMessage`` argument of :php:meth:`FormHelper::postLink()` has been
  deprecated. You should instead use key ``confirm`` in ``$options`` to specify
  the message.
- The ``maxlength`` attribute will now also be applied to textareas, when the corresponding
  DB field is of type varchar, as per HTML specs.

PaginatorHelper
---------------

- :php:meth:`PaginatorHelper::meta()` has been added to output the meta-links (rel prev/next) for a paginated result set.
