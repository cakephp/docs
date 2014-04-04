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
You can also use ``Log::write()`` directly. See :ref:`writing-to-logs`

.. _log-configuration:

Logging Configuration
=====================

Configuring ``Log`` should be done during your application's bootstrap phase.
The ``App/Config/app.php`` file is intended for just this.  You can define
as many or as few loggers as your application needs.  Loggers should be
configured using :php:class:`Cake\\Core\\Log`. An example would be::

    use Cake\Log\Log;

    // Short classname
    Log::config('debug', [
        'className' => 'FileLog',
        'levels' => ['notice', 'info', 'debug'],
        'file' => 'debug',
    ]);

    // Fully namespaced name.
    Log::config('error', [
        'className' => 'Cake\Log\Engine\FileLog',
        'levels' => ['warning', 'error', 'critical', 'alert', 'emergency'],
        'file' => 'error',
    ]);

The above creates two loggers.  One named ``debug`` the other named ``error``.
Each is configured to handle different levels of messages. They also store their
log messages in separate files, so its easy to separate debug/notice/info logs
from more serious errors. See the section on :ref:`logging-levels` for more
information on the different levels and what they mean.

Once a configuration is created you cannot change it. Instead you should drop
the configuration and re-create it using :php:meth:`Cake\\Log\\Log::drop()` and
:php:meth:`Cake\\Log\\Log::config()`.

Creating Log Adapters
---------------------

Log adapters can be part of your application, or part of
plugins. If for example you had a database logger called
``DatabaseLog``. As part of your application it would be placed in
``App/Log/Engine/DatabaseLog.php``. As part of a plugin it would be placed in
``App/Plugin/LoggingPack/Log/Engine/DatabaseLog.php``. To configure log
adapters you should use :php:meth:`Cake\\Log\\Log::config()`.  For example
configuring our DatabaseLog would look like::

    // for App/Log
    Log::config('otherFile', [
        'className' => 'DatabaseLog',
        'model' => 'LogEntry',
        // ...
    ]);

    // for plugin called LoggingPack
    Log::config('otherFile', [
        'className' => 'LoggingPack.DatabaseLog',
        'model' => 'LogEntry',
        // ...
    ]);

When configuring a log adapter the ``className`` parameter is used to
locate and load the log handler. All of the other configuration
properties are passed to the log adapter's constructor as an array.::

    use Cake\Log\LogInterface;

    class DatabaseLog implements LogInterface {
        public function __construct($options = []) {
            // ...
        }

        public function write($level, $message, $scope = []) {
            // write to the database.
        }
    }

CakePHP requires that all logging adapters implement
:php:class:`Cake\\Log\\LogInterface`.

.. _file-log:

.. versionadded:: 2.4

As of 2.4 ``FileLog`` engine takes a few new options:

* ``size`` Used to implement basic log file rotation. If log file size
  reaches specified size the existing file is renamed by appending timestamp
  to filename and new log file is created. Can be integer bytes value or
  human reabable string values like '10MB', '100KB' etc. Defaults to 10MB.
* ``rotate`` Log files are rotated specified times before being removed.
  If value is 0, old versions are removed rather then rotated. Defaults to 10.
* ``mask`` Set the file permissions for created files. If left empty the default
  permissions are used.

.. warning::

    Prior to 2.4 you had to include the suffix ``Log`` in your configuration
    (``LoggingPack.DatabaseLog``). This is now not necessary anymore.
    If you have been using a Log engine like ```DatabaseLogger`` that does not follow
    the convention to use a suffix ``Log`` for your class name you have to adjust your
    class name to ``DatabaseLog``. You should also avoid class names like ``SomeLogLog``
    which include the suffix twice at the end.

.. note::

    You should configure loggers during bootstrapping. ``app/Config/app.php`` is the
    conventional place to configure log adapters.

    Also new in 2.4: In debug mode missing directories will now be automatically created to avoid unnecessary
    errors thrown when using the FileEngine.

Error and Exception Logging
===========================

Errors and Exceptions can also be logged. By configuring the co-responding
values in your app.php file.  Errors will be displayed when debug > 0 and logged
when debug == 0. To log uncaugh exceptions, set the ``log`` option to true. See
:doc:`/development/configuration` for more information.

Interacting with Log Streams
============================

You can introspect the configured streams with
:php:meth:`Cake\\Log\\Log::configured()`. The return of ``configured()`` is an
array of all the currently configured streams. You can remove
streams using :php:meth:`Cake\\Log\\Log::drop()`. Once a log stream has been
dropped it will no longer receive messages.


Using the FileLog Adapter
=========================

As its name implies FileLog writes log messages to files. The level of log
message being written determines the name of the file the message is stored in.
If a level is not supplied, :php:const:`LOG_ERROR` is used which writes to the
error log. The default log location is ``app/tmp/logs/$level.log``::

    // Executing this inside a CakePHP class
    $this->log("Something didn't work!");

    // Results in this being appended to app/tmp/logs/error.log
    // 2007-11-02 10:22:02 Error: Something didn't work!

The configured directory must be writable by the web server user in
order for logging to work correctly.

You can configure additional/alternate FileLog locations when configuring
a logger.FileLog accepts a ``path`` which allows for
custom paths to be used::

    Log::config('custom_path', [
        'className' => 'File',
        'path' => '/path/to/custom/place/'
    ]);

.. warning::
    If you do not configure a logging adapter, log messages will not be stored.

.. _syslog-log:

Logging to Syslog
=================

.. versionadded:: 2.4

In production environments it is highly recommended that you setup your system to
use syslog instead of the files logger. This will perform much better as any
writes will be done in a (almost) non-blocking fashion and your operating  system
logger can be configured separately to rotate files, pre-process writes or use
a completely different storage for your logs.

Using syslog is pretty much like using the default FileLog engine, you just need
to specify `Syslog` as the engine to be used for logging. The following
configuration snippet will replace the default logger with syslog, this should
be done in the `bootstrap.php` file::

    CakeLog::config('default', array(
        'engine' => 'Syslog'
    ));

The configuration array accepted for the Syslog logging engine understands the
following keys:

* `format`: An sprintf template strings with two placeholders, the first one
  for the error level, and the second for the message itself. This key is
  useful to add additional information about the server or process in the
  logged message. For example: ``%s - Web Server 1 - %s`` will look like
  ``error - Web Server 1 - An error occurred in this request`` after
  replacing the placeholders.
* `prefix`: An string that will be prefixed to every logged message.
* `flag`: An integer flag to be used for opening the connection to the
  logger, by default `LOG_ODELAY` will be used. See `openlog` documentation
  for more options
* `facility`: The logging slot to use in syslog. By default `LOG_USER` is
  used. See `syslog` documentation for more options

.. _writing-to-logs:

Writing to Logs
===============

Writing to the log files can be done in 2 different ways. The first
is to use the static :php:meth:`Cake\\Log\\Log::write()` method::

    Log::write('debug', 'Something did not work');

The second is to use the log() shortcut function available on any
class that extends ``Object``. Calling log() will internally call
``Log::write()``::

    // Executing this inside a CakePHP class:
    $this->log("Something did not work!", 'debug');

All configured log streams are written to sequentially each time
:php:meth:`Cake\\Log\\Log::write()` is called. If you have not configured any
logging adapters ``log()`` will return false and no log messages will be
written.

.. _logging-levels:

Using Levels
------------

CakePHP supports the standard POSIX set of logging levels. Each level represents
an increasing level of severity:

* Emergency: system is unusable
* Alert: action must be taken immediately
* Critical: critical conditions
* Error: error conditions
* Warning: warning conditions
* Notice: normal but significant condition
* Info: informational messages
* Debug: debug-level messages

You can refer to these levels by name when configuring loggers, and when writing
log messages. Alternatively, you can use convenience methods like
:php:meth:`Cake\\Log\\Log::error()` to clearly and easily indicate the logging
level. Using a level that is not in the above levels will result in an
exception.

.. _logging-scopes:

Logging Scopes
--------------

Often times you'll want to configure different logging behavior for different
subsystems or parts of your application. Take for example an e-commerce shop.
You'll probably want to handle logging for orders and payments differently than
you do other less critical logs.

CakePHP exposes this concept as logging scopes. When log messages are written
you can include a scope name. If there is a configured logger for that scope,
the log messages will be directed to those loggers. If a log message is written
to an unknown scope, loggers that handle that level of message will log the
message. For example::

    // configure tmp/logs/shops.log to receive all levels, but only
    // those with `orders` and `payments` scope
    Log::config('shops', [
        'className' => 'FileLog',
        'levels' => [],
        'scopes' => ['orders', 'payments'],
        'file' => 'shops.log',
    ]);

    // configure tmp/logs/payments.log to receive all levels, but only
    // those with `payments` scope
    Log::config('payments', [
        'className' => 'FileLog',
        'levels' => [],
        'scopes' => ['payments'],
        'file' => 'payments.log',
    ]);

    Log::warning('this gets written only to shops.log', 'orders');
    Log::warning('this gets written to both shops.log and payments.log', 'payments');
    Log::warning('this gets written to both shops.log and payments.log', 'unknown');

As of 3.0 the logging scope passed to :php:meth:`Cake\\Log\\Log::write()` is
forwarded to the log engines' ``write()`` method in order to provide better
context to the engines.

Log API
=======

.. php:namespace:: Cake\Log

.. php:class:: Log

    A simple class for writing to logs.

.. php:staticmethod:: config($key, $config)

    :param string $name: Name for the logger being connected, used
        to drop a logger later on.
    :param array $config: Array of configuration information and
        constructor arguments for the logger.

    Get or set the configuration for a Logger. See :ref:`log-configuration` for
    more information.

.. php:staticmethod:: configured()

    :returns: An array of configured loggers.

    Get the names of the configured loggers.

.. php:staticmethod:: drop($name)

    :param string $name: Name of the logger you wish to no longer receive
        messages.

.. php:staticmethod:: write($level, $message, $scope = array())

    Write a message into all the configured loggers.
    ``$level`` indicates the level of log message being created.
    ``$message`` is the message of the log entry being written to.
    ``$scope`` is the scope(s) a log message is being created in.

.. php:staticmethod:: levels()

Call this method without arguments, eg: `Log::levels()` to obtain current
level configuration.

.. php:staticmethod:: engine($name, $engine = null)

    Fetch a connected logger by configuration name.

    .. versionadded: 3.0

Convenience Methods
-------------------

The following convenience methods were added to log `$message` with the
appropriate log level.

.. php:staticmethod:: emergency($message, $scope = array())
.. php:staticmethod:: alert($message, $scope = array())
.. php:staticmethod:: critical($message, $scope = array())
.. php:staticmethod:: error($message, $scope = array())
.. php:staticmethod:: warning($message, $scope = array())
.. php:staticmethod:: notice($message, $scope = array())
.. php:staticmethod:: debug($message, $scope = array())
.. php:staticmethod:: info($message, $scope = array())

Log Adapter Interface
=====================

.. php:interface:: LogInterface

    This interface is required for logging adapters. When creating a new logging
    adapter you'll need to implement this interface.

.. php:method:: write($level, $message, $scope = [])

    Write a message to the log storage system. ``$level`` will be the level of
    the log message.  ``$message`` will be the content of the log message.
    ``$scope`` is the scope(s) a log message is being created in.

Logging Trait
=============

.. php:trait:: LogTrait

    A trait that provides shortcut methods for logging

    .. versionadded:: 3.0

.. php:method:: log($msg, $level = LOG_ERR)

    Log a message to the logs.  By default messages are logged as
    ERROR messages.  If ``$msg`` isn't isn't a string it will be converted with
    ``print_r`` before being logged.


.. meta::
    :title lang=en: Logging
    :description lang=en: Log CakePHP data to the disk to help debug your application over longer periods of time.
    :keywords lang=en: cakephp logging,log errors,debug,logging data,cakelog class,ajax logging,soap logging,debugging,logs
