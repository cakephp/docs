2.4 Migration Guide
###################

CakePHP 2.4 is a fully API compatible upgrade from 2.3.  This page outlines
the changes and improvements made in 2.4.

Console
=======

SchemaShell
-----------

- ``cake schema generate`` now supports the ``--exclude`` parameter.


Core
====

Object
------

- php:meth:`Object::log()` had the ``$scope`` parameter added.


Model
=====

Models
------

- :php:meth:`Model::save()`, :php:meth:`Model::saveField()`, :php:meth:`Model::saveAll()`,
  :php:meth:`Model::saveAssociated()`, :php:meth:`Model::saveMany()`
  now take a new ``counterCache`` option. You can set it to false to avoid
  updating counter cache values for the particular save operation.

View
====

JsonView
--------

- JSONP support has been added to :php:class:`JsonView`.

HtmlHelper
----------
- The API for :php:meth::`HtmlHelper::css()` has been changed.

Network
=======

CakeRequest
-----------

- :php:meth:`CakeRequest::param()` was added.


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


Utility
=======

General
-------

- :php:func:`pr` no longer outputs HTML when running in cli mode.


Validation
----------

- :php:meth:`Validation::date()` now supports the ``y`` and ``ym`` formats.


CakeNumber
----------

- The currencies ``AUD``, ``CAD`` and ``JPY`` have been added.
- The symbols for ``GBP`` and ``EUR`` are now UTF-8. If you upgrade a non-UTF-8 application,
  make sure that you update the static ``$_currencies`` attribute with the appropriate
  HTML entity symbols (``&#163;`` and ``&#8364;``) before you use those currencies.
