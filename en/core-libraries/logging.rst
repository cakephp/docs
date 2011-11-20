Logging
#######

While CakePHP core Configure Class settings can really help you see
what's happening under the hood, there are certain times that
you'll need to log data to the disk in order to find out what's
going on. In a world that is becoming more dependent on
technologies like SOAP and AJAX, debugging can be rather
difficult.

Logging can also be a way to find out what's been going on in your
application over time. What search terms are being used? What sorts
of errors are my users being shown? How often is a particular query
being executed?

Logging data in CakePHP is easy - the log() function is a part of
the Object class, which is the common ancestor for almost all
CakePHP classes. If the context is a CakePHP class (Model,
Controller, Component... almost anything), you can log your data.
You can also use ``CakeLog::write()`` directly. See :ref:`writing-to-logs`

Creating and configuring log streams
====================================

Log stream handlers can be part of your application, or part of
plugins. If for example you had a database logger called
``DatabaseLogger``. As part of your application it would be placed
in ``app/Lib/Log/Engine/DatabaseLogger.php``. As part of a plugin it
would be placed in
``app/Plugin/LoggingPack/Lib/Log/Engine/DatabaseLogger.php``. When
configured ``CakeLog`` will attempt to load Configuring log streams
is done by calling ``CakeLog::config()``. Configuring our
DataBaseLogger would look like::
    
    <?php
    // for app/Lib
    CakeLog::config('otherFile', array(
        'engine' => 'DatabaseLogger',
        'model' => 'LogEntry',
        // ...
    ));
    
    // for plugin called LoggingPack
    CakeLog::config('otherFile', array(
        'engine' => 'LoggingPack.DatabaseLogger',
        'model' => 'LogEntry',
        // ...
    ));

When configuring a log stream the ``engine`` parameter is used to
locate and load the log handler. All of the other configuration
properties are passed to the log stream's constructor as an array.::

    <?php
    App::uses('CakeLogInterface', 'Log');

    class DatabaseLogger implements CakeLogInterface {
        function __construct($options = array()) {
            // ...
        }

        function write($type, $message) {
            // write to the database.
        }
    }

CakePHP has no requirements for Log streams other than that they
must implement a ``write`` method. This write method must take two
parameters ``$type, $message`` in that order. ``$type`` is the
string type of the logged message, core values are ``error``,
``warning``, ``info`` and ``debug``. In addition you can define
your own types by using them when you call ``CakeLog::write``.

.. note::

    Always configure loggers in ``app/Config/bootstrap.php``
    Trying to use Application or plugin loggers in core.php
    will cause issues, as application paths are not yet configured.


Error and Exception logging
===========================

Errors and Exceptions can also be logged.  By configuring the 
co-responding values in your core.php file.  Set ``Error.log`` to 
true to log errors, and ``Exception.log`` to true to log 
uncaught exceptions. See :doc:`/development/configuration` for more
information.

Interacting with log streams
============================

You can introspect the configured streams with
:php:meth:`CakeLog::configured()`. The return of ``configured()`` is an
array of all the currently configured streams. You can remove
streams using :php:meth:`CakeLog::drop()`. Once a log stream has been
dropped it will no longer receive messages.


Using the default FileLog class
===============================

While CakeLog can be configured to write to a number of user
configured logging adapters, it also comes with a default logging
configuration. The default logging configuration will be
used any time there are *no other* logging adapters configured.
Once a logging adapter has been configured you will need to also
configure FileLog if you want file logging to continue.

As its name implies FileLog writes log messages to files. The type
of log message being written determines the name of the file the
message is stored in. If a type is not supplied, LOG\_ERROR is used
which writes to the error log. The default log location is
``app/tmp/logs/$type.log``::

    <?php
    // Executing this inside a CakePHP class
    $this->log("Something didn't work!");
    
    // Results in this being appended to app/tmp/logs/error.log
    // 2007-11-02 10:22:02 Error: Something didn't work!

You can specify a custom log names, using the second parameter. The
default built-in FileLog class will treat this log name as the file
you wish to write logs to::

    <?php
    // called statically
    CakeLog::write('activity', 'A special message for activity logging');
    
    // Results in this being appended to app/tmp/logs/activity.log (rather than error.log)
    // 2007-11-02 10:22:02 Activity: A special message for activity logging

The configured directory must be writable by the web server user in
order for logging to work correctly.

You can configure additional/alternate FileLog locations using
:php:meth:`CakeLog::config()`. FileLog accepts a ``path`` which allows for
custom paths to be used::

    <?php
    CakeLog::config('custom_path', array(
        'engine' => 'FileLog',
        'path' => '/path/to/custom/place/'
    ));

.. _writing-to-logs:

Writing to logs
===============

Writing to the log files can be done in 2 different ways. The first
is to use the static :php:meth:`CakeLog::write()` method::

    <?php
    CakeLog::write('debug', 'Something did not work');

The second is to use the log() shortcut function available on any
class that extends ``Object``. Calling log() will internally call
CakeLog::write()::

    <?php
    // Executing this inside a CakePHP class:
    $this->log("Something did not work!", 'debug');

All configured log streams are written to sequentially each time
:php:meth:`CakeLog::write()` is called. You do not need to configure a
stream in order to use logging. If no streams are configured when
the log is written to, a ``default`` stream using the core
``FileLog`` class will be configured to output into
``app/tmp/logs/`` just as CakeLog did in previous versions.

CakeLog API
===========

.. php:class:: CakeLog

    A simple class for writing to logs.

.. php:staticmethod:: config($name, $config)

    :param string $name: Name for the logger being connected, used
        to drop a logger later on.
    :param array $config: Array of configuration information and 
        constructor arguments for the logger.

    Connect a new logger to CakeLog.  Each connected logger
    receives all log messages each time a log message is written.

.. php:staticmethod:: configured()

    :returns: An array of configured loggers.

    Get the names of the configured loggers.

.. php:staticmethod:: drop($name)

    :param string $name: Name of the logger you wish to no longer receive
        messages.

.. php:staticmethod:: write($log, $message)

    Write a message into all the configured loggers.
    $log indicates the type of log message being created.
    $message is the message of the log entry being written to.



.. meta::
    :title lang=en: Logging
    :description lang=en: Log CakePHP data to the disk to help debug your application over longer periods of time.
    :keywords lang=en: cakephp logging,log errors,debug,logging data,cakelog class,ajax logging,soap logging,debugging,logs