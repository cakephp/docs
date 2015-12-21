Chronos
=======

Chronos provides a zero-dependency collection of extensions to the ``DateTime``
object. In addition to convenience methods, chronos provides:

* ``Date`` objects for representing calendar dates.
* Immutable date and datetime objects.
* An pluggable translation system. Only english translations are included in the
  library. However, ``cakephp/i18n`` can be used for full language support.

Installation
============

To install chronos, you should use ``composer``. From your
application's ROOT directory (where composer.json file is located) run the
following::

    php composer.phar require cakephp/chronos "@stable"

Overview
========

Chronos provides a number of extensions to the DateTime objects provided by PHP.
Chronos provides 5 classes that cover mutable and immutable date/time variants
and extensions to ``DateInterval``.

* ``Cake\Chronos\Chronos`` is an immutable *date and time* object.
* ``Cake\Chronos\Date`` is a immutable *date* object.
* ``Cake\Chronos\MutableTime`` is a mutable *date and time* object.
* ``Cake\Chronos\MutableDate`` is a mutable *date* object.
* ``Cake\Chronos\ChronosInterval`` is an extension to the ``DateInterval``
  object.

Lastly, if you want to typehint against chronos provided date/time objects you
should use ``Cake\Chronos\ChronosInterface``. All of the date and time objects
implement this interface.

Creating Instances
==================

There are many ways to get an instance of Chronos or Date. There are a number of
factory methods that work with different argument sets::

    use Cake\Chronos\Chronos;

    $now = Chronos::now();
    $today = Chronos::today();
    $yesterday = Chronos::yesterday();
    $tomorrow = Chronos::tomorrow();

    // Parse relative expressions
    $date = Chronos::parse('+2 days, +3 hours');

    // Date and time integer values.
    $date = Chronos::create(2015, 12, 25, 4, 32, 58);

    // Date or time integer values.
    $date = Chronos::createFromDate(2015, 12, 25);
    $date = Chronos::createFromTime(11, 45, 10);

    // Parse formatted values.
    $date = Chronos::createFromFormat('m/d/Y', '06/15/2015');

Working with Immutable Objects
==============================

If you've used PHP's ``DateTime`` objects, you're comfortable with *mutable*
objects. Chronos offer mutable objects, but it also provides *immutable*
objects. Immutable objects create copies of objects each time an object is
modified. Because modifier methods around datetimes are not always transparent,
data can be modified accidentally or without the developer knowing.
Immutable objects prevent accidental changes to
data, and make code free of order based dependency issues. Immutablility
does mean tha you will need toremember to replace variables when using
modifiers::

    // This code doesn't work with immutable objects
    $time->addDay(1);
    doSomething($time);
    return $time

    // This works like you'd expect
    $time = $time->addDay(1);
    $time = doSomething($time);
    return $time

By capturing the return value of each modification your code will work as
expected. If you ever have an immutable object, and want to create a mutable
one, you can use ``toMutable()``::

    $inplace = $time->toMutable();

Date Objects
============

PHP only provides a single DateTime object. Representing calendar dates can be
a bit awkward with this class as it includes timezones, and time components that
don't really belong in the concept of a 'day'. Chronos provides a ``Date``
object that allows you to represent dates. The time and timezone for these
objects is always fixed to ``00:00:00 UTC`` and all formatting/difference
methods operate at the day resolution::

    use Cake\Chronos\Date;

    $today = Date::today();

    // Changes to the time/timezone are ignored.
    $today->modify('+1 hours');

    // Outputs '2015-12-20'
    echo $today;

Modifier Methods
================

Chronos objects provide modifier methods that let you modify the value in
a fine-grained way::

    // Set components of the datetime value.
    $halloween = Date::create()
        ->year(2015)
        ->month(10)
        ->day(31)
        ->hour(20)
        ->minute(30);

You can also modify parts of a date relatively::

    $future = Date::create()
        ->addYear(1)
        ->subMonth(2)
        ->addDays(15)
        ->addHours(20)
        ->subMinutes(2);

Comparison Methods
==================

Once you have 2 instances of Chronos date/time objects you can compare them in
a variety of ways::

    // Full suite of comparators exist
    // ne, gt, lt, lte.
    $first->eq($second);
    $first->gte($second);

    // See if the current object is between two others.
    $now->between($start, $end);

    // Find which argument is closest or farthest.
    $now->closest($june, $november);
    $now->farthest($june, $november);

You can also inquire about where a given value falls on the calendar::

    $now->isToday();
    $now->isYesterday();
    $now->isFuture();
    $now->isPast();

    // Check the day of the week
    $now->isWeekend();

    // All other weekday methods exist too.
    $now->isMonday();

You can also find out if a value was within a relative time period::

    $time->wasWithinLast('3 days');
    $time->isWithinNext('3 hours');

Generating Differences
======================

In addition to comparing datetimes, calcuating differences or deltas between to
values is a common task::

    // Get a DateInterval representing the difference
    $first->diff($second);

    // Get difference as a count of specific units.
    $first->diffInDays($second);
    $first->diffInWeeks($second);
    $first->diffInYears($second);

You can generate human readable differences suitable for use in a feed or
timeline::

    // Difference from now.
    echo $date->diffForHumans();

    // Difference from another point in time.
    echo $date->diffForHumans($other);

Formatting Strings
==================


Testing Aids
============

