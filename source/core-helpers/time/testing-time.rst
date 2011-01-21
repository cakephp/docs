7.12.2 Testing Time
-------------------


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

7.12.2 Testing Time
-------------------


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
