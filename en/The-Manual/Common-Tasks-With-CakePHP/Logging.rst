Logging
#######

While CakePHP core Configure Class settings can really help you see
what's happening under the hood, there are certain times that you'll
need to log data to the disk in order to find out what's going on. In a
world that is becoming more dependent on technologies like SOAP and
AJAX, debugging can be rather difficult.

Logging can also be a way to find out what's been going on in your
application over time. What search terms are being used? What sorts of
errors are my users being shown? How often is a particular query being
executed?

Logging data in CakePHP is easy - the log() function is a part of the
Object class, which is the common ancestor for almost all CakePHP
classes. If the context is a CakePHP class (Model, Controller,
Component... almost anything), you can log your data. You can also use
CakeLog::write() directly.

Writing to logs
===============

Writing to the log files can be done in 2 different ways. The first is
to use the static ``CakeLog::write()`` method.

::

    CakeLog::write('debug', 'Something did not work');

The second is to use the log() shortcut function available on any class
that extends ``Object``. Calling log() will internally call
CakeLog::write().

::

    //Executing this inside a CakePHP class:
    $this->log("Something did not work!", 'debug');

All configured log streams are written to sequentially each time
``CakeLog::write()`` is called. You do not need to configure a stream in
order to use logging. If no streams are configured when the log is
written to, a ``default`` stream using the core ``FileLog`` class will
be configured to output into ``app/tmp/logs/`` just as CakeLog did in
CakePHP 1.2

Using the default FileLog class
===============================

While CakeLog can be configured to write to a number of user configured
logging adapters, it also comes with a default logging configuration.
This configuration is identical to how CakeLog behaved in CakePHP 1.2.
The default logging configuration will be used any time there are *no
other* logging adapters configured. Once a logging adapter has been
configured you will need to also configure FileLog if you want file
logging to continue.

As its name implies FileLog writes log messages to files. The type of
log message being written determines the name of the file the message is
stored in. If a type is not supplied, LOG\_ERROR is used which writes to
the error log. The default log location is ``app/tmp/logs/$type.log``

::

    //Executing this inside a CakePHP class:
     $this->log("Something didn't work!");
     
    //Results in this being appended to app/tmp/logs/error.log
    2007-11-02 10:22:02 Error: Something didn't work!

You can specify a custom log names, using the second parameter. The
default built-in FileLog class will treat this log name as the file you
wish to write logs to.

::

    //called statically
    CakeLog::write('activity', 'A special message for activity logging');
     
    //Results in this being appended to app/tmp/logs/activity.log (rather than error.log)
    2007-11-02 10:22:02 Activity: A special message for activity logging

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

Creating and configuring log streams
====================================

Log stream handlers can be part of your application, or part of plugins.
If for example you had a database logger called ``DataBaseLogger`` as
part of your application it would be placed in
``app/libs/log/data_base_logger.php``; as part of a plugin it would be
placed in ``app/plugins/my_plugin/libs/log/data_base_logger.php``. When
configured, ``CakeLog`` will attempt to load. Configuring log streams is
done by calling ``CakeLog::config()``. Configuring our DataBaseLogger
would look like

::

    //for app/libs
    CakeLog::config('otherFile', array(
        'engine' => 'DataBaseLogger',
        'model' => 'LogEntry',
        ...
    ));

    //for plugin called LoggingPack
    CakeLog::config('otherFile', array(
        'engine' => 'LoggingPack.DataBaseLogger',
        'model' => 'LogEntry',
        ...
    ));

When configuring a log stream the ``engine`` parameter is used to locate
and load the log handler. All of the other configuration properties are
passed to the log stream's constructor as an array.

::

    class DataBaseLogger {
        function __construct($options = array()) {
            //...
        }
    }

CakePHP has no requirements for Log streams other than that they must
implement a ``write`` method. This write method must take two parameters
``$type, $message`` in that order. ``$type`` is the string type of the
logged message, core values are ``error``, ``warning``, ``info`` and
``debug``. In addition you can define your own types by using them when
you call ``CakeLog::write``.

It should be noted that you will encounter errors when trying to
configure application level loggers from ``app/config/core.php``. This
is because paths are not yet bootstrapped. Configuring of loggers should
be done in ``app/config/bootstrap.php`` to ensure classes are properly
loaded.

Interacting with log streams
============================

You can introspect the configured streams with
``CakeLog::configured()``. The return of ``configured()`` is an array of
all the currently configured streams. You can remove streams using
``CakeLog::drop($key)``. Once a log stream has been dropped it will no
longer receive messages.

Error logging
=============

Errors are now logged when ``Configure::write('debug', 0);``. You can
use ``Configure::write('log', $val)``, to control which errors are
logged when debug is off. By default all errors are logged.

::

    Configure::write('log', E_WARNING);

Would log only warning and fatal errors. Setting
``Configure::write('log', false);`` will disable error logging when
debug = 0.
