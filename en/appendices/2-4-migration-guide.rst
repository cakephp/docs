2.4 Migration Guide
###################

CakePHP 2.4 is a fully API compatible upgrade from 2.3.  This page outlines
the changes and improvements made in 2.4.

Console
=======

- Logged notice messages will now be colourized in terminals that support
  colours.

SchemaShell
-----------

- ``cake schema generate`` now supports the ``--exclude`` parameter.

BakeShell
---------

- ``cake bake model`` now supports baking ``$behaviors``. Finding `lft`, `rght` and `parent_id` fields
  in your table it will add the Tree behavior, for example. You can also extend the ModelTask to support your own
  behaviors to be recognized.

FixtureTask
-----------

- ``cake bake fixture`` now supports a ``--schema`` parameter to allow baking all fixtures with noninteractive "all"
  while using schema import.

Core
====

Object
------

- :php:meth:`Object::log()` had the ``$scope`` parameter added.


Components
==========

AuthComponent
-------------
- AuthComponent now supports proper stateless mode when using `Basic` or `Digest`
  authenticators. Starting of session can be prevented by setting :php:property:`AuthComponent::$sessionKey`
  to false. Also now when using only `Basic` or `Digest` you are no longer
  redirected to login page. For more info check the :php:class:`AuthComponent` page.

PasswordHasher
--------------
- Authenticating objects now use new password hasher objects for password hash
  generation and checking. See :ref:`hashing-passwords` for more info.

Model
=====

Models
------

- :php:meth:`Model::save()`, :php:meth:`Model::saveField()`, :php:meth:`Model::saveAll()`,
  :php:meth:`Model::saveAssociated()`, :php:meth:`Model::saveMany()`
  now take a new ``counterCache`` option. You can set it to false to avoid
  updating counter cache values for the particular save operation.

Datasource
----------

- Mysql, Postgres, and SQLserver now support a 'settings' array in the
  connection definition. This key => value pair will be issued as ``SET`` commands when the
  connection is created.

View
====

JsonView
--------

- JSONP support has been added to :php:class:`JsonView`.

HtmlHelper
----------
- The API for :php:meth::`HtmlHelper::css()` has been changed.

TextHelper
----------
- :php:meth::`TextHelper::autoParagraph()` has been added. It allows to automatically convert text into HTML paragraphs.

Network
=======

CakeRequest
-----------

- :php:meth:`CakeRequest::param()` has been added.

- :php:meth:`CakeRequest::is()` has been modified to support an array of types and will return true if the request matches any type.

- :php:meth:`CakeRequest::isAll()` has been added to check that a request matches all the given types.


CakeEmail
---------

- Logged email messages now have the scope of ``email`` by default. If you are
  not seeing email contents in your logs, be sure to add the ``email`` scope to
  your logging configuration.


I18n
====

L10n
----

- ``ell`` is now the default locale for Greek as specified by ISO 639-3 and ``gre`` its alias.
  The locale folders have to be adjusted accordingly (from `/Locale/gre/` to `/Locale/ell/`).
- ``fas`` is now the default locale for Farsi as specified by ISO 639-3 and ``per`` its alias.
  The locale folders have to be adjusted accordingly (from `/Locale/per/` to `/Locale/fas/`).
- ``sme`` is now the default locale for Sami as specified by ISO 639-3 and ``smi`` its alias.
  The locale folders have to be adjusted accordingly (from `/Locale/smi/` to `/Locale/sme/`).
- ``mkd`` replaces ```mk`` as default locale for Macedonian as specified by ISO 639-3.
  The corresponding locale folders have to be adjusted, as well.
- Catalog code ``in`` has been dropped in favor of ``id`` (Indonesian),
  ``e`` has been dropped in favor of ``el`` (Greek),
  ``n`` has been dropped in favor of ``nl`` (Dutch),
  ``p`` has been dropped in favor of ``pl`` (Polish),
  ``sz`` has been dropped in favor of ``se`` (Sami).
- Kazakh has been added with ``kaz`` as locale and ``kk`` as catalog code.
- Kalaallisut has been added with ``kal`` as locale and ``kl`` as catalog code.

Logging
=======

FileLog
-------

- Two new config options ``size`` and ``rotate`` have been added for :ref:`FileLog <file-log>` engine.

SyslogLog
---------

- The new logging engine :ref:`SyslogLog <syslog-log>` was added to stream messages to syslog.

Utility
=======

General
-------

- :php:func:`pr` no longer outputs HTML when running in cli mode.


Validation
----------

- :php:meth:`Validation::date()` now supports the ``y`` and ``ym`` formats.
- The country code of :php:meth:`Validation::phone()` for Canada has been changed from ``can`` to
  ``ca`` to unify the country codes for validation methods according to ISO 3166 (two letter codes).

CakeNumber
----------

- The currencies ``AUD``, ``CAD`` and ``JPY`` have been added.
- The symbols for ``GBP`` and ``EUR`` are now UTF-8. If you upgrade a non-UTF-8 application,
  make sure that you update the static ``$_currencies`` attribute with the appropriate
  HTML entity symbols (``&#163;`` and ``&#8364;``) before you use those currencies.

CakeTime
--------

- :php:meth:`CakeTime::isPast()` and :php:meth:`CakeTime::isFuture()` were
  added.

Xml
---

- New option ``pretty`` has been added to :php:meth:`Xml::fromArray()` to return nicely formatted Xml


Error
=====

ErrorHandler
------------

- New configuration option ``skipLog`` has been added, to allow skipping certain
  Exception types to be logged. ``Configure::write('Exception.skipLog', array('NotFoundException', 'ForbiddenException'));``
  will avoid these exceptions and the ones extending them to be be logged when
  ``'Exception.log'`` config is ``true``

