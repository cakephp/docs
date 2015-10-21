2.8 Migration Guide
###################

CakePHP 2.8 is a fully API compatible upgrade from 2.7. This page outlines
the changes and improvements made in 2.8.

Cache
=====

- ``Cache::add()`` has been added. This method lets you add data to
  a cache if the key did not already exist. This method will work atomically in
  Memcached, Memcache, APC and Redis. Other cache backends will do non-atomic
  operations.

CakeTime
========

- ``CakeTime::listTimezones()`` has been changed to accept array in the last
  argument. Valid values for the ``$options`` argument are: ``group``,
  ``abbr``, ``before``, and ``after``.

I18nShell
=========

- A new option ``no-locations`` has been added. When enabled, this option will
  disable the generation of location references in your POT files.

Hash
====

- ``Hash::sort()`` now supports case-insensitive sorting via the ``ignoreCase``
  option.

Validation
==========

- ``Validation::uploadedFile()`` was backported from 3.x.

