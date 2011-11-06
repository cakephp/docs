TimeHelper
##########

.. php:class:: TimeHelper

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

Formatting
==========

.. php:method:: fromString($dateString, $userOffset = NULL)

    **fromString** takes a string and uses strtotime to convert it into
    a date object. If the string passed in is a number then it'll
    convert it into an integer, being the number of seconds since the
    Unix Epoch (January 1 1970 00:00:00 GMT). Passing in a string of
    "20081231" will create undesired results as it will covert it to
    the number of seconds from the Epoch, in this case "Fri, Aug 21st
    1970, 06:07"

.. php:method:: toQuarter($dateString, $range = false)

    **toQuarter** will return 1, 2, 3 or 4 depending on what quarter of
    the year the date falls in. If range is set to true, a two element
    array will be returned with start and end dates in the format
    "2008-03-31".

.. php:method:: toUnix($dateString, $userOffset = NULL)

    **toUnix** is a wrapper for fromString.

.. php:method:: toAtom($dateString, $userOffset = NULL)

    **toAtom** return a date string in the Atom format
    "2008-01-12T00:00:00Z"

.. php:method:: toRSS($dateString, $userOffset = NULL)

    **toRSS** returns a date string in the RSS format "Sat, 12 Jan 2008
    00:00:00 -0500"

.. php:method:: nice($dateString = NULL, $userOffset = NULL)

    **nice** takes a date string and outputs it in the format "Tue, Jan
    1st 2008, 19:25".

.. php:method:: niceShort($dateString = NULL, $userOffset = NULL)

    **niceShort** takes a date string and outputs it in the format "Jan
    1st 2008, 19:25". If the date object is today, the format will be
    "Today, 19:25". If the date object is yesterday, the format will be
    "Yesterday, 19:25".

.. php:method:: daysAsSql($begin, $end, $fieldName, $userOffset = NULL)

    **daysAsSql** returns a string in the format "($field\_name >=
    '2008-01-21 00:00:00') AND ($field\_name <= '2008-01-25
    23:59:59')". This is handy if you need to search for records
    between two dates inclusively.

.. php:method:: dayAsSql($dateString, $field_name, $userOffset = NULL)

    **dayAsSql** creates a string in the same format as daysAsSql but
    only needs a single date object.

.. php:method:: timeAgoInWords($dateString, $options = array())

    **timeAgoInWords** will take a datetime string (anything that is
    parsable by PHP's strtotime() function or MySQL's datetime format)
    and convert it into a friendly word format like, "3 weeks, 3 days
    ago". Passing in true for $backwards will specifically declare the
    time is set in the future, which uses the format "on 31/12/08".

    Option
        Description
    format
        a date format; default "on 31/12/08"
    end
        determines the cutoff point in which it no longer uses words and
        uses the date format instead; default "+1 month"
        ``relativeTime( $dateString, $format = 'j/n/y' )``

.. php:method:: relativeTime() 
    
    is essentially an alias for timeAgoInWords.

.. php:method:: gmt($dateString = NULL)

    **gmt** will return the date as an integer set to Greenwich Mean
    Time (GMT).

.. php:method:: format($format, $dateString = NULL, $invalid = false, $userOffset = NULL)

    **format** is a wrapper for the PHP date function.

Format
    Sample Output
nice
    Tue, Jan 1st 2008, 19:25
niceShort
    Jan 1st 2008, 19:25
    Today, 19:25
    Yesterday, 19:25
daysAsSql
    ($field\_name >= '2008-01-21 00:00:00') AND ($field\_name <=
    '2008-01-25 23:59:59')
dayAsSql
    ($field\_name >= '2008-01-21 00:00:00') AND ($field\_name <=
    '2008-01-21 23:59:59')
timeAgoInWords
    on 21/01/08
    3 months, 3 weeks, 2 days ago
    7 minutes ago
    2 seconds ago
gmt
    1200787200


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

.. todo::

    TimeHelper docs are very short on content.  Could do with some fleshing out.
