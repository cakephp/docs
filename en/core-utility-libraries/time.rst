Time
########

.. php:class:: Time()

If you need :php:class:`TimeHelper` functionalities outside of a ``View``,
use the ``Time`` class::

    class UsersController extends AppController {

        public $components = array('Auth');

        public function afterLogin() {
            use Cake\Utility\Time;
            if (Time::isToday($this->Auth->user('date_of_birth']))) {
                // greet user with a happy birthday message
                $this->Session->setFlash(__('Happy birthday to you...'));
            }
        }
    }

.. start-time

Formatting
==========

.. php:method:: convert($serverTime, $timezone = NULL)

    :rtype: integer

    Converts given time (in server's time zone) to user's local
    time, given his/her timezone.::

        // called via TimeHelper
        echo $this->Time->convert(time(), 'Asia/Jakarta');
        // 1321038036

        // called as Time
        use Cake\Utility\Time;
        echo Time::convert(time(), new DateTimeZone('Asia/Jakarta'));

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

        // called as Time
        use Cake\Utility\Time;
        echo Time::dayAsSql('Aug 22, 2011', 'modified');.

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

        // called as Time
        use Cake\Utility\Time;
        echo Time::daysAsSql('Aug 22, 2011', 'Aug 25, 2011', 'created');

.. php:method:: format($date, $format = NULL, $default = false, $timezone = NULL)

    :rtype: string

    Will return a string formatted to the given format using the
    `PHP strftime() formatting options <http://www.php.net/manual/en/function.strftime.php>`_::

        // called via TimeHelper
        echo $this->Time->format('2011-08-22 11:53:00', '%B %e, %Y %H:%M %p');
        // August 22, 2011 11:53 AM

        echo $this->Time->format('+2 days', '%c');
        // 2 days from now formatted as Sun, 13 Nov 2011 03:36:10 AM EET

        // called as Time
        use Cake\Utility\Time;
        echo Time::format('2011-08-22 11:53:00', '%F %jS, %Y %h:%i %A');
        echo Time::format('+2 days', '%r');

    You can also provide the date/time as the first argument. When doing this
    you should use ``strftime`` compatible formatting. This call signature
    allows you to leverage locale aware date formatting which is not possible
    using ``date()`` compatible formatting::

        // called via TimeHelper
        echo $this->Time->format('2012-01-13', '%d-%m-%Y', 'invalid');

        // called as Time
        use Cake\Utility\Time;
        echo Time::format('2011-08-22', '%d-%m-%Y');

.. php:method:: fromString($dateString, $timezone = NULL)

    :rtype: string

    Takes a string and uses `strtotime <http://us.php.net/manual/en/function.date.php>`_
    to convert it into a date integer::

        // called via TimeHelper
        echo $this->Time->fromString('Aug 22, 2011');
        // 1313971200

        echo $this->Time->fromString('+1 days');
        // 1321074066 (+1 day from current date)

        // called as Time
        use Cake\Utility\Time;
        echo Time::fromString('Aug 22, 2011');
        echo Time::fromString('+1 days');

.. php:method:: gmt($dateString = NULL)

    :rtype: integer

    Will return the date as an integer set to Greenwich Mean Time (GMT).::

        // called via TimeHelper
        echo $this->Time->gmt('Aug 22, 2011');
        // 1313971200

        // called as Time
        use Cake\Utility\Time;
        echo Time::gmt('Aug 22, 2011');

.. php:method:: i18nFormat($date, $format = NULL, $invalid = false, $timezone = NULL)

    :rtype: string

    Returns a formatted date string, given either a UNIX timestamp or a
    valid strtotime() date string. It take in account the default date
    format for the current language if a LC_TIME file is used. For more info
    about LC_TIME file check :ref:`here <lc-time>`.

.. php:method:: nice($dateString = NULL, $timezone = NULL, $format = null)

    :rtype: string

    Takes a date string and outputs it in the format "Tue, Jan
    1st 2008, 19:25" or as per optional ``$format`` param passed::

        // called via TimeHelper
        echo $this->Time->nice('2011-08-22 11:53:00');
        // Mon, Aug 22nd 2011, 11:53

        // called as Time
        use Cake\Utility\Time;
        echo Time::nice('2011-08-22 11:53:00');

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

        // called as Time
        use Cake\Utility\Time;
        echo Time::timeAgoInWords('Aug 22, 2011');
        echo Time::timeAgoInWords('Aug 22, 2011', array('format' => 'F jS, Y'));

    Use the 'end' option to determine the cutoff point to no longer will use words; default '+1 month'::

        // called via TimeHelper
        echo $this->Time->timeAgoInWords(
            'Aug 22, 2011',
            array('format' => 'F jS, Y', 'end' => '+1 year')
        );
        // On Nov 10th, 2011 it would display: 2 months, 2 weeks, 6 days ago

        // called as Time
        use Cake\Utility\Time;
        echo Time::timeAgoInWords('Aug 22, 2011', array('format' => 'F jS, Y', 'end' => '+1 year'));

    Use the 'accuracy' option to determine how precise the output should be.
    You can use this to limit the output::

        // If $timestamp is 1 month, 1 week, 5 days and 6 hours ago
        echo Time::timeAgoInWords($timestamp, array(
            'accuracy' => array('month' => 'month'),
            'end' => '1 year'
        ));
        // Outputs '1 month ago'

.. php:method:: toAtom($dateString, $timezone = NULL)

    :rtype: string

    Will return a date string in the Atom format "2008-01-12T00:00:00Z"

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

        // called as Time
        use Cake\Utility\Time;
        echo Time::toQuarter('Aug 22, 2011');
        $arr = Time::toQuarter('Aug 22, 2011', true);

.. php:method:: toRSS($dateString, $timezone = NULL)

    :rtype: string

    Will return a date string in the RSS format "Sat, 12 Jan 2008
    00:00:00 -0500"

.. php:method:: toUnix($dateString, $timezone = NULL)

    :rtype: integer

    A wrapper for fromString.

.. php:method:: toServer($dateString, $timezone = NULL, $format = 'Y-m-d H:i:s')

    :rtype: mixed

.. php:method:: timezone($timezone = NULL)

    :rtype: DateTimeZone

.. php:method:: listTimezones($filter = null, $country = null, $group = true)

    :rtype: array

Testing Time
============

.. php:method:: isToday($dateString, $timezone = NULL)
.. php:method:: isThisWeek($dateString, $timezone = NULL)
.. php:method:: isThisMonth($dateString, $timezone = NULL)
.. php:method:: isThisYear($dateString, $timezone = NULL)
.. php:method:: wasYesterday($dateString, $timezone = NULL)
.. php:method:: isTomorrow($dateString, $timezone = NULL)
.. php:method:: isFuture($dateString, $timezone = NULL)
.. php:method:: isPast($dateString, $timezone = NULL)
.. php:method:: wasWithinLast($timeInterval, $dateString, $timezone = NULL)

.. end-time

.. meta::
    :title lang=en: Time
    :description lang=en: Time class helps you format time and test time.
    :keywords lang=en: time,format time,timezone,unix epoch,time strings,time zone offset,utc,gmt
