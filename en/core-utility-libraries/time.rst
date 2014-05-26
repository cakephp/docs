CakeTime
########

.. php:class:: CakeTime()

If you need :php:class:`TimeHelper` functionalities outside of a ``View``,
use the ``CakeTime`` class::

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

        // called via TimeHelper
        echo $this->Time->dayAsSql('Aug 22, 2011', 'modified');
        // (modified >= '2011-08-22 00:00:00') AND
        // (modified <= '2011-08-22 23:59:59')

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

        // called via TimeHelper
        echo $this->Time->daysAsSql('Aug 22, 2011', 'Aug 25, 2011', 'created');
        // (created >= '2011-08-22 00:00:00') AND
        // (created <= '2011-08-25 23:59:59')

        // called as CakeTime
        App::uses('CakeTime', 'Utility');
        echo CakeTime::daysAsSql('Aug 22, 2011', 'Aug 25, 2011', 'created');

    .. versionchanged:: 2.2
       ``$timezone`` parameter replaces ``$userOffset`` parameter used in 2.1 and below.

    .. versionadded:: 2.2
       ``$dateString`` parameter now also accepts a DateTime object.

.. php:method:: format($date, $format = NULL, $default = false, $timezone = NULL)

    :rtype: string

    Will return a string formatted to the given format using the
    `PHP strftime() formatting options <http://www.php.net/manual/en/function.strftime.php>`_::

        // called via TimeHelper
        echo $this->Time->format('2011-08-22 11:53:00', '%B %e, %Y %H:%M %p');
        // August 22, 2011 11:53 AM

        echo $this->Time->format('+2 days', '%c');
        // 2 days from now formatted as Sun, 13 Nov 2011 03:36:10 AM EET

        // called as CakeTime
        App::uses('CakeTime', 'Utility');
        echo CakeTime::format('2011-08-22 11:53:00', '%B %e, %Y %H:%M %p');
        echo CakeTime::format('+2 days', '%c');

    You can also provide the date/time as the first argument. When doing this
    you should use ``strftime`` compatible formatting. This call signature
    allows you to leverage locale aware date formatting which is not possible
    using ``date()`` compatible formatting::

        // called via TimeHelper
        echo $this->Time->format('2012-01-13', '%d-%m-%Y', 'invalid');

        // called as CakeTime
        App::uses('CakeTime', 'Utility');
        echo CakeTime::format('2011-08-22', '%d-%m-%Y');

    .. versionchanged:: 2.2
       ``$format`` and ``$date`` parameters are in opposite order as used in 2.1 and below.
       ``$timezone`` parameter replaces ``$userOffset`` parameter used in 2.1 and below.
       ``$default`` parameter replaces ``$invalid`` parameter used in 2.1 and below.

    .. versionadded:: 2.2
       ``$date`` parameter now also accepts a DateTime object.

.. php:method:: fromString($dateString, $timezone = NULL)

    :rtype: string

    Takes a string and uses `strtotime <http://us.php.net/manual/en/function.date.php>`_
    to convert it into a date integer::

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
    format for the current language if a LC_TIME file is used. For more info
    about LC_TIME file check :ref:`here <lc-time>`.

    .. versionchanged:: 2.2
       ``$timezone`` parameter replaces ``$userOffset`` parameter used in 2.1 and below.

.. php:method:: nice($dateString = NULL, $timezone = NULL, $format = null)

    :rtype: string

    Takes a date string and outputs it in the format "Tue, Jan
    1st 2008, 19:25" or as per optional ``$format`` param passed::

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

        // called via TimeHelper
        echo $this->Time->timeAgoInWords('Aug 22, 2011');
        // on 22/8/11

        // on August 22nd, 2011
        echo $this->Time->timeAgoInWords(
            'Aug 22, 2011',
            array('format' => 'F jS, Y')
        );

        // called as CakeTime
        App::uses('CakeTime', 'Utility');
        echo CakeTime::timeAgoInWords('Aug 22, 2011');
        echo CakeTime::timeAgoInWords(
            'Aug 22, 2011',
            array('format' => 'F jS, Y')
        );

    Use the 'end' option to determine the cutoff point to no longer will use words; default '+1 month'::

        // called via TimeHelper
        echo $this->Time->timeAgoInWords(
            'Aug 22, 2011',
            array('format' => 'F jS, Y', 'end' => '+1 year')
        );
        // On Nov 10th, 2011 it would display: 2 months, 2 weeks, 6 days ago

        // called as CakeTime
        App::uses('CakeTime', 'Utility');
        echo CakeTime::timeAgoInWords(
            'Aug 22, 2011',
            array('format' => 'F jS, Y', 'end' => '+1 year')
        );

    Use the 'accuracy' option to determine how precise the output should be.
    You can use this to limit the output::

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

    .. versionadded:: 2.4
       The new option parameters ``relativeString`` (defaults to ``%s ago``) and
			 ``absoluteString`` (defaults to ``on %s``) to allow customization of the resulting
       output string are now available.

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
.. php:method:: isFuture($dateString, $timezone = NULL)

    .. versionadded:: 2.4

.. php:method:: isPast($dateString, $timezone = NULL)

    .. versionadded:: 2.4

.. php:method:: wasWithinLast($timeInterval, $dateString, $timezone = NULL)

    .. versionchanged:: 2.2
       ``$timezone`` parameter replaces ``$userOffset`` parameter used in 2.1 and below.

    .. versionadded:: 2.2
       ``$dateString`` parameter now also accepts a DateTime object.

    All of the above functions return true or false when passed a date
    string. ``wasWithinLast`` takes an additional ``$timeInterval``
    option::

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
