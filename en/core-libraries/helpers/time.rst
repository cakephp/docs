TimeHelper
##########

.. php:class:: TimeHelper(View $view, array $settings = array())

The Time Helper does what it says on the tin: saves you time. It
allows for the quick processing of time related information. The
Time Helper has two main tasks that it can perform:

#. It can format time strings.
#. It can test time (but cannot bend time, sorry).

Using the Helper
================

A common use of the Time Helper is to offset the date and time to match a 
user's time zone. Lets use a forum as an example. Your forum has many users who 
may post messages at any time from any part of the world. An easy way to 
manage the time is to save all dates and times as GMT+0 or UTC. Uncomment the 
line ``date_default_timezone_set('UTC');`` in ``app/Config/core.php`` to ensure 
your application's time zone is set to GMT+0.

Next add a time zone field to your users table and make the necessary 
modifications to allow your users to set their time zone. Now that we know 
the time zone of the logged in user we can correct the date and time on our 
posts using the Time Helper::

    <?php
    echo $this->Time->format('F jS, Y h:i A', $post['Post']['created'], null, $user['User']['time_zone']);
    // Will display August 22nd, 2011 11:53 PM for a user in GMT+0
    // August 22nd, 2011 03:53 PM for a user in GMT-8
    // and August 23rd, 2011 09:53 AM GMT+10

Most of the Time Helper methods contain a $userOffset. The $userOffset parameter 
accepts a decimal number between -12 and 12.

Formatting
==========

.. php:method:: convert($serverTime, $userOffset = NULL)

    :rtype: integer

    Converts given time (in server's time zone) to user's local 
    time, given his/her offset from GMT.::

        <?php
        echo $this->Time->convert(time(), -8);
        // 1321038036

.. php:method:: convertSpecifiers($format, $time = NULL)

    :rtype: string

    Converts a string representing the format for the function 
    strftime and returns a windows safe and i18n aware format.

.. php:method:: dayAsSql($dateString, $field_name, $userOffset = NULL)

    :rtype: string

    Creates a string in the same format as daysAsSql but
    only needs a single date object::

        <?php
        echo $this->Time->dayAsSql('Aug 22, 2011', 'modified');
        // (modified >= '2011-08-22 00:00:00') AND (modified <= '2011-08-22 23:59:59')

.. php:method:: daysAsSql($begin, $end, $fieldName, $userOffset = NULL)

    :rtype: string

    Returns a string in the format "($field\_name >=
    '2008-01-21 00:00:00') AND ($field\_name <= '2008-01-25
    23:59:59')". This is handy if you need to search for records
    between two dates inclusively::

        <?php
        echo $this->Time->daysAsSql('Aug 22, 2011', 'Aug 25, 2011', 'created');
        // (created >= '2011-08-22 00:00:00') AND (created <= '2011-08-25 23:59:59')

.. php:method:: format($format, $dateString = NULL, $invalid = false, $userOffset = NULL)

    :rtype: string

    Will return a string formatted to the given format using the 
    `PHP date() formatting options <http://www.php.net/manual/en/function.date.php>`_::

        <?php
        echo $this->Time->format('Y-m-d H:i:s');
        // The Unix Epoch as 1970-01-01 00:00:00
        
        echo $this->Time->format('F jS, Y h:i A', '2011-08-22 11:53:00');
        // August 22nd, 2011 11:53 AM
        
        echo $this->Time->format('r', '+2 days', true);
        // 2 days from now formatted as Sun, 13 Nov 2011 03:36:10 +0800

.. php:method:: fromString($dateString, $userOffset = NULL)

    :rtype: string

    Takes a string and uses `strtotime <http://us.php.net/manual/en/function.date.php>`_ 
    to convert it into a date integer::

        <?php
        echo $this->Time->fromString('Aug 22, 2011');
        // 1313971200
        
        echo $this->Time->fromString('+1 days');
        // 1321074066 (+1 day from current date)

.. php:method:: gmt($dateString = NULL)

    :rtype: integer

    Will return the date as an integer set to Greenwich Mean Time (GMT).::

        <?php
        echo $this->Time->gmt('Aug 22, 2011');
        // 1313971200

.. php:method:: i18nFormat($date, $format = NULL, $invalid = false, $userOffset = NULL)

    :rtype: string

    Returns a formatted date string, given either a UNIX timestamp or a 
    valid strtotime() date string. It take in account the default date 
    format for the current language if a LC_TIME file is used.

.. php:method:: nice($dateString = NULL, $userOffset = NULL)

    :rtype: string

    Takes a date string and outputs it in the format "Tue, Jan
    1st 2008, 19:25"::

        <?php
        echo $this->Time->nice('2011-08-22 11:53:00');
        // Mon, Aug 22nd 2011, 11:53

.. php:method:: niceShort($dateString = NULL, $userOffset = NULL)

    :rtype: string

    Takes a date string and outputs it in the format "Jan
    1st 2008, 19:25". If the date object is today, the format will be
    "Today, 19:25". If the date object is yesterday, the format will be
    "Yesterday, 19:25"::

        <?php
        echo $this->Time->niceShort('2011-08-22 11:53:00');
        // Aug 22nd, 11:53

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
        echo $this->Time->timeAgoInWords('Aug 22, 2011');
        // on 22/8/11
        
        echo $this->Time->timeAgoInWords('Aug 22, 2011', array('format' => 'F jS, Y'));
        // on August 22nd, 2011

    Use the 'end' option to determine the cutoff point to no longer will use words; default '+1 month'::

        <?php
        echo $this->Time->timeAgoInWords('Aug 22, 2011', array('format' => 'F jS, Y', 'end' => '+1 year'));
        // On Nov 10th, 2011 it would display: 2 months, 2 weeks, 6 days ago

.. php:method:: toAtom($dateString, $userOffset = NULL)

    :rtype: string

    Will return a date string in the Atom format "2008-01-12T00:00:00Z"

.. php:method:: toQuarter($dateString, $range = false)

    :rtype: mixed

    Will return 1, 2, 3 or 4 depending on what quarter of
    the year the date falls in. If range is set to true, a two element
    array will be returned with start and end dates in the format
    "2008-03-31"::

        <?php
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

.. php:method:: toRSS($dateString, $userOffset = NULL)

    :rtype: string

    Will return a date string in the RSS format "Sat, 12 Jan 2008 
    00:00:00 -0500"

.. php:method:: toUnix($dateString, $userOffset = NULL)

    :rtype: integer

    A wrapper for fromString.

Testing Time
============

.. php:method:: isToday($dateString, $userOffset = NULL)
.. php:method:: isThisWeek($dateString, $userOffset = NULL)
.. php:method:: isThisMonth($dateString, $userOffset = NULL)
.. php:method:: isThisYear($dateString, $userOffset = NULL)
.. php:method:: wasYesterday($dateString, $userOffset = NULL)
.. php:method:: isTomorrow($dateString, $userOffset = NULL)
.. php:method:: wasWithinLast($timeInterval, $dateString, $userOffset = NULL)

    All of the above functions return true or false when passed a date
    string. ``wasWithinLast`` takes an additional ``$time_interval``
    option:

    ``$this->Time->wasWithinLast( $time_interval, $dateString )``

    ``wasWithinLast`` takes a time interval which is a string in the
    format "3 months" and accepts a time interval of seconds, minutes,
    hours, days, weeks, months and years (plural and not). If a time
    interval is not recognized (for example, if it is mistyped) then it
    will default to days.


.. meta::
    :title lang=en: TimeHelper
    :description lang=en: The Time Helper will help you format time and test time.
    :keywords lang=en: time helper,format time,timezone,unix epoch,time strings,time zone offset,utc,gmt