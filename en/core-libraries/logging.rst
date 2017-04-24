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

Log stream handlers can be part of your application, or part of plugins. If for
example you had a database logger called ``DatabaseLog`` as part of your
application, it would be placed in ``app/Lib/Log/Engine/DatabaseLog.php``. If
you had a database logger as part of a plugin, it would be placed in
``app/Plugin/LoggingPack/Lib/Log/Engine/DatabaseLog.php``. When configured,
``CakeLog`` will attempt to load Configuring log streams, which is done by
calling ``CakeLog::config()``. Configuring our DatabaseLog would look like::

    // for app/Lib
    CakeLog::config('otherFile', array(
        'engine' => 'Database',
        'model' => 'LogEntry',
        // ...
    ));

    // for plugin called LoggingPack
    CakeLog::config('otherFile', array(
        'engine' => 'LoggingPack.Database',
        'model' => 'LogEntry',
        // ...
    ));

When configuring a log stream the ``engine`` parameter is used to
locate and load the log handler. All of the other configuration
properties are passed to the log stream's constructor as an array. ::

    App::uses('BaseLog', 'Log/Engine');

    class DatabaseLog extends BaseLog {
        public function __construct($options = array()) {
            parent::__construct($options);
            // ...
        }

        public function write($type, $message) {
            // write to the database.
        }
    }

While CakePHP has no requirements for Log streams other than that they
must implement a ``write`` method, extending the ``BaseLog`` class has a few
benefits:

- It automatically handles the scope and type argument casting.
- It implements the ``config()`` method which is required to make scoped logging
  work.

Each logger's write method must take two parameters: ``$type, $message`` (in that
order). ``$type`` is the string type of the logged message; core values are
``error``, ``warning``, ``info`` and ``debug``. Additionally you can define your
own types by using them when you call ``CakeLog::write``.

.. _file-log:

.. versionadded:: 2.4

As of 2.4 ``FileLog`` engine takes a few new options:

* ``size`` Used to implement basic log file rotation. If log file size
  reaches the specified size, the existing file is renamed by appending timestamp
  to filename and a new log file is created. Can be integer bytes value or
  human readable string values like '10MB', '100KB' etc. Defaults to 10MB.
  Setting size to false will disable the ``rotate`` option below.
* ``rotate`` Log files are rotated a specified number of times before being removed.
  If the value is 0, old versions are removed rather than rotated. Defaults to 10.
* ``mask`` Set the file permissions for created files. If left empty the default
  permissions are used.

.. warning::

    Prior to 2.4 you had to include the suffix ``Log`` in your configuration
    (``LoggingPack.DatabaseLog``). This is not necessary anymore.
    If you have been using a Log engine like ```DatabaseLogger`` that does not follow
    the convention to use a suffix ``Log`` for your class name, you have to adjust your
    class name to ``DatabaseLog``. You should also avoid class names like ``SomeLogLog``,
    which includes the suffix twice at the end.

.. note::

    Always configure loggers in ``app/Config/bootstrap.php``
    Trying to use Application or plugin loggers in core.php
    will cause issues, as application paths are not yet configured.

    Also new in 2.4: In debug mode missing directories will now be automatically created to avoid unnecessary
    errors thrown when using the FileEngine.

Error and Exception logging
===========================

Errors and Exceptions can also be logged by configuring the
corresponding values in your core.php file. Errors will be
displayed when debug > 0 and logged when debug == 0. Set ``Exception.log``
to true to log uncaught exceptions. See :doc:`/development/configuration`
for more information.

Interacting with log streams
============================

You can introspect the configured streams with
:php:meth:`CakeLog::configured()`. The return value of ``configured()`` is an
array of all the currently configured streams. You can remove
streams using :php:meth:`CakeLog::drop()`. Once a log stream has been
dropped, it will no longer receive messages.


Using the default FileLog class
===============================

While CakeLog can be configured to write to a number of user
configured logging adapters, it also comes with a default logging
configuration. The default logging configuration will be
used any time there are *no other* logging adapters configured.
Once a logging adapter has been configured, you will need to also
configure FileLog if you want file logging to continue.

As its name implies, FileLog writes log messages to files. The type
of log message being written determines the name of the file the
message is stored in. If a type is not supplied, LOG\_ERROR is used,
which writes to the error log. The default log location is
``app/tmp/logs/$type.log``::

    // Executing this inside a CakePHP class
    $this->log("Something didn't work!");

    // Results in this being appended to app/tmp/logs/error.log
    // 2007-11-02 10:22:02 Error: Something didn't work!

You can specify a custom log name using the first parameter. The
default built-in FileLog class will treat this log name as the file
you wish to write logs to::

    // called statically
    CakeLog::write('activity', 'A special message for activity logging');

    // Results in this being appended to app/tmp/logs/activity.log (rather than error.log)
    // 2007-11-02 10:22:02 Activity: A special message for activity logging

The configured directory must be writable by the web server user in
order for logging to work correctly.

You can configure additional/alternate FileLog locations using
:php:meth:`CakeLog::config()`. FileLog accepts a ``path`` which allows for
custom paths to be used::

    CakeLog::config('custom_path', array(
        'engine' => 'File',
        'path' => '/path/to/custom/place/'
    ));

.. _syslog-log:

Logging to Syslog
=================

.. versionadded:: 2.4

In production environments it is highly recommended that you setup your system to
use syslog instead of the files logger. This will perform much better as all
writes will be done in a (almost) non-blocking fashion. Your operating system
logger can be configured separately to rotate files, pre-process writes or use
a completely different storage for your logs.

Using syslog is pretty much like using the default FileLog engine; you just need
to specify `Syslog` as the engine to be used for logging. The following
configuration snippet will replace the default logger with syslog. This should
be done in the `bootstrap.php` file::

    CakeLog::config('default', array(
        'engine' => 'Syslog'
    ));

The configuration array accepted for the Syslog logging engine understands the
following keys:

* `format`: A sprintf template string with two placeholders; the first one
  for the error type, and the second for the message itself. This key is
  useful to add additional information about the server or process in the
  logged message. For example: ``%s - Web Server 1 - %s`` will look like
  ``error - Web Server 1 - An error occurred in this request`` after
  replacing the placeholders.
* `prefix`: An string that will be prefixed to every logged message.
* `flag`: An integer flag to be used for opening the connection to the
  logger. By default `LOG_ODELAY` will be used. See `openlog` documentation
  for more options
* `facility`: The logging slot to use in syslog. By default `LOG_USER` is
  used. See `syslog` documentation for more options

.. _writing-to-logs:

Writing to logs
===============

Writing to the log files can be done in 2 different ways. The first
is to use the static :php:meth:`CakeLog::write()` method::

    CakeLog::write('debug', 'Something did not work');

The second is to use the log() shortcut function available on any
class that extends ``Object``. Calling log() will internally call
CakeLog::write()::

    // Executing this inside a CakePHP class:
    $this->log("Something did not work!", 'debug');

All configured log streams are sequentially written to each time
:php:meth:`CakeLog::write()` is called.

.. versionchanged:: 2.5

CakeLog does not auto-configure itself anymore. As a result, log files will not be
auto-created anymore if no stream is listening.
Make sure you have at least one ``default`` stream set up if you want to
listen to all types and levels. Usually, you can just set the core ``FileLog`` class
to output into ``app/tmp/logs/``::

    CakeLog::config('default', array(
        'engine' => 'File'
    ));

.. _logging-scopes:

Logging Scopes
==============

.. versionadded:: 2.2

Often times you'll want to configure different logging behavior for different
subsystems or parts of your application. Take for example an e-commerce shop;
You'll probably want to handle logging for orders and payments differently than
you do other less critical logs.

CakePHP exposes this concept as logging scopes. When log messages are written
you can include a scope name. If there is a configured logger for that scope,
the log messages will be directed to those loggers.
If a log message is written to an unknown scope, no logger will log the message,
even if it handles that level of message. For example::

    // Configure tmp/logs/shop.log to receive the two configured types (log levels), but only
    // those with `orders` and `payments` as scope
    CakeLog::config('shop', array(
        'engine' => 'FileLog',
        'types' => array('warning', 'error'),
        'scopes' => array('orders', 'payments'),
        'file' => 'shop.log',
    ));

    // Configure tmp/logs/payments.log to receive the two configured types, but only
    // those with `payments` as scope
    CakeLog::config('payments', array(
        'engine' => 'SyslogLog',
        'types' => array('info', 'error', 'warning'),
        'scopes' => array('payments')
    ));

    CakeLog::warning('This gets written only to shops stream', 'orders');
    CakeLog::warning('This gets written to both shops and payments streams', 'payments');
    CakeLog::warning('This gets written to neither of both streams', 'unknown');

In order for scopes to work, you **must** do a few things:

#. Define the accepted ``types`` on loggers that use scopes.
#. Loggers using scopes must implement a ``config()`` method. Extending the
   ``BaseLog`` class is the easiest way to get a compatible method.

CakeLog API
===========

.. php:class:: CakeLog

    A simple class for writing to logs.

.. php:staticmethod:: config($name, $config)

    :param string $name: Name for the logger being connected, used
        to drop a logger later on.
    :param array $config: Array of configuration information and
        constructor arguments for the logger.

    Connect a new logger to CakeLog. Each connected logger
    receives all log messages each time a log message is written.

.. php:staticmethod:: configured()

    :returns: An array of configured loggers.

    Get the names of the configured loggers.

.. php:staticmethod:: drop($name)

    :param string $name: Name of the logger you wish to no longer receive
        messages.

.. php:staticmethod:: write($level, $message, $scope = array())

    Write a message into all the configured loggers.
    $level indicates the level of log message being created.
    $message is the message of the log entry being written to.

    .. versionchanged:: 2.2 ``$scope`` was added

.. versionadded:: 2.2 Log levels and scopes

.. php:staticmethod:: levels()

    Call this method without arguments, eg: ``CakeLog::levels()`` to
    obtain current level configuration.

    To append the additional levels 'user0' and 'user1' to the default
    log levels use::

        CakeLog::levels(array('user0', 'user1'));
        // or
        CakeLog::levels(array('user0', 'user1'), true);

    Calling ``CakeLog::levels()`` will result in::

        array(
            0 => 'emergency',
            1 => 'alert',
            // ...
            8 => 'user0',
            9 => 'user1',
        );

    To set/replace an existing configuration, pass an array with the second
    argument set to false::

        CakeLog::levels(array('user0', 'user1'), false);

    Calling ``CakeLog::levels()`` will result in::

        array(
            0 => 'user0',
            1 => 'user1',
        );

.. php:staticmethod:: defaultLevels()

    :returns: An array of the default log levels values.

    Resets log levels to their original values::

        array(
            'emergency' => LOG_EMERG,
            'alert'     => LOG_ALERT,
            'critical'  => LOG_CRIT,
            'error'     => LOG_ERR,
            'warning'   => LOG_WARNING,
            'notice'    => LOG_NOTICE,
            'info'      => LOG_INFO,
            'debug'     => LOG_DEBUG,
        );

.. php:staticmethod:: enabled($streamName)

    :returns: boolean

    Checks whether ``$streamName`` has been enabled.

.. php:staticmethod:: enable($streamName)

    :returns: void

    Enable the stream ``$streamName``.

.. php:staticmethod:: disable($streamName)

    :returns: void

    Disable the stream ``$streamName``.

.. php:staticmethod:: stream($streamName)

    :returns: Instance of ``BaseLog`` or ``false`` if not found.

    Gets ``$streamName`` from the active streams.

Convenience methods
-------------------

.. versionadded:: 2.2

The following convenience methods were added to log ``$message`` with the
appropriate log level.

.. php:staticmethod:: emergency($message, $scope = array())
.. php:staticmethod:: alert($message, $scope = array())
.. php:staticmethod:: critical($message, $scope = array())
.. php:staticmethod:: error($message, $scope = array())
.. php:staticmethod:: warning($message, $scope = array())
.. php:staticmethod:: notice($message, $scope = array())
.. php:staticmethod:: info($message, $scope = array())
.. php:staticmethod:: debug($message, $scope = array())


.. meta::
    :title lang=en: Logging
    :description lang=en: Log CakePHP data to the disk to help debug your application over longer periods of time.
    :keywords lang=en: cakephp logging,log errors,debug,logging data,cakelog class,ajax logging,soap logging,debugging,logs
