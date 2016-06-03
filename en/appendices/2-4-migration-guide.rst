2.4 Migration Guide
###################

CakePHP 2.4 is a fully API compatible upgrade from 2.3. This page outlines
the changes and improvements made in 2.4.

Console
=======

- Logged notice messages will now be colourized in terminals that support
  colours.
- ConsoleShell is now deprecated.

SchemaShell
-----------

- ``cake schema generate`` now supports the ``--exclude`` parameter.
- The constant ``CAKEPHP_SHELL`` is now deprecated and will be removed in CakePHP 3.0.

BakeShell
---------

- ``cake bake model`` now supports baking ``$behaviors``. Finding `lft`, `rght` and `parent_id` fields
  in your table it will add the Tree behavior, for example. You can also extend the ModelTask to support your own
  behaviors to be recognized.
- ``cake bake`` for views, models, controllers, tests and fixtures now supports a ``-f`` or ``--force`` parameter to
  force overwriting of files.
- Tasks in core can now be aliased in the same way you would Helpers, Components and Behaviors

FixtureTask
-----------

- ``cake bake fixture`` now supports a ``--schema`` parameter to allow baking all fixtures with noninteractive "all"
  while using schema import.

Core
====

Constants
---------

- Constants ``IMAGES_URL``, ``JS_URL``, ``CSS_URL`` have been deprecated and
  replaced with config variables ``App.imageBaseUrl``, ``App.jsBaseUrl``,
  ``App.cssBaseUrl`` respectively.

- Constants ``IMAGES``, ``JS``, ``CSS`` have been deprecated.

Object
------

- :php:meth:`Object::log()` had the ``$scope`` parameter added.


Components
==========

AuthComponent
-------------
- AuthComponent now supports proper stateless mode when using 'Basic' or 'Digest'
  authenticators. Starting of session can be prevented by setting :php:attr:`AuthComponent::$sessionKey`
  to false. Also now when using only 'Basic' or 'Digest' you are no longer
  redirected to login page. For more info check the :php:class:`AuthComponent` page.
- Property :php:attr:`AuthComponent::$authError` can be set to boolean ``false`` to suppress flash message from being displayed.

PasswordHasher
--------------
- Authenticating objects now use new password hasher objects for password hash
  generation and checking. See :ref:`hashing-passwords` for more info.

DbAcl
-----

- DbAcl now uses ``INNER`` joins instead of ``LEFT`` joins. This improves
  performance for some database vendors.

Model
=====

Models
------

- :php:meth:`Model::save()`, :php:meth:`Model::saveField()`, :php:meth:`Model::saveAll()`,
  :php:meth:`Model::saveAssociated()`, :php:meth:`Model::saveMany()`
  now take a new ``counterCache`` option. You can set it to false to avoid
  updating counter cache values for the particular save operation.
- :php:meth:`Model::clear()` was added.

Datasource
----------

- The Mysql, Postgres, and Sqlserver datasources now support a 'settings' array in the
  connection definition. This key => value pair will be issued as ``SET`` commands when the
  connection is created.
- The MySQL driver now supports SSL options.


View
====

JsonView
--------

- JSONP support has been added to :php:class:`JsonView`.
- The ``_serialize`` key now supports renaming serialized variables.
- When debug > 0 JSON will be pretty printed.

XmlView
-------

- The ``_serialize`` key now supports renaming serialized variables.
- When debug > 0 XML will be pretty printed.

HtmlHelper
----------

- The API for :php:meth:`HtmlHelper::css()` has been been simplified. You can
  now provide an array of options as the second argument. When you do, the
  ``rel`` attribute defaults to 'stylesheet'.
- New option ``escapeTitle`` added to :php:meth:`HtmlHelper::link()` to control
  escaping of only link title and not attributes.

TextHelper
----------

- :php:meth:`TextHelper::autoParagraph()` has been added. It allows to
  automatically convert text into HTML paragraphs.

PaginatorHelper
---------------

- :php:meth:`PaginatorHelper::param()` has been added.
- The first page no longer contains ``/page:1`` or ``?page=1`` in the URL. This helps prevent
  duplicate content issues where you would need to use canonical or noindex otherwise.

FormHelper
----------

- The ``round`` option was added to :php:meth:`FormHelper::dateTime()`. Can be set to ``up`` or ``down``
  to force rounding in either direction. Defaults to null which rounds half up according to ``interval``.

Network
=======

CakeRequest
-----------

- :php:meth:`CakeRequest::param()` has been added.
- :php:meth:`CakeRequest::is()` has been modified to support an array of types and will return true if the request matches any type.
- :php:meth:`CakeRequest::isAll()` has been added to check that a request matches all the given types.

CakeResponse
------------

- :php:meth:`CakeResponse::location()` has been added to get or set the redirect location header.

CakeEmail
---------

- Logged email messages now have the scope of ``email`` by default. If you are
  not seeing email contents in your logs, be sure to add the ``email`` scope to
  your logging configuration.
- :php:meth:`CakeEmail::emailPattern()` was added. This method can be used to
  relax email validation rules. This is useful when dealing with certain
  Japanese hosts that allow non-compliant addresses to be used.
- :php:meth:`CakeEmail::attachments()` now allows you to provide the file
  contents directly using the ``data`` key.
- Configuration data is now correctly merged with transport classes.

HttpSocket
----------

- :php:meth:`HttpSocket::patch()` has been added.


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
- ``mkd`` replaces ``mk`` as default locale for Macedonian as specified by ISO 639-3.
  The corresponding locale folders have to be adjusted, as well.
- Catalog code ``in`` has been dropped in favor of ``id`` (Indonesian),
  ``e`` has been dropped in favor of ``el`` (Greek),
  ``n`` has been dropped in favor of ``nl`` (Dutch),
  ``p`` has been dropped in favor of ``pl`` (Polish),
  ``sz`` has been dropped in favor of ``se`` (Sami).
- Kazakh has been added with ``kaz`` as locale and ``kk`` as catalog code.
- Kalaallisut has been added with ``kal`` as locale and ``kl`` as catalog code.
- The constant ``DEFAULT_LANGUAGE`` has been deprecated in favor of Configure value ``Config.language``.

Logging
=======

- Log engines do not need the suffix ``Log`` anymore in their setup configuration. So for the
  FileLog engine it suffices to define ``'engine' => 'File'`` now. This unifies the way engines
  are named in configuration (see Cache engines for example).
  Note: If you have a Log engine like ``DatabaseLogger`` that does not follow the convention to
  use a suffix ``Log`` for your class name you have to adjust your class name to ``DatabaseLog``.
  You should also avoid class names like ``SomeLogLog`` which include the suffix twice at the end.

FileLog
-------

- Two new config options ``size`` and ``rotate`` have been added for :ref:`FileLog <file-log>` engine.
- In debug mode missing directories will now be automatically created to avoid unnecessary errors thrown.

SyslogLog
---------

- The new logging engine :ref:`SyslogLog <syslog-log>` was added to stream messages to syslog.

Cache
=====

FileEngine
----------

- In debug mode missing directories will now be automatically created to avoid unnecessary errors thrown.

Utility
=======

General
-------

- :php:func:`pr()` no longer outputs HTML when running in CLI mode.

Sanitize
--------

- ``Sanitize`` class has been deprecated.

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
- The ``fractionExponent`` option was added to
  :php:meth:`CakeNumber::currency()`.

CakeTime
--------

- :php:meth:`CakeTime::isPast()` and :php:meth:`CakeTime::isFuture()` were
  added.
- :php:meth:`CakeTime::timeAgoInWords()` has two new options to customize the output strings:
  ``relativeString`` (defaults to ``%s ago``) and ``absoluteString`` (defaults to ``on %s``).
- :php:meth:`CakeTime::timeAgoInWords()` uses fuzzy terms when time is below thresholds.


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

Routing
=======

Router
------

- :php:meth:`Router::fullBaseUrl()` was added together with ``App.fullBaseUrl`` Configure value. They replace
  :php:const:`FULL_BASE_URL` which is now deprecated.
- :php:meth:`Router::parse()` now parses query string arguments.


