2.5 Migration Guide
###################

CakePHP 2.5 is a fully API compatible upgrade from 2.4.  This page outlines
the changes and improvements made in 2.5.

Cache
=====

- A new adapter has been added for ``Memcached``. This new adapter uses
  ext/memcached instead of ext/memcache. It supports improved performance and
  shared persistent connections.
- The ``Memcache`` adapter is now deprecated in favor of ``Memcached``.
- :php:meth:`Cache::remember()` was added.
- :php:meth:`Cache::config()` now accepts ``database`` key when used with
  :php:class:`RedisEngine` in order to use non-default database number.

Console
=======

SchemaShell
-----------

- The ``create`` and ``update`` subcommands now have a ``yes`` option. The
  ``yes`` option allows you to skip the various interactive questions forcing
  a yes reply.

CompletionShell
---------------

- The CompletionShell was added. It aims to assist in the creation of
  autocompletion libraries for shell environments like bash, or zsh. No shell
  scripts are included in CakePHP, but the underlying tools are now available.

Controller
==========

AuthComponent
-------------
- ``loggedIn()`` is now deprecated and will be removed in 3.0.

CookieComponent
---------------

- :php:class:`CookieComponent` can use the new AES-256 encryption offered by
  :php:class:`Security`. You can enable this by calling
  :php:meth:`CookieComponent::type()` with 'aes'.

Scaffold
--------
- Dynamic Scaffold is now deprecated and will be removed in 3.0.

Event
=====

EventManager
------------

Events bound to the global manager are now fired in priority order with events
bound to a local manager. This can cause listeners to be fired in a different
order than they were in previous releases. Instead of all global listeners being triggered,
and then instance listeners being fired afterwards, the two sets of listeners
are combined into one list of listeners based on their priorities and then fired
as one set. Global listeners of a given priority are still fired before instance
listeners.

Model
=====

- Unsigned integers are now supported by datasources that provide them (MySQL).
  You can set the ``unsigned`` option to true in your schema/fixture files to
  start using this feature.

Network
=======

CakeRequest
-----------

- :php:meth:`CakeRequest::addDetector()` now supports ``options`` which
  accepts an array of valid options when creating param based detectors.

Routing
=======

Router
------

- :php:meth:`Router::mapResources()` accepts ``connectOptions`` key in the
  ``$options`` argument. See :ref:`custom-rest-routing` for more details.

Utility
=======

Validation
----------

- The third param for :php:meth:`Validation::inList()` and :php:meth:`Validation::multiple()` has been
  modified from `$strict` to `$caseInsensitive`. `$strict` has been dropped as it was working incorrectly
  and could easily backfire.
  You can now set this param to true for case insensitive comparison. The default is false and
  will compare the value and list case sensitive as before.

Hash
----

- :php:meth:`Hash::insert()` and :php:meth:`Hash::remove()` now support matcher
  expressions in their path selectors.

Folder
------

- :php:meth:`Folder::addPathElement()` now accepts an array for the ``$element``
  parameter.

Security
--------

- :php:meth:`Security::encrypt()` and :php:meth:`Security::decrypt()` were
  added. These methods expose a very simple API to access AES-256 symmetric encryption.
  They should be used in favour of the ``cipher()`` and ``rijndael()`` methods.

Logging
=======

FileLog
-------

- CakeLog does not auto-configure itself anymore. As a result log files will not be auto-created
  anymore if no stream is listening. Please make sure you got at least one default engine set up
  if you want to listen to all types and levels.

Error
=====

ExceptionRenderer
-----------------

The ExceptionRenderer now populates the error templates with "code", "message" and "url" variables.
"name" has been deprecated but is still available. This unifies the variables across all error templates.

View
====

View
----

- ``$title_for_layout`` is deprecated. Use ``$this->fetch('title');`` instead.
- :php:meth:`View::get()` now accepts a second argument to provide a default
  value.

FormHelper
----------

- FormHelper will now generate file inputs for ``binary`` field types now.

PaginationHelper
----------------

- :php:meth:`PaginatorHelper::sort()` now has a ``lock`` option to create pagination sort links with
  the default direction only.

ScaffoldView
------------

- Dynamic Scaffold is now deprecated and will be removed in 3.0.
