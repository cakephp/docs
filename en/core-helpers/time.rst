TimeHelper
##########

The Time Helper does what it says on the tin: saves you time. It
allows for the quick processing of time related information. The
Time Helper has two main tasks that it can perform:


#. It can format time strings.
#. It can test time (but cannot bend time, sorry).

Formatting
==========

``fromString( $date_string )``

**fromString** takes a string and uses strtotime to convert it into
a date object. If the string passed in is a number then it'll
convert it into an integer, being the number of seconds since the
Unix Epoch (January 1 1970 00:00:00 GMT). Passing in a string of
"20081231" will create undesired results as it will covert it to
the number of seconds from the Epoch, in this case "Fri, Aug 21st
1970, 06:07"

``toQuarter( $date_string, $range = false )``

**toQuarter** will return 1, 2, 3 or 4 depending on what quarter of
the year the date falls in. If range is set to true, a two element
array will be returned with start and end dates in the format
"2008-03-31".

``toUnix( $date_string )``

**toUnix** is a wrapper for fromString.

``toAtom( $date_string )``

**toAtom** return a date string in the Atom format
"2008-01-12T00:00:00Z"

``toRSS( $date_string )``

**toRSS** returns a date string in the RSS format "Sat, 12 Jan 2008
00:00:00 -0500"

``nice( $date_string = null )``

**nice** takes a date string and outputs it in the format "Tue, Jan
1st 2008, 19:25".

``niceShort( $date_string = null )``

**niceShort** takes a date string and outputs it in the format "Jan
1st 2008, 19:25". If the date object is today, the format will be
"Today, 19:25". If the date object is yesterday, the format will be
"Yesterday, 19:25".

``daysAsSql( $begin, $end, $fieldName, $userOffset = NULL )``

**daysAsSql** returns a string in the format "($field\_name >=
'2008-01-21 00:00:00') AND ($field\_name <= '2008-01-25
23:59:59')". This is handy if you need to search for records
between two dates inclusively.

``dayAsSql( $date_string,  $field_name )``

**dayAsSql** creates a string in the same format as daysAsSql but
only needs a single date object.

``timeAgoInWords( $datetime_string, $options = array(), $backwards = null )``

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
``relativeTime( $date_string, $format = 'j/n/y' )``

**relativeTime** is essentially an alias for timeAgoInWords.

``gmt( $date_string = null )``

**gmt** will return the date as an integer set to Greenwich Mean
Time (GMT).

``format( $format = 'd-m-Y', $date_string)``

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
relativeTime
on 21/01/08
3 months, 3 weeks, 2 days ago
7 minutes ago
2 seconds ago
gmt
1200787200


Testing Time
============


-  ``isToday``
-  ``isThisWeek``
-  ``isThisMonth``
-  ``isThisYear``
-  ``wasYesterday``
-  ``isTomorrow``
-  ``wasWithinLast``

All of the above functions return true or false when passed a date
string. ``wasWithinLast`` takes an additional ``$time_interval``
option:

``$this->Time->wasWithinLast( $time_interval, $date_string )``

``wasWithinLast`` takes a time interval which is a string in the
format "3 months" and accepts a time interval of seconds, minutes,
hours, days, weeks, months and years (plural and not). If a time
interval is not recognized (for example, if it is mistyped) then it
will default to days.

