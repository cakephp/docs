Time
####

.. php:namespace:: Cake\Utility

.. php:class:: Time

If you need :php:class:`TimeHelper` functionalities outside of a ``View``,
use the ``Time`` class::

    use Cake\Utility\Time;

    class UsersController extends AppController {

        public $components = array('Auth');

        public function afterLogin() {
            $time = new Time($this->Auth->user('date_of_birth'));
            if ($time->isToday()) {
                // greet user with a happy birthday message
                $this->Session->setFlash(__('Happy birthday to you...'));
            }
        }
    }


Under the hood, CakePHP uses `Carbon <https://github.com/briannesbitt/Carbon>`_
to power its Time utility. Anything you could do with ``Carbon`` you can do with
``Time``.

.. start-time

Creating Time Instances
=======================

There are a few ways to create ``Time`` instances::

    use Cake\Utility\Time;

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

In test cases you can easily mock out ``now()`` using ``setTestNow()``::

    // Fixate time.
    $now = new Time('2014-04-12 12:22:30');
    Time::setTestNow($now);

    // Returns '2014-04-12 12:22:30'
    $now = Time::now();

    // Returns '2014-04-12 12:22:30'
    $now = Time::parse('now');

Manipulation
============

Once created you can manipulate ``Time`` instances using setter methods::

    $now = Time::now();
    $now->year(2013)
        ->month(10)
        ->day(31);

You can also use the methods provided by PHP's built-in DateTime class::

    $now->setDate(2013, 10, 31);

Dates can be modified through subtraction and addition of their components::

    $now = Time::now();
    $now->subDays(5);
    $now->addMonth(1);

    // Using strtotime strings.
    $now->modify('+5 days');

Formatting
==========

.. php:method:: i18nFormat($format = null, $timezone = null, $locale = null)

A very common thing to do with times is to print out formatted dates. CakePHP
makes this a snap::

    $now = Time::parse('2014-10-31');

    // Prints a localized datetime stamp.
    echo $now;

    // outputs '4/20/14, 10:10 PM' for the en-US locale
    $now->i18nFormat();

    // Use the full date and time format
    $now->i18nFormat(\IntlDateFormatter::FULL);

    // Use full date but short time format
    $now->i18nFormat([\IntlDateFormatter::FULL, \IntlDateFormatter::Short]);

    // outputs '2014-04-20 22:10'
    $now->i18nFormat('YYYY-MM-dd HH:mm:ss');

.. php:method:: nice()

Print out a predefined 'nice' format::

    $now = Time::parse('2014-10-31');

    // Outputs 'Oct 31, 2014 12:32pm' in en-US
    echo $now->nice();

Formatting Relative Times
-------------------------

.. php:method:: timeAgoInWords(array $options = [])

Often it is useful to print times relative to the present::

    $now = new Time('Aug 22, 2011');
    echo $now->timeAgoInWords(
        ['format' => 'F jS, Y', 'end' => '+1 year']
    );
    // On Nov 10th, 2011 this would display: 2 months, 2 weeks, 6 days ago

The ``end`` option lets you define at which point after which relative times should be
formatted using the ``format`` option. The ``accuracy`` option lets control what
level of detail should be used for each interval range::

    // If $timestamp is 1 month, 1 week, 5 days and 6 hours ago
    echo $timestamp->timeAgoInWords([
        'accuracy' => ['month' => 'month'],
        'end' => '1 year'
    ]);
    // Outputs '1 month ago'

By setting ``accuracy`` to a string, you can specify what is the maximum level of detail you
want output::

    $time = new Time('+23 hours');
    // Outputs 'in about a day'
    $result = $time->timeAgoInWords(array(
        'accuracy' => 'day'
    ));

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

.. php:method:: isThisWeek()
.. php:method:: isThisMonth()
.. php:method:: isThisYear()

You can compare a ``Time`` instance with the present in a variety of ways::

    $time = new Time('2014-06-15');
    echo $time->isThisWeek();
    echo $time->isThisMonth();
    echo $time->isThisYear();

Each of the above methods will return true/false based on whether or not the
time instance matches the present.

Comparing With Intervals
========================

.. php:method:: isWithinNext($interval)

You can see if a ``Time`` instance falls within a given range using
``wasWithinLast()``, ``isWithinNext()``::

    $time = new Time('2014-06-15');

    // Within 2 days.
    echo $time->isWithinNext(2);

    // Within 2 next weeks.
    echo $time->isWithinNext('2 weeks');

.. php:method:: isWithinPast($interval)

You can also compare with periods in the past::

    // Within past 2 days.
    echo $time->isWithinPast(2);

    // Within past 2 weeks.
    echo $time->isWithinPast('2 weeks');

.. end-time

.. meta::
    :title lang=en: Time
    :description lang=en: Time class helps you format time and test time.
    :keywords lang=en: time,format time,timezone,unix epoch,time strings,time zone offset,utc,gmt
