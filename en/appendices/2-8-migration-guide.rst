2.8 Migration Guide
###################

CakePHP 2.8 is a fully API compatible upgrade from 2.7. This page outlines
the changes and improvements made in 2.8.

PHP7 Compatibility
==================

CakePHP 2.8 is compatible with, and tested against PHP7.

Deprecations
============

* The ``action`` option in ``FormHelper::create()`` has been deprecated. This is
  a backport from 3.x.
  Note that this now makes the ``action`` key of an array URL consistently
  respected for the generation of the DOM ID.
  If you used the deprecated key you want to compare the generated ID for the
  form before and after.

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
- Find conditions can now use ``IN`` and ``NOT IN`` operator in conditions. This
  allows find expressions to be more forwards compatible with 3.x.

Validation
==========

- ``Validation::uploadedFile()`` was backported from 3.x.

View
====

FormHelper
----------

``'url' => false`` is now supported for ``FormHelper::create()`` to allow form
tags to be created without HTML ``action`` attribute. This is a backport from
3.x.
