2.8 Migration Guide
###################

CakePHP 2.8 is a fully API compatible upgrade from 2.7. This page outlines
the changes and improvements made in 2.8.

Error Handling
==============

- When handling fatal errors, CakePHP will now adjust the memory limit by 4MB to
  ensure that the error can be logged correctly. You can disable this behavior
  by setting ``Error.extraFatalErrorMemory`` to ``0`` in your
  ``Config/core.php``.

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

Shell Helpers Added
===================

Console applications can now create helper classes that encapsulate re-usable
blocks of output logic. See the :doc:`/console-and-shells/helpers` section
for more information.

I18nShell
=========

- A new option ``no-locations`` has been added. When enabled, this option will
  disable the generation of location references in your POT files.

Hash
====

- ``Hash::sort()`` now supports case-insensitive sorting via the ``ignoreCase``
  option.

Model
=====

- Magic finders now support custom finder types. For example if your model
  implements a ``find('published')`` finder, you can now use ``findPublishedBy``
  and ``findPublishedByAuthorId`` functions through the magic method interface.

Validation
==========

- ``Validation::uploadedFile()`` was backported from 3.x.

