CakeTime
########

.. php:class:: CakeTime()

If you need :php:class:`TimeHelper` functionalities outside of a ``View``,
use the ``CakeTime`` class::

    <?php
    class UsersController extends AppController {

        public $components = array('Auth');

        public function afterLogin() {
            App::uses('CakeTime', 'Utility');
            if (CakeTime::isToday($this->Auth->user('date_of_birth']))) {
                // greet user with a happy birthday message
                $this->Session->setFlash(__('Happy birthday you...'));
            }
        }
    }

.. versionadded:: 2.1
   ``CakeTime`` has been factored out from :php:class:`TimeHelper`.

.. start-caketime

Formatting
==========

.. php:method:: convert($serverTime, $timezone = NULL)

    :rtype: integer

    Converts given time (in server's time zone) to user's local
    time, given his/her timezone.::

        <?php
        // called via TimeHelper
        echo $this->Time->convert(time(), 'Asia/Jakarta');
        // 1321038036

        // called as CakeTime
        App::uses('CakeTime', 'Utility');
        echo CakeTime::convert(time(), new DateTimeZone('Asia/Jakarta'));

    .. versionchanged:: 2.2
       ``$timezone`` parameter replaces ``$userOffset`` parameter used in 2.1 and below.

.. php:method:: convertSpecifiers($format, $time = NULL)

    :rtype: string

    Converts a string representing the format for the function
    strftime and returns a windows safe and i18n aware format.

.. php:method:: dayAsSql($dateString, $field_name, $timezone = NULL)

    :rtype: string

    Creates a string in the same format as daysAsSql but
    only needs a single date object::

        <?php
        // called via TimeHelper
        echo $this->Time->dayAsSql('Aug 22, 2011', 'modified');
        // (modified >= '2011-08-22 00:00:00') AND (modified <= '2011-08-22 23:59:59')

        // called as CakeTime
        App::uses('CakeTime', 'Utility');
        echo CakeTime::dayAsSql('Aug 22, 2011', 'modified');

    .. versionchanged:: 2.2
       ``$timezone`` parameter replaces ``$userOffset`` parameter used in 2.1 and below.

    .. versionadded:: 2.2
       ``$dateString`` parameter now also accepts a DateTime object.

.. php:method:: daysAsSql($begin, $end, $fieldName, $timezone = NULL)

    :rtype: string

    Returns a string in the format "($field\_name >=
    '2008-01-21 00:00:00') AND ($field\_name <= '2008-01-25
    23:59:59')". This is handy if you need to search for records
    between two dates inclusively::

        <?php
        // called via TimeHelper
        echo $this->Time->daysAsSql('Aug 22, 2011', 'Aug 25, 2011', 'created');
        // (created >= '2011-08-22 00:00:00') AND (created <= '2011-08-25 23:59:59')

        // called as CakeTime
        App::uses('CakeTime', 'Utility');
        echo CakeTime::daysAsSql('Aug 22, 2011', 'Aug 25, 2011', 'created');

    .. versionchanged:: 2.2
       ``$timezone`` parameter replaces ``$userOffset`` parameter used in 2.1 and below.

    .. versionadded:: 2.2
       ``$dateString`` parameter now also accepts a DateTime object.

.. php:method:: format($format, $dateString = NULL, $invalid = false, $timezone = NULL)

    :rtype: string

    Will return a string formatted to the given format using the
    `PHP date() formatting options <http://www.php.net/manual/en/function.date.php>`_::

        <?php
        // called via TimeHelper
        echo $this->Time->format('Y-m-d H:i:s');
        // The Unix Epoch as 1970-01-01 00:00:00

        echo $this->Time->format('F jS, Y h:i A', '2011-08-22 11:53:00');
        // August 22nd, 2011 11:53 AM

        echo $this->Time->format('r', '+2 days', true);
        // 2 days from now formatted as Sun, 13 Nov 2011 03:36:10 +0800

        // called as CakeTime
        App::uses('CakeTime', 'Utility');
        echo CakeTime::format('Y-m-d H:i:s');
        echo CakeTime::format('F jS, Y h:i A', '2011-08-22 11:53:00');
        echo CakeTime::format('r', '+2 days', true);

    .. versionchanged:: 2.2
       ``$timezone`` parameter replaces ``$userOffset`` parameter used in 2.1 and below.

    .. versionadded:: 2.2
       ``$dateString`` parameter now also accepts a DateTime object.

.. php:method:: fromString($dateString, $timezone = NULL)

    :rtype: string

    Takes a string and uses `strtotime <http://us.php.net/manual/en/function.date.php>`_
    to convert it into a date integer::

        <?php
        // called via TimeHelper
        echo $this->Time->fromString('Aug 22, 2011');
        // 1313971200

        echo $this->Time->fromString('+1 days');
        // 1321074066 (+1 day from current date)

        // called as CakeTime
        App::uses('CakeTime', 'Utility');
        echo CakeTime::fromString('Aug 22, 2011');
        echo CakeTime::fromString('+1 days');

    .. versionchanged:: 2.2
       ``$timezone`` parameter replaces ``$userOffset`` parameter used in 2.1 and below.

    .. versionadded:: 2.2
       ``$dateString`` parameter now also accepts a DateTime object.

.. php:method:: gmt($dateString = NULL)

    :rtype: integer

    Will return the date as an integer set to Greenwich Mean Time (GMT).::

        <?php
        // called via TimeHelper
        echo $this->Time->gmt('Aug 22, 2011');
        // 1313971200

        // called as CakeTime
        App::uses('CakeTime', 'Utility');
        echo CakeTime::gmt('Aug 22, 2011');

.. php:method:: i18nFormat($date, $format = NULL, $invalid = false, $timezone = NULL)

    :rtype: string

    Returns a formatted date string, given either a UNIX timestamp or a
    valid strtotime() date string. It take in account the default date
    format for the current language if a LC_TIME file is used.

    .. versionchanged:: 2.2
       ``$timezone`` parameter replaces ``$userOffset`` parameter used in 2.1 and below.

.. php:method:: nice($dateString = NULL, $timezone = NULL)

    :rtype: string

    Takes a date string and outputs it in the format "Tue, Jan
    1st 2008, 19:25"::

        <?php
        // called via TimeHelper
        echo $this->Time->nice('2011-08-22 11:53:00');
        // Mon, Aug 22nd 2011, 11:53

        // called as CakeTime
        App::uses('CakeTime', 'Utility');
        echo CakeTime::nice('2011-08-22 11:53:00');

.. php:method:: niceShort($dateString = NULL, $timezone = NULL)

    :rtype: string

    Takes a date string and outputs it in the format "Jan
    1st 2008, 19:25". If the date object is today, the format will be
    "Today, 19:25". If the date object is yesterday, the format will be
    "Yesterday, 19:25"::

        <?php
        // called via TimeHelper
        echo $this->Time->niceShort('2011-08-22 11:53:00');
        // Aug 22nd, 11:53

        // called as CakeTime
        App::uses('CakeTime', 'Utility');
        echo CakeTime::niceShort('2011-08-22 11:53:00');

    .. versionchanged:: 2.2
       ``$timezone`` parameter replaces ``$userOffset`` parameter used in 2.1 and below.

    .. versionadded:: 2.2
       ``$dateString`` parameter now also accepts a DateTime object.

.. php:method:: serverOffset()

    :rtype: integer

    Returns server's offset from GMT in seconds.

.. php:method:: timeAgoInWords($dateString, $options = array())

    :rtype: string

    Will take a datetime string (anything that is
    parsable by PHP's strtotime() function or MySQL's datetime format)
    and convert it into a friendly word format like, "3 weeks, 3 days
    ago"::

        <?php
        // called via TimeHelper
        echo $this->Time->timeAgoInWords('Aug 22, 2011');
        // on 22/8/11

        echo $this->Time->timeAgoInWords('Aug 22, 2011', array('format' => 'F jS, Y'));
        // on August 22nd, 2011

        // called as CakeTime
        App::uses('CakeTime', 'Utility');
        echo CakeTime::timeAgoInWords('Aug 22, 2011');
        echo CakeTime::timeAgoInWords('Aug 22, 2011', array('format' => 'F jS, Y'));

    Use the 'end' option to determine the cutoff point to no longer will use words; default '+1 month'::

        <?php
        // called via TimeHelper
        echo $this->Time->timeAgoInWords('Aug 22, 2011', array('format' => 'F jS, Y', 'end' => '+1 year'));
        // On Nov 10th, 2011 it would display: 2 months, 2 weeks, 6 days ago

        // called as CakeTime
        App::uses('CakeTime', 'Utility');
        echo CakeTime::timeAgoInWords('Aug 22, 2011', array('format' => 'F jS, Y', 'end' => '+1 year'));

    Use the 'accuracy' option to determine how precise the output should be.
    You can use this to limit the output::

        <?php
        // If $timestamp is 1 month, 1 week, 5 days and 6 hours ago
        echo CakeTime::timeAgoInWords($timestamp, array(
            'accuracy' => array('month' => 'month'),
            'end' => '1 year'
        ));
        // Outputs '1 month ago'

    .. versionchanged:: 2.2
        The ``accuracy`` option was added.

    .. versionadded:: 2.2
       ``$dateString`` parameter now also accepts a DateTime object.

.. php:method:: toAtom($dateString, $timezone = NULL)

    :rtype: string

    Will return a date string in the Atom format "2008-01-12T00:00:00Z"

    .. versionchanged:: 2.2
       ``$timezone`` parameter replaces ``$userOffset`` parameter used in 2.1 and below.

    .. versionadded:: 2.2
       ``$dateString`` parameter now also accepts a DateTime object.

.. php:method:: toQuarter($dateString, $range = false)

    :rtype: mixed

    Will return 1, 2, 3 or 4 depending on what quarter of
    the year the date falls in. If range is set to true, a two element
    array will be returned with start and end dates in the format
    "2008-03-31"::

        <?php
        // called via TimeHelper
        echo $this->Time->toQuarter('Aug 22, 2011');
        // Would print 3

        $arr = $this->Time->toQuarter('Aug 22, 2011', true);
        /*
        Array
        (
            [0] => 2011-07-01
            [1] => 2011-09-30
        )
        */

        // called as CakeTime
        App::uses('CakeTime', 'Utility');
        echo CakeTime::toQuarter('Aug 22, 2011');
        $arr = CakeTime::toQuarter('Aug 22, 2011', true);

    .. versionadded:: 2.2
       ``$dateString`` parameter now also accepts a DateTime object.

.. php:method:: toRSS($dateString, $timezone = NULL)

    :rtype: string

    Will return a date string in the RSS format "Sat, 12 Jan 2008
    00:00:00 -0500"

    .. versionchanged:: 2.2
       ``$timezone`` parameter replaces ``$userOffset`` parameter used in 2.1 and below.

    .. versionadded:: 2.2
       ``$dateString`` parameter now also accepts a DateTime object.

.. php:method:: toUnix($dateString, $timezone = NULL)

    :rtype: integer

    A wrapper for fromString.

    .. versionchanged:: 2.2
       ``$timezone`` parameter replaces ``$userOffset`` parameter used in 2.1 and below.

    .. versionadded:: 2.2
       ``$dateString`` parameter now also accepts a DateTime object.

.. php:method:: toServer($dateString, $timezone = NULL, $format = 'Y-m-d H:i:s')

    :rtype: mixed

    .. versionadded:: 2.2
       Returns a formatted date in server's timezone.

.. php:method:: timezone($timezone = NULL)

    :rtype: DateTimeZone

    .. versionadded:: 2.2
       Returns a timezone object from a string or the user's timezone object. If the function is called
       without a parameter it tries to get timezone from 'Config.timezone' configuration variable.

.. php:method:: listTimezones($filter = null, $country = null, $group = true)

    :rtype: array

    .. versionadded:: 2.2
       Returns a list of timezone identifiers.

Testing Time
============

.. php:method:: isToday($dateString, $timezone = NULL)
.. php:method:: isThisWeek($dateString, $timezone = NULL)
.. php:method:: isThisMonth($dateString, $timezone = NULL)
.. php:method:: isThisYear($dateString, $timezone = NULL)
.. php:method:: wasYesterday($dateString, $timezone = NULL)
.. php:method:: isTomorrow($dateString, $timezone = NULL)
.. php:method:: wasWithinLast($timeInterval, $dateString, $timezone = NULL)

    .. versionchanged:: 2.2
       ``$timezone`` parameter replaces ``$userOffset`` parameter used in 2.1 and below.

    .. versionadded:: 2.2
       ``$dateString`` parameter now also accepts a DateTime object.

    All of the above functions return true or false when passed a date
    string. ``wasWithinLast`` takes an additional ``$timeInterval``
    option::

        <?php
        // called via TimeHelper
        $this->Time->wasWithinLast($timeInterval, $dateString);

        // called as CakeTime
        App::uses('CakeTime', 'Utility');
        CakeTime::wasWithinLast($timeInterval, $dateString);

    ``wasWithinLast`` takes a time interval which is a string in the
    format "3 months" and accepts a time interval of seconds, minutes,
    hours, days, weeks, months and years (plural and not). If a time
    interval is not recognized (for example, if it is mistyped) then it
    will default to days.

.. end-caketime

.. meta::
    :title lang=en: CakeTime
    :description lang=en: CakeTime class helps you format time and test time.
    :keywords lang=en: time,format time,timezone,unix epoch,time strings,time zone offset,utc,gmt
