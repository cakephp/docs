Time
####

.. php:namespace:: Cake\I18n

.. php:class:: Time

If you need :php:class:`TimeHelper` functionalities outside of a ``View``,
use the ``Time`` class::

    use Cake\I18n\Time;

    class UsersController extends AppController
    {

        public function initialize()
        {
            parent::initialize();
            $this->loadComponent('Auth');
        }

        public function afterLogin()
        {
            $time = new Time($this->Auth->user('date_of_birth'));
            if ($time->isToday()) {
                // Greet user with a happy birthday message
                $this->Flash->success(__('Happy birthday to you...'));
            }
        }
    }


Under the hood, CakePHP uses `Carbon <https://github.com/briannesbitt/Carbon>`_
to power its Time utility. Anything you can do with ``Carbon`` and
``DateTime``, you can do with ``Time``.

For details on Carbon please see `their documentation <http://carbon.nesbot.com/docs/>`_.

.. start-time

Creating Time Instances
=======================

There are a few ways to create ``Time`` instances::

    use Cake\I18n\Time;

    // Create from a string datetime.
    $time = Time::createFromFormat(
        'Y-m-d H:i:s',
        $datetime,
        'America/New_York'
    );

    // Create from a timestamp
    $time = Time::createFromTimestamp($ts);

    // Get the current time.
    $time = Time::now();

    // Or just use 'new'
    $time = new Time('2014-01-10 11:11', 'America/New_York');

    $time = new Time('2 hours ago');

The ``Time`` class constructor can take any paramenter the internal ``DateTime``
PHP class can. When passing a number or numeric string, it will be interpreted
as a UNIX timestamp.

In test cases, you can easily mock out ``now()`` using ``setTestNow()``::

    // Fixate time.
    $now = new Time('2014-04-12 12:22:30');
    Time::setTestNow($now);

    // Returns '2014-04-12 12:22:30'
    $now = Time::now();

    // Returns '2014-04-12 12:22:30'
    $now = Time::parse('now');

Manipulation
============

Once created, you can manipulate ``Time`` instances using setter methods::

    $now = Time::now();
    $now->year(2013)
        ->month(10)
        ->day(31);

You can also use the methods provided by PHP's built-in ``DateTime`` class::

    $now->setDate(2013, 10, 31);

Dates can be modified through subtraction and addition of their components::

    $now = Time::now();
    $now->subDays(5);
    $now->addMonth(1);

    // Using strtotime strings.
    $now->modify('+5 days');

You can get the internal components of a date by accessing its properties::

    $now = Time::now();
    echo $now->year; // 2014
    echo $now->month; // 5
    echo $now->day; // 10
    echo $now->timezone; // America/New_York

It is also allowed to directly assign those properties to modify the date::

    $time->year = 2015;
    $time->timezone = 'Europe/Paris';

Formatting
==========

.. php:method:: i18nFormat($format = null, $timezone = null, $locale = null)

A very common thing to do with ``Time`` instances is to print out formatted
dates. CakePHP makes this a snap::

    $now = Time::parse('2014-10-31');

    // Prints a localized datetime stamp.
    echo $now;

    // Outputs '4/20/14, 10:10 PM' for the en-US locale
    $now->i18nFormat();

    // Use the full date and time format
    $now->i18nFormat(\IntlDateFormatter::FULL);

    // Use full date but short time format
    $now->i18nFormat([\IntlDateFormatter::FULL, \IntlDateFormatter::SHORT]);

    // Outputs '2014-04-20 22:10'
    $now->i18nFormat('YYYY-MM-dd HH:mm:ss');

.. php:method:: nice()

Print out a predefined 'nice' format::

    $now = Time::parse('2014-10-31');

    // Outputs 'Oct 31, 2014 12:32pm' in en-US
    echo $now->nice();

You can alter the timezone in which the date is displayed without altering the
``Time`` object itself. This is useful when you store dates in one timezone, but
want to display them in a user's own timezone::

    $now->i18nFormat(\IntlDateFormatter::FULL, 'Europe/Paris');

Leaving the first parameter as null will use the default formatting string::

    $now->i18nFormat(null, 'Europe/Paris');

Finally, it is possible to use a different locale for displaying a date::

    echo $now->i18nFormat(\IntlDateFormatter::FULL, 'Europe/Paris', 'fr-FR');

    echo $now->nice('Europe/Paris', 'fr-FR');

Setting the Default Locale and Format String
--------------------------------------------

The default locale in which dates are displayed when using ``nice``
``18nFormat`` is taken from the directive
`intl.default_locale <http://www.php.net/manual/en/intl.configuration.php#ini.intl.default-locale>`_.
You can, however, modify this default at runtime::

    Time::$defaultLocale = 'es-ES';

From now on, dates will be displayed in the Spanish preferred format, unless
a different locale is specified directly in the formatting method.

Likewise, it is possible to alter the default formatting string to be used for
``i18nFormat``::

    Time::setToStringFormat(\IntlDateFormatter::SHORT);

    Time::setToStringFormat([\IntlDateFormatter::FULL, \IntlDateFormatter::SHORT]);

    Time::setToStringFormat('YYYY-MM-dd HH:mm:ss');

It is recommended to always use the constants instead of directly passing a date
format string.

Formatting Relative Times
-------------------------

.. php:method:: timeAgoInWords(array $options = [])

Often it is useful to print times relative to the present::

    $now = new Time('Aug 22, 2011');
    echo $now->timeAgoInWords(
        ['format' => 'MMM d, YYY', 'end' => '+1 year']
    );
    // On Nov 10th, 2011 this would display: 2 months, 2 weeks, 6 days ago

The ``end`` option lets you define at which point after which relative times
should be formatted using the ``format`` option. The ``accuracy`` option lets
us control what level of detail should be used for each interval range::

    // If $timestamp is 1 month, 1 week, 5 days and 6 hours ago
    echo $timestamp->timeAgoInWords([
        'accuracy' => ['month' => 'month'],
        'end' => '1 year'
    ]);
    // Outputs '1 month ago'

By setting ``accuracy`` to a string, you can specify what is the maximum level
of detail you want output::

    $time = new Time('+23 hours');
    // Outputs 'in about a day'
    $result = $time->timeAgoInWords([
        'accuracy' => 'day'
    ]);

Conversion
==========

.. php:method:: toQuarter()

Once created, you can convert ``Time`` instances into timestamps or quarter
values::

    $time = new Time('2014-06-15');
    $time->toQuarter();
    $time->toUnixString();

Comparing With the Present
==========================

.. php:method:: isYesterday()
.. php:method:: isThisWeek()
.. php:method:: isThisMonth()
.. php:method:: isThisYear()

You can compare a ``Time`` instance with the present in a variety of ways::

    $time = new Time('2014-06-15');

    echo $time->isYesterday();
    echo $time->isThisWeek();
    echo $time->isThisMonth();
    echo $time->isThisYear();

Each of the above methods will return ``true``/``false`` based on whether or
not the ``Time`` instance matches the present.

Comparing With Intervals
========================

.. php:method:: isWithinNext($interval)

You can see if a ``Time`` instance falls within a given range using
``wasWithinLast()`` and ``isWithinNext()``::

    $time = new Time('2014-06-15');

    // Within 2 days.
    echo $time->isWithinNext(2);

    // Within 2 next weeks.
    echo $time->isWithinNext('2 weeks');

.. php:method:: wasWithinLast($interval)

You can also compare a ``Time`` instance within a range in the past::

    // Within past 2 days.
    echo $time->wasWithinLast(2);

    // Within past 2 weeks.
    echo $time->wasWithinLast('2 weeks');

.. end-time

Accepting Localized Request Data
================================

When creating text inputs that manipulate dates, you'll probably want to accept
and parse localized datetime strings. See the :ref:`parsing-localized-dates`.

.. meta::
    :title lang=en: Time
    :description lang=en: Time class helps you format time and test time.
    :keywords lang=en: time,format time,timezone,unix epoch,time strings,time zone offset,utc,gmt
