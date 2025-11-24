Date & Time
###########

.. php:namespace:: Cake\I18n

.. php:class:: DateTime

If you need :php:class:`TimeHelper` functionalities outside of a ``View``,
use the ``DateTime`` class::

    use Cake\I18n\DateTime;

    class UsersController extends AppController
    {
        public function initialize(): void
        {
            parent::initialize();
            $this->loadComponent('Authentication.Authentication');
        }

        public function afterLogin()
        {
            $identity = $this->Authentication->getIdentity();
            $time = new DateTime($identity->date_of_birth);
            if ($time->isToday()) {
                // Greet user with a happy birthday message
                $this->Flash->success(__('Happy birthday to you...'));
            }
        }
    }

Under the hood, CakePHP uses `Chronos <https://github.com/cakephp/chronos>`_
to power its ``DateTime`` utility. Anything you can do with ``Chronos`` and
PHP's ``DateTimeImmutable``, you can do with ``DateTime``.

For more details on Chronos please see `the API documentation
<https://api.cakephp.org/chronos/>`_.

.. start-time

Creating DateTime Instances
===========================

``DateTime`` are immutable objects as immutability prevents accidental changes
to data, and avoids order based dependency issues.

There are a few ways to create ``DateTime`` instances::

    use Cake\I18n\DateTime;

    // Create from a string datetime.
    $time = DateTime::createFromFormat(
        'Y-m-d H:i:s',
        '2021-01-31 22:11:30',
        'America/New_York'
    );

    // Create from a timestamp and set timezone
    $time = DateTime::createFromTimestamp(1612149090, 'America/New_York');

    // Get the current time.
    $time = DateTime::now();

    // Or just use 'new'
    $time = new DateTime('2021-01-31 22:11:30', 'America/New_York');

    $time = new DateTime('2 hours ago');

The ``DateTime`` class constructor can take any parameter that the internal ``DateTimeImmutable``
PHP class can. When passing a number or numeric string, it will be interpreted
as a UNIX timestamp.

In test cases, you can mock out ``now()`` using ``setTestNow()``::

    // Fixate time.
    $time = new DateTime('2021-01-31 22:11:30');
    DateTime::setTestNow($time);

    // Outputs '2021-01-31 22:11:30'
    $now = DateTime::now();
    echo $now->i18nFormat('yyyy-MM-dd HH:mm:ss');

    // Outputs '2021-01-31 22:11:30'
    $now = DateTime::parse('now');
    echo $now->i18nFormat('yyyy-MM-dd HH:mm:ss');

Manipulation
============

Remember, ``DateTime`` instance always return a new instance from setters
instead of modifying itself::

    $time = DateTime::now();

    // Create and reassign a new instance
    $newTime = $time->year(2013)
        ->month(10)
        ->day(31);
    // Outputs '2013-10-31 22:11:30'
    echo $newTime->i18nFormat('yyyy-MM-dd HH:mm:ss');

You can also use the methods provided by PHP's built-in ``DateTime`` class::

    $time = $time->setDate(2013, 10, 31);

Failing to reassign the new ``DateTime`` instances will result in the
original, unmodified instance being used::

    $time->year(2013)
        ->month(10)
        ->day(31);
    // Outputs '2021-01-31 22:11:30'
    echo $time->i18nFormat('yyyy-MM-dd HH:mm:ss');

You can create another instance with modified dates, through subtraction and
addition of their components::

    $time = DateTime::create(2021, 1, 31, 22, 11, 30);
    $newTime = $time->subDays(5)
        ->addHours(-2)
        ->addMonths(1);
    // Outputs '2/26/21, 8:11 PM'
    echo $newTime;

    // Using strtotime strings.
    $newTime = $time->modify('+1 month -5 days -2 hours');
    // Outputs '2/26/21, 8:11 PM'
    echo $newTime;

You can get the internal components of a date by accessing its properties::

    $time = DateTime::create(2021, 1, 31, 22, 11, 30);
    echo $time->year; // 2021
    echo $time->month; // 1
    echo $time->day; // 31
    echo $time->timezoneName; // America/New_York

Formatting
==========

.. php:staticmethod:: setJsonEncodeFormat($format)

This method sets the default format used when converting an object to json::

    DateTime::setJsonEncodeFormat('yyyy-MM-dd HH:mm:ss');  // For any immutable DateTime
    Date::setJsonEncodeFormat('yyyy-MM-dd HH:mm:ss');  // For any mutable Date

    $time = DateTime::parse('2021-01-31 22:11:30');
    echo json_encode($time);   // Outputs '2021-01-31 22:11:30'

    Date::setJsonEncodeFormat(static function($time) {
        return $time->format(DATE_ATOM);
    });

.. note::
    This method must be called statically.

.. note::
    Be aware that this is not a PHP Datetime string format! You need to use a
    ICU date formatting string as specified in the following resource:
    https://unicode-org.github.io/icu/userguide/format_parse/datetime/#datetime-format-syntax.

.. versionchanged:: 4.1.0
    The ``callable`` parameter type was added.


.. php:method:: i18nFormat($format = null, $timezone = null, $locale = null)

A very common thing to do with ``Time`` instances is to print out formatted
dates. CakePHP makes this a snap::

    $time = DateTime::parse('2021-01-31 22:11:30');

    // Prints a localized datetime stamp. Outputs '1/31/21, 10:11 PM'
    echo $time;

    // Outputs '1/31/21, 10:11 PM' for the en-US locale
    echo $time->i18nFormat();

    // Use the full date and time format. Outputs 'Sunday, January 31, 2021 at 10:11:30 PM Eastern Standard Time'
    echo $time->i18nFormat(\IntlDateFormatter::FULL);

    // Use full date but short time format. Outputs 'Sunday, January 31, 2021 at 10:11 PM'
    echo $time->i18nFormat([\IntlDateFormatter::FULL, \IntlDateFormatter::SHORT]);

    // Outputs '2021-Jan-31 22:11:30'
    echo $time->i18nFormat('yyyy-MMM-dd HH:mm:ss');

It is possible to specify the desired format for the string to be displayed.
You can either pass `IntlDateFormatter constants
<https://www.php.net/manual/en/class.intldateformatter.php>`_ as the first
argument of this function, or pass a full ICU date formatting string as
specified in the following resource:
https://unicode-org.github.io/icu/userguide/format_parse/datetime/#datetime-format-syntax.

You can also format dates with non-gregorian calendars::

    // On ICU version 66.1
    $time = DateTime::create(2021, 1, 31, 22, 11, 30);

    // Outputs 'Sunday, Bahman 12, 1399 AP at 10:11:30 PM Eastern Standard Time'
    echo $time->i18nFormat(\IntlDateFormatter::FULL, null, 'en-IR@calendar=persian');

    // Outputs 'Sunday, January 31, 3 Reiwa at 10:11:30 PM Eastern Standard Time'
    echo $time->i18nFormat(\IntlDateFormatter::FULL, null, 'en-JP@calendar=japanese');

    // Outputs 'Sunday, Twelfth Month 19, 2020(geng-zi) at 10:11:30 PM Eastern Standard Time'
    echo $time->i18nFormat(\IntlDateFormatter::FULL, null, 'en-CN@calendar=chinese');

    // Outputs 'Sunday, Jumada II 18, 1442 AH at 10:11:30 PM Eastern Standard Time'
    echo $time->i18nFormat(\IntlDateFormatter::FULL, null, 'en-SA@calendar=islamic');

The following calendar types are supported:

* japanese
* buddhist
* chinese
* persian
* indian
* islamic
* hebrew
* coptic
* ethiopic

.. note::
    For constant strings i.e. IntlDateFormatter::FULL Intl uses ICU library
    that feeds its data from CLDR (https://cldr.unicode.org/) which version
    may vary depending on PHP installation and give different results.

.. php:method:: nice()

Print out a predefined 'nice' format::

    $time = DateTime::parse('2021-01-31 22:11:30', new \DateTimeZone('America/New_York'));

    // Outputs 'Jan 31, 2021, 10:11 PM' in en-US
    echo $time->nice();

You can alter the timezone in which the date is displayed without altering the
``DateTime`` object itself. This is useful when you store dates in one timezone, but
want to display them in a user's own timezone::

    // Outputs 'Monday, February 1, 2021 at 4:11:30 AM Central European Standard Time'
    echo $time->i18nFormat(\IntlDateFormatter::FULL, 'Europe/Paris');

    // Outputs 'Monday, February 1, 2021 at 12:11:30 PM Japan Standard Time'
    echo $time->i18nFormat(\IntlDateFormatter::FULL, 'Asia/Tokyo');

    // Timezone is unchanged. Outputs 'America/New_York'
    echo $time->timezoneName;

Leaving the first parameter as ``null`` will use the default formatting string::

    // Outputs '2/1/21, 4:11 AM'
    echo $time->i18nFormat(null, 'Europe/Paris');

Finally, it is possible to use a different locale for displaying a date::

    // Outputs 'lundi 1 février 2021 à 04:11:30 heure normale d’Europe centrale'
    echo $time->i18nFormat(\IntlDateFormatter::FULL, 'Europe/Paris', 'fr-FR');

    // Outputs '1 févr. 2021 à 04:11'
    echo $time->nice('Europe/Paris', 'fr-FR');

Setting the Default Locale and Format String
--------------------------------------------

The default locale in which dates are displayed when using ``nice``
``i18nFormat`` is taken from the directive
`intl.default_locale <https://www.php.net/manual/en/intl.configuration.php#ini.intl.default-locale>`_.
You can, however, modify this default at runtime::

    DateTime::setDefaultLocale('es-ES');
    Date::setDefaultLocale('es-ES');

    // Outputs '31 ene. 2021 22:11'
    echo $time->nice();

From now on, datetimes will be displayed in the Spanish preferred format unless
a different locale is specified directly in the formatting method.

Likewise, it is possible to alter the default formatting string to be used for
``i18nFormat``::

    DateTime::setToStringFormat(\IntlDateFormatter::SHORT); // For any DateTime
    Date::setToStringFormat(\IntlDateFormatter::SHORT); // For any Date

    // The same method exists on Date, and DateTime
    DateTime::setToStringFormat([
        \IntlDateFormatter::FULL,
        \IntlDateFormatter::SHORT
    ]);
    // Outputs 'Sunday, January 31, 2021 at 10:11 PM'
    echo $time;

    // The same method exists on Date and DateTime
    DateTime::setToStringFormat("EEEE, MMMM dd, yyyy 'at' KK:mm:ss a");
    // Outputs 'Sunday, January 31, 2021 at 10:11:30 PM'
    echo $time;

It is recommended to always use the constants instead of directly passing a date
format string.

.. note::
    Be aware that this is not a PHP Datetime string format! You need to use a
    ICU date formatting string as specified in the following resource:
    https://unicode-org.github.io/icu/userguide/format_parse/datetime/#datetime-format-syntax.

Formatting Relative Times
-------------------------

.. php:method:: timeAgoInWords(array $options = [])

Often it is useful to print times relative to the present::

    $time = new DateTime('Jan 31, 2021');
    // On June 12, 2021, this would output '4 months, 1 week, 6 days ago'
    echo $time->timeAgoInWords(
        ['format' => 'MMM d, YYY', 'end' => '+1 year']
    );

The ``end`` option lets you define at which point after which relative times
should be formatted using the ``format`` option. The ``accuracy`` option lets
us control what level of detail should be used for each interval range::

    // Outputs '4 months ago'
    echo $time->timeAgoInWords([
        'accuracy' => ['month' => 'month'],
        'end' => '1 year'
    ]);

By setting ``accuracy`` to a string, you can specify what is the maximum level
of detail you want output::

    $time = new DateTime('+23 hours');
    // Outputs 'in about a day'
    echo $time->timeAgoInWords([
        'accuracy' => 'day'
    ]);

Conversion
==========

.. php:method:: toQuarter()
.. php:method:: toQuarterRange()

Once created, you can convert ``DateTime`` instances into timestamps or quarter
values::

    $time = new DateTime('2021-01-31');
    echo $time->toQuarter();  // Outputs '1'
    echo $time->toUnixString();  // Outputs '1612069200'

.. versionadded:: 5.3.0
    The ``toQuarterRange()`` method was added.

You can also get the date range for a quarter::

    $time = new DateTime('2021-01-31');
    $range = $time->toQuarterRange();
    // Outputs ['2021-01-01', '2021-03-31']

    $time = new DateTime('2021-12-25');
    $range = $time->toQuarterRange();
    // Outputs ['2021-10-01', '2021-12-31']

Comparing With the Present
==========================

.. php:method:: isYesterday()
.. php:method:: isThisWeek()
.. php:method:: isThisMonth()
.. php:method:: isThisYear()

You can compare a ``DateTime`` instance with the present in a variety of ways::

    $time = new DateTime('+3 days');

    debug($time->isYesterday());
    debug($time->isThisWeek());
    debug($time->isThisMonth());
    debug($time->isThisYear());

Each of the above methods will return ``true``/``false`` based on whether or
not the ``DateTime`` instance matches the present.

Comparing With Intervals
========================

.. php:method:: isWithinNext($interval)

You can see if a ``DateTime`` instance falls within a given range using
``wasWithinLast()`` and ``isWithinNext()``::

    $time = new DateTime('+3 days');

    // Within 2 days. Outputs 'false'
    debug($time->isWithinNext('2 days'));

    // Within 2 next weeks. Outputs 'true'
    debug($time->isWithinNext('2 weeks'));

.. php:method:: wasWithinLast($interval)

You can also compare a ``DateTime`` instance within a range in the past::

    $time = new DateTime('-72 hours');

    // Within past 2 days. Outputs 'false'
    debug($time->wasWithinLast('2 days'));

    // Within past 3 days. Outputs 'true'
    debug($time->wasWithinLast('3 days'));

    // Within past 2 weeks. Outputs 'true'
    debug($time->wasWithinLast('2 weeks'));

.. end-time

Date
====

.. php:class:: Date

The immutable ``Date`` class in CakePHP represents calendar dates unaffected by
time and timezones. The ``Date`` class wraps the ``Cake\\Chronos\\ChronosDate`` class.

.. note::

    Unlike the ``DateTime`` class, ``Date`` does not extends the ``DateTimeInterface``.
    So you cannot cannot directly compare a ``Date`` instance with a ``DateTime`` instance.
    But you can do comparisons like ``$dateTime->toNative() > $date->toNative()``.

Time
====

.. php:class:: Time

The ``Time`` class represents clock times independent of date or time zones
Similar to the ``DateTime`` and ```Date`` classes, the ``Time`` class is also immutable.
It wraps the ``Cake\\Chronos\\ChronosTime`` class.

Accepting Localized Request Data
================================

When creating text inputs that manipulate dates, you'll probably want to accept
and parse localized datetime strings. See the :ref:`parsing-localized-dates`.

.. meta::
    :title lang=en: Time
    :description lang=en: Time class helps you format time and test time.
    :keywords lang=en: time,format time,timezone,unix epoch,time strings,time zone offset,utc,gmt

Supported Timezones
===================

CakePHP supports all valid PHP timezones. For a list of supported timezones, `see this page <https://php.net/manual/en/timezones.php>`_.
