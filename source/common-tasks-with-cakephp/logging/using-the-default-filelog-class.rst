4.6.2 Using the default FileLog class
-------------------------------------

While CakeLog can be configured to write to a number of user
configured logging adapters, it also comes with a default logging
configuration. This configuration is identical to how CakeLog
behaved in CakePHP 1.2. The default logging configuration will be
used any time there are *no other* logging adapters configured.
Once a logging adapter has been configured you will need to also
configure FileLog if you want file logging to continue.

As its name implies FileLog writes log messages to files. The type
of log message being written determines the name of the file the
message is stored in. If a type is not supplied, LOG\_ERROR is used
which writes to the error log. The default log location is
``app/tmp/logs/$type.log``
::

    //Executing this inside a CakePHP class:
     $this->log("Something didn't work!");
     
    //Results in this being appended to app/tmp/logs/error.log
    2007-11-02 10:22:02 Error: Something didn't work!


#. ``//Executing this inside a CakePHP class:``
#. ``$this->log("Something didn't work!");``
#. ````
#. ``//Results in this being appended to app/tmp/logs/error.log``
#. ``2007-11-02 10:22:02 Error: Something didnt work!``

You can specify a custom log names, using the second parameter. The
default built-in FileLog class will treat this log name as the file
you wish to write logs to.

::

    //called statically
    CakeLog::write('activity', 'A special message for activity logging');
     
    //Results in this being appended to app/tmp/logs/activity.log (rather than error.log)
    2007-11-02 10:22:02 Activity: A special message for activity logging


#. ``//called statically``
#. ``CakeLog::write('activity', 'A special message for activity logging');``
#. ````
#. ``//Results in this being appended to app/tmp/logs/activity.log (rather than error.log)``
#. ``2007-11-02 10:22:02 Activity: A special message for activity logging``

The configured directory must be writable by the web server user in
order for logging to work correctly.

You can configure additional/alternate FileLog locations using
``CakeLog::config()``. FileLog accepts a ``path`` which allows for
custom paths to be used.

::

    CakeLog::config('custom_path', array(
        'engine' => 'FileLog',
        'path' => '/path/to/custom/place/'
    ));


#. ``CakeLog::config('custom_path', array(``
#. ``'engine' => 'FileLog',``
#. ``'path' => '/path/to/custom/place/'``
#. ``));``

4.6.2 Using the default FileLog class
-------------------------------------

While CakeLog can be configured to write to a number of user
configured logging adapters, it also comes with a default logging
configuration. This configuration is identical to how CakeLog
behaved in CakePHP 1.2. The default logging configuration will be
used any time there are *no other* logging adapters configured.
Once a logging adapter has been configured you will need to also
configure FileLog if you want file logging to continue.

As its name implies FileLog writes log messages to files. The type
of log message being written determines the name of the file the
message is stored in. If a type is not supplied, LOG\_ERROR is used
which writes to the error log. The default log location is
``app/tmp/logs/$type.log``
::

    //Executing this inside a CakePHP class:
     $this->log("Something didn't work!");
     
    //Results in this being appended to app/tmp/logs/error.log
    2007-11-02 10:22:02 Error: Something didn't work!


#. ``//Executing this inside a CakePHP class:``
#. ``$this->log("Something didn't work!");``
#. ````
#. ``//Results in this being appended to app/tmp/logs/error.log``
#. ``2007-11-02 10:22:02 Error: Something didnt work!``

You can specify a custom log names, using the second parameter. The
default built-in FileLog class will treat this log name as the file
you wish to write logs to.

::

    //called statically
    CakeLog::write('activity', 'A special message for activity logging');
     
    //Results in this being appended to app/tmp/logs/activity.log (rather than error.log)
    2007-11-02 10:22:02 Activity: A special message for activity logging


#. ``//called statically``
#. ``CakeLog::write('activity', 'A special message for activity logging');``
#. ````
#. ``//Results in this being appended to app/tmp/logs/activity.log (rather than error.log)``
#. ``2007-11-02 10:22:02 Activity: A special message for activity logging``

The configured directory must be writable by the web server user in
order for logging to work correctly.

You can configure additional/alternate FileLog locations using
``CakeLog::config()``. FileLog accepts a ``path`` which allows for
custom paths to be used.

::

    CakeLog::config('custom_path', array(
        'engine' => 'FileLog',
        'path' => '/path/to/custom/place/'
    ));


#. ``CakeLog::config('custom_path', array(``
#. ``'engine' => 'FileLog',``
#. ``'path' => '/path/to/custom/place/'``
#. ``));``
