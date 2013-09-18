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

Console
=======

SchemaShell
-----------

- The ``create`` and ``update`` subcommands now have a ``yes`` option. The
  ``yes`` option allows you to skip the various interactive questions forcing
  a yes reply.

Controller
==========

CookieComponent
---------------

- :php:class:`CookieComponent` can use the new AES-256 encryption offered by
  :php:class:`Security`. You can enable this by calling
  :php:meth:`CookieComponent::type()` with 'aes'.

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

Hash
----

- :php:meth:`Hash::insert()` and :php:meth:`Hash::remove()` now support matcher
  expressions in their path selectors.

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

View
====

View
----

- :php:meth:`View::get()` now accepts a second argument to provide a default
  value.
