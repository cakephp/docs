Logging
#######

While CakePHP core Configure Class settings can really help you see
what's happening under the hood, there are certain times that
you'll need to log data to the disk in order to find out what's
going on. With technologies like SOAP, AJAX, and REST APIs, debugging can be
rather difficult.

Logging can also be a way to find out what's been going on in your
application over time. What search terms are being used? What sorts
of errors are my users being shown? How often is a particular query
being executed?

Logging data in CakePHP is easy - the log() function is provided by the
``LogTrait``, which is the common ancestor for many CakePHP classes. If
the context is a CakePHP class (Controller, Component, View,...),
you can log your data.  You can also use ``Log::write()`` directly.
See :ref:`writing-to-logs`.

.. _log-configuration:

Logging Configuration
=====================

Configuring ``Log`` should be done during your application's bootstrap phase.
The **config/app.php** file is intended for just this.  You can define
as many or as few loggers as your application needs.  Loggers should be
configured using :php:class:`Cake\\Core\\Log`. An example would be::

    use Cake\Log\Log;

    // Short classname
    Log::config('debug', [
        'className' => 'File',
        'path' => LOGS,
        'levels' => ['notice', 'info', 'debug'],
        'file' => 'debug',
    ]);

    // Fully namespaced name.
    Log::config('error', [
        'className' => 'Cake\Log\Engine\FileLog',
        'path' => LOGS,
        'levels' => ['warning', 'error', 'critical', 'alert', 'emergency'],
        'file' => 'error',
    ]);

The above creates two loggers.  One named ``debug`` the other named ``error``.
Each is configured to handle different levels of messages. They also store their
log messages in separate files, so it's easy to separate debug/notice/info logs
from more serious errors. See the section on :ref:`logging-levels` for more
information on the different levels and what they mean.

Once a configuration is created you cannot change it. Instead you should drop
the configuration and re-create it using :php:meth:`Cake\\Log\\Log::drop()` and
:php:meth:`Cake\\Log\\Log::config()`.

It is also possible to create loggers by providing a closure. This is useful
when you need full control over how the logger object is built. The closure
has to return the constructed logger instance. For example::

    Log::config('special', function () {
        return new \Cake\Log\Engine\FileLog(['path' => LOGS, 'file' => 'log']);
    });

Configuration options can also be provided as a :term:`DSN` string. This is
useful when working with environment variables or :term:`PaaS` providers::

    Log::config('error', [
        'url' => 'file:///?levels[]=warning&levels[]=error&file=error',
    ]);

.. note::

    Loggers are required to implement the ``Psr\Log\LoggerInterface`` interface.

Creating Log Adapters
---------------------

<<<<<<< HEAD
Log adapters can be part of your application, or part of
plugins. If for example you had a database logger called
``DatabaseLog``. As part of your application it would be placed in
**src/Log/Engine/DatabaseLog.php**. As part of a plugin it would be placed in
**plugins/LoggingPack/src/Log/Engine/DatabaseLog.php**. To configure log
adapters you should use :php:meth:`Cake\\Log\\Log::config()`.  For example
configuring our DatabaseLog would look like::

    // For src/Log
    Log::config('otherFile', [
        'className' => 'Database',
=======
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
>>>>>>> f65f0416ab9e6b2c92f1f047a45aa4661affa33d
        'model' => 'LogEntry',
        // ...
    ]);

    // For plugin called LoggingPack
    Log::config('otherFile', [
        'className' => 'LoggingPack.Database',
        'model' => 'LogEntry',
        // ...
    ]);

When configuring a log adapter the ``className`` parameter is used to
locate and load the log handler. All of the other configuration
<<<<<<< HEAD
properties are passed to the log adapter's constructor as an array. ::
=======
properties are passed to the log stream's constructor as an array. ::
>>>>>>> f65f0416ab9e6b2c92f1f047a45aa4661affa33d

    namespace App\Log\Engine;
    use Cake\Log\Engine\BaseLog;

    class DatabaseLog extends BaseLog
    {
        public function __construct($options = [])
        {
            parent::__construct($options);
            // ...
        }

        public function log($level, $message, array $context = [])
        {
            // Write to the database.
        }
    }

<<<<<<< HEAD
CakePHP requires that all logging adapters implement ``Psr\Log\LoggerInterface``.
The class :php:class:`Cake\Log\Engine\BaseLog` is an easy way to satisfy the
interface as it only requires you to implement the ``log()`` method.
=======
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
>>>>>>> f65f0416ab9e6b2c92f1f047a45aa4661affa33d

.. _file-log:

``FileLog`` engine takes the following options:

* ``size`` Used to implement basic log file rotation. If log file size
<<<<<<< HEAD
  reaches specified size the existing file is renamed by appending timestamp
  to filename and new log file is created. Can be integer bytes value or
  human readable string values like '10MB', '100KB' etc. Defaults to 10MB.
* ``rotate`` Log files are rotated specified times before being removed.
  If value is 0, old versions are removed rather then rotated. Defaults to 10.
=======
  reaches the specified size, the existing file is renamed by appending timestamp
  to filename and a new log file is created. Can be integer bytes value or
  human readable string values like '10MB', '100KB' etc. Defaults to 10MB.
  Setting size to false will disable the ``rotate`` option below.
* ``rotate`` Log files are rotated a specified number of times before being removed.
  If the value is 0, old versions are removed rather than rotated. Defaults to 10.
>>>>>>> f65f0416ab9e6b2c92f1f047a45aa4661affa33d
* ``mask`` Set the file permissions for created files. If left empty the default
  permissions are used.

.. warning::

<<<<<<< HEAD
    Engines have the suffix ``Log``. You should avoid class names like ``SomeLogLog``
    which include the suffix twice at the end.
=======
    Prior to 2.4 you had to include the suffix ``Log`` in your configuration
    (``LoggingPack.DatabaseLog``). This is not necessary anymore.
    If you have been using a Log engine like ```DatabaseLogger`` that does not follow
    the convention to use a suffix ``Log`` for your class name, you have to adjust your
    class name to ``DatabaseLog``. You should also avoid class names like ``SomeLogLog``,
    which includes the suffix twice at the end.
>>>>>>> f65f0416ab9e6b2c92f1f047a45aa4661affa33d

.. note::

    You should configure loggers during bootstrapping. **config/app.php** is the
    conventional place to configure log adapters.

    In debug mode missing directories will be automatically created to avoid unnecessary
    errors thrown when using the FileEngine.

Error and Exception Logging
===========================

<<<<<<< HEAD
Errors and Exceptions can also be logged. By configuring the co-responding
values in your app.php file.  Errors will be displayed when debug > 0 and logged
when debug is ``false``. To log uncaught exceptions, set the ``log`` option to
``true``. See :doc:`/development/configuration` for more information.
=======
Errors and Exceptions can also be logged by configuring the
corresponding values in your core.php file. Errors will be
displayed when debug > 0 and logged when debug == 0. Set ``Exception.log``
to true to log uncaught exceptions. See :doc:`/development/configuration`
for more information.
>>>>>>> f65f0416ab9e6b2c92f1f047a45aa4661affa33d

Interacting with Log Streams
============================

You can introspect the configured streams with
<<<<<<< HEAD
:php:meth:`Cake\\Log\\Log::configured()`. The return of ``configured()`` is an
=======
:php:meth:`CakeLog::configured()`. The return value of ``configured()`` is an
>>>>>>> f65f0416ab9e6b2c92f1f047a45aa4661affa33d
array of all the currently configured streams. You can remove
streams using :php:meth:`Cake\\Log\\Log::drop()`. Once a log stream has been
dropped it will no longer receive messages.

<<<<<<< HEAD
Using the FileLog Adapter
=========================

As its name implies FileLog writes log messages to files. The level of log
message being written determines the name of the file the message is stored in.
If a level is not supplied, :php:const:`LOG_ERR` is used which writes to the
error log. The default log location is ``logs/$level.log``::
=======
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
>>>>>>> f65f0416ab9e6b2c92f1f047a45aa4661affa33d

    // Executing this inside a CakePHP class
    $this->log("Something didn't work!");

    // Results in this being appended to logs/error.log
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

In production environments it is highly recommended that you setup your system to
use syslog instead of the files logger. This will perform much better as all
writes will be done in a (almost) non-blocking fashion. Your operating system
logger can be configured separately to rotate files, pre-process writes or use
a completely different storage for your logs.

<<<<<<< HEAD
Using syslog is pretty much like using the default FileLog engine, you just need
to specify ``Syslog`` as the engine to be used for logging. The following
configuration snippet will replace the default logger with syslog, this should
be done in the **bootstrap.php** file::
=======
Using syslog is pretty much like using the default FileLog engine; you just need
to specify `Syslog` as the engine to be used for logging. The following
configuration snippet will replace the default logger with syslog. This should
be done in the `bootstrap.php` file::
>>>>>>> f65f0416ab9e6b2c92f1f047a45aa4661affa33d

    Log::config('default', [
        'engine' => 'Syslog'
    ]);

The configuration array accepted for the Syslog logging engine understands the
following keys:

<<<<<<< HEAD
* ``format``: An sprintf template string with two placeholders, the first one
  for the error level, and the second for the message itself. This key is
=======
* `format`: A sprintf template string with two placeholders; the first one
  for the error type, and the second for the message itself. This key is
>>>>>>> f65f0416ab9e6b2c92f1f047a45aa4661affa33d
  useful to add additional information about the server or process in the
  logged message. For example: ``%s - Web Server 1 - %s`` will look like
  ``error - Web Server 1 - An error occurred in this request`` after
  replacing the placeholders.
<<<<<<< HEAD
* ``prefix``: An string that will be prefixed to every logged message.
* ``flag``: An integer flag to be used for opening the connection to the
  logger, by default ``LOG_ODELAY`` will be used. See ``openlog`` documentation
=======
* `prefix`: An string that will be prefixed to every logged message.
* `flag`: An integer flag to be used for opening the connection to the
  logger. By default `LOG_ODELAY` will be used. See `openlog` documentation
>>>>>>> f65f0416ab9e6b2c92f1f047a45aa4661affa33d
  for more options
* ``facility``: The logging slot to use in syslog. By default ``LOG_USER`` is
  used. See ``syslog`` documentation for more options

.. _writing-to-logs:

Writing to Logs
===============

Writing to the log files can be done in 2 different ways. The first
is to use the static :php:meth:`Cake\\Log\\Log::write()` method::

    Log::write('debug', 'Something did not work');

The second is to use the ``log()`` shortcut function available on any
class using the ``LogTrait``. Calling log() will internally call
``Log::write()``::

    // Executing this inside a class using LogTrait
    $this->log("Something did not work!", 'debug');

<<<<<<< HEAD
All configured log streams are written to sequentially each time
:php:meth:`Cake\\Log\\Log::write()` is called. If you have not configured any
logging adapters ``log()`` will return ``false`` and no log messages will be
written.

.. _logging-levels:
=======
All configured log streams are sequentially written to each time
:php:meth:`CakeLog::write()` is called.
>>>>>>> f65f0416ab9e6b2c92f1f047a45aa4661affa33d

Using Levels
------------

<<<<<<< HEAD
CakePHP supports the standard POSIX set of logging levels. Each level represents
an increasing level of severity:
=======
CakeLog does not auto-configure itself anymore. As a result, log files will not be
auto-created anymore if no stream is listening.
Make sure you have at least one ``default`` stream set up if you want to
listen to all types and levels. Usually, you can just set the core ``FileLog`` class
to output into ``app/tmp/logs/``::
>>>>>>> f65f0416ab9e6b2c92f1f047a45aa4661affa33d

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
:php:meth:`Cake\\Log\\Log::error()` to clearly indicate the logging
level. Using a level that is not in the above levels will result in an
exception.

.. note::
    When ``levels`` is set to an empty value in a logger's configuration, it
    will take messages of any level.

.. _logging-scopes:

Logging Scopes
--------------

Often times you'll want to configure different logging behavior for different
subsystems or parts of your application. Take for example an e-commerce shop;
You'll probably want to handle logging for orders and payments differently than
you do other less critical logs.

CakePHP exposes this concept as logging scopes. When log messages are written
you can include a scope name. If there is a configured logger for that scope,
the log messages will be directed to those loggers. For example::

    // Configure logs/shops.log to receive all levels, but only
    // those with `orders` and `payments` scope.
    Log::config('shops', [
        'className' => 'File',
        'path' => LOGS,
        'levels' => [],
        'scopes' => ['orders', 'payments'],
        'file' => 'shops.log',
    ]);

    // Configure logs/payments.log to receive all levels, but only
    // those with `payments` scope.
    Log::config('payments', [
        'className' => 'File',
        'path' => LOGS,
        'levels' => [],
        'scopes' => ['payments'],
        'file' => 'payments.log',
    ]);

    Log::warning('this gets written only to shops.log', ['scope' => ['orders']]);
    Log::warning('this gets written to both shops.log and payments.log', ['scope' => ['payments']]);

Scopes can also be passed as a single string or a numerically indexed array.
Note that using this form will limit the ability to pass more data as context::

    Log::warning('This is a warning', ['orders']);
    Log::warning('This is a warning', 'payments');

.. note::
    When ``scopes`` is set to an empty array or ``null`` in a logger's
    configuration, it will take messages of any scope. Setting it to ``false``
    will only match messages without scope.

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

.. php:staticmethod:: write($level, $message, $scope = [])

    Write a message into all the configured loggers.
    ``$level`` indicates the level of log message being created.
    ``$message`` is the message of the log entry being written to.
    ``$scope`` is the scope(s) a log message is being created in.

.. php:staticmethod:: levels()

Call this method without arguments, eg: `Log::levels()` to obtain current
level configuration.

Convenience Methods
-------------------

The following convenience methods were added to log `$message` with the
appropriate log level.

.. php:staticmethod:: emergency($message, $scope = [])
.. php:staticmethod:: alert($message, $scope = [])
.. php:staticmethod:: critical($message, $scope = [])
.. php:staticmethod:: error($message, $scope = [])
.. php:staticmethod:: warning($message, $scope = [])
.. php:staticmethod:: notice($message, $scope = [])
.. php:staticmethod:: debug($message, $scope = [])
.. php:staticmethod:: info($message, $scope = [])

Logging Trait
=============

.. php:trait:: LogTrait

    A trait that provides shortcut methods for logging

.. php:method:: log($msg, $level = LOG_ERR)

    Log a message to the logs.  By default messages are logged as
    ERROR messages.  If ``$msg`` isn't a string it will be converted with
    ``print_r`` before being logged.

Using Monolog
=============

Monolog is a popular logger for PHP. Since it implements the same interfaces as
the CakePHP loggers, it is easy to use in your application as the default
logger.

After installing Monolog using composer, configure the logger using the
``Log::config()`` method::

    // config/bootstrap.php

    use Monolog\Logger;
    use Monolog\Handler\StreamHandler;

    Log::config('default', function () {
        $log = new Logger('app');
        $log->pushHandler(new StreamHandler('path/to/your/combined.log'));
        return $log;
    });

    // Optionally stop using the now redundant default loggers
    Log::drop('debug');
    Log::drop('error');

Use similar methods if you want to configure a different logger for your console::

    // config/bootstrap_cli.php

    use Monolog\Logger;
    use Monolog\Handler\StreamHandler;

    Log::config('default', function () {
        $log = new Logger('cli');
        $log->pushHandler(new StreamHandler('path/to/your/combined-cli.log'));
        return $log;
    });

    // Optionally stop using the now redundant default CLI loggers
    Configure::delete('Log.debug');
    Configure::delete('Log.error');

.. note::

<<<<<<< HEAD
    When using a console specific logger, make sure to conditionally configure
    your application logger. This will prevent duplicate log entries.
=======
.. php:staticmethod:: emergency($message, $scope = array())
.. php:staticmethod:: alert($message, $scope = array())
.. php:staticmethod:: critical($message, $scope = array())
.. php:staticmethod:: error($message, $scope = array())
.. php:staticmethod:: warning($message, $scope = array())
.. php:staticmethod:: notice($message, $scope = array())
.. php:staticmethod:: info($message, $scope = array())
.. php:staticmethod:: debug($message, $scope = array())

>>>>>>> f65f0416ab9e6b2c92f1f047a45aa4661affa33d

.. meta::
    :title lang=en: Logging
    :description lang=en: Log CakePHP data to the disk to help debug your application over longer periods of time.
    :keywords lang=en: cakephp logging,log errors,debug,logging data,cakelog class,ajax logging,soap logging,debugging,logs
