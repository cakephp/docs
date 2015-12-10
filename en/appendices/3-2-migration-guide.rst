3.2 Migration Guide
###################

CakePHP 3.2 is an API compatible upgrade from 3.1. This page outlines
the changes and improvements made in 3.2.

Minimum PHP 5.5 Required
========================

CakePHP 3.2 requires at least PHP 5.5. By adopting PHP 5.5 we can provide better
Date and Time libraries and remove dependencies on password compatiblity
librarires.

Carbon Replaced with Chronos
============================

The Carbon library has been replaced with cakephp/chronos. This new library is
a fork of Carbon with no additional dependencies. It also offer a calendar date
object, and immutable versions of both date and datetime objects.

Helpers
=======

Helpers can now have an ``initialize(array $config)`` hook method like other
class types.

New Date Object
===============

The ``Date`` class allows you to cleanly map ``DATE`` columns into PHP objects.
Date instances will always fix their time to ``00:00:00 UTC``. By default the
ORM creates instances of ``Date`` when mapping ``DATE`` columns now.

New Immutable Date and Time Objects
===================================

The ``FrozenTime``, and ``FrozenDate`` classes were added. These
classes offer the same API as the ``Time`` object has. These objects are
immutable, which helps prevent accidental mutations. Instead of in-place
modifications, modifier methods return *new* instances::

    use Cake\I18\FrozenTime;

    $time = new FrozenTime('2016-01-01 12:23:32');
    $newTime = $time->modify('+1 day');

In the above code ``$time`` and ``$newTime`` are different objects. The
``$time`` object retains its original value, while ``$newTime`` has the modified
value. See the :ref:`immutable-time` section for more information. You can also
enable immutable datetime objects in your entities. See the
:ref:`immutable-datetime-mapping` section for more information.

CorsBuilder Added
=================

In order to make setting headers related to Cross Origin Requests (CORS) easier,
a new ``CorsBuilder`` has been added. This class lets you define CORS related
headers with a fluent interface. See :ref:`cors-headers` for more information.

ORM
---

* Containing the same association multiple times now works as expected, and the
  query builder functions are now stacked.
