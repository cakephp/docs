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

Logging data in CakePHP is done with the ``log()`` function. It is provided by the
``LogTrait``, which is the common ancestor for many CakePHP classes. If the
context is a CakePHP class (Controller, Component, View,...), you can log your
data.  You can also use ``Log::write()`` directly.  See :ref:`writing-to-logs`.

.. _log-configuration:

Logging Configuration
=====================

Configuring ``Log`` should be done during your application's bootstrap phase.
The **config/app.php** file is intended for just this.  You can define
as many or as few loggers as your application needs.  Loggers should be
configured using :php:class:`Cake\\Log\\Log`. An example would be::

    use Cake\Log\Engine\FileLog;
    use Cake\Log\Log;

    // Classname using logger 'class' constant
    Log::setConfig('info', [
        'className' => FileLog::class,
        'path' => LOGS,
        'levels' => ['info'],
        'file' => 'info',
    ]);

    // Short classname
    Log::setConfig('debug', [
        'className' => 'File',
        'path' => LOGS,
        'levels' => ['notice', 'debug'],
        'file' => 'debug',
    ]);

    // Fully namespaced name.
    Log::setConfig('error', [
        'className' => 'Cake\Log\Engine\FileLog',
        'path' => LOGS,
        'levels' => ['warning', 'error', 'critical', 'alert', 'emergency'],
        'file' => 'error',
    ]);

The above creates three loggers, named ``info``, ``debug`` and ``error``.
Each is configured to handle different levels of messages. They also store their
log messages in separate files, so we can separate debug/notice/info logs
from more serious errors. See the section on :ref:`logging-levels` for more
information on the different levels and what they mean.

Once a configuration is created you cannot change it. Instead you should drop
the configuration and re-create it using :php:meth:`Cake\\Log\\Log::drop()` and
:php:meth:`Cake\\Log\\Log::setConfig()`.

It is also possible to create loggers by providing a closure. This is useful
when you need full control over how the logger object is built. The closure
has to return the constructed logger instance. For example::

    Log::setConfig('special', function () {
        return new \Cake\Log\Engine\FileLog(['path' => LOGS, 'file' => 'log']);
    });

Configuration options can also be provided as a :term:`DSN` string. This is
useful when working with environment variables or :term:`PaaS` providers::

    Log::setConfig('error', [
        'url' => 'file:///full/path/to/logs/?levels[]=warning&levels[]=error&file=error',
    ]);

.. warning::
    If you do not configure logging engines, log messages will not be stored.

Error and Exception Logging
===========================

Errors and Exceptions can also be logged. By configuring the corresponding
values in your **config/app.php** file.  Errors will be displayed when debug is
``true`` and logged when debug is ``false``. To log uncaught exceptions, set the
``log`` option to ``true``. See :doc:`/development/configuration` for more
information.

.. _writing-to-logs:

Writing to Logs
===============

Writing to the log files can be done in two different ways. The first
is to use the static :php:meth:`Cake\\Log\\Log::write()` method::

    Log::write('debug', 'Something did not work');

The second is to use the ``log()`` shortcut function available on any
class using the ``LogTrait``. Calling ``log()`` will internally call
``Log::write()``::

    // Executing this inside a class using LogTrait
    $this->log('Something did not work!', 'debug');

All configured log streams are written to sequentially each time
:php:meth:`Cake\\Log\\Log::write()` is called. If you have not configured any
logging engines ``log()`` will return ``false`` and no log messages will be
written.

Using Placeholders in Messages
------------------------------

If you need to log dynamically defined data, you can use placeholders in your
log messages and provide an array of key/value pairs in the ``$context``
parameter::

    // Will log `Could not process for userid=1`
    Log::write('error', 'Could not process for userid={user}', ['user' => $user->id]);

Placeholders that do not have keys defined will not be replaced. If you need to
use a literal braced word, you must escape the placeholder::

    // Will log `No {replace}`
    Log::write('error', 'No \\{replace}', ['replace' => 'no']);

If you include objects in your logging placeholders those objects must implement
one of the following methods:

* ``__toString()``
* ``toArray()``
* ``__debugInfo()``

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
subsystems or parts of your application. Take for example an e-commerce shop.
You'll probably want to handle logging for orders and payments differently than
you do other less critical logs.

CakePHP exposes this concept as logging scopes. When log messages are written
you can include a scope name. If there is a configured logger for that scope,
the log messages will be directed to those loggers. For example::

    use Cake\Log\Engine\FileLog;

    // Configure logs/shops.log to receive all levels, but only
    // those with `orders` and `payments` scope.
    Log::setConfig('shops', [
        'className' => FileLog::class,
        'path' => LOGS,
        'levels' => [],
        'scopes' => ['orders', 'payments'],
        'file' => 'shops.log',
    ]);

    // Configure logs/payments.log to receive all levels, but only
    // those with `payments` scope.
    Log::setConfig('payments', [
        'className' => FileLog::class,
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

.. _file-log:

Logging to Files
================

As its name implies ``FileLog`` writes log messages to files. The level of log
message being written determines the name of the file the message is stored in.
If a level is not supplied, :php:const:`LOG_ERR` is used which writes to the
error log. The default log location is **logs/$level.log**::

    // Executing this inside a CakePHP class
    $this->log("Something didn't work!");

    // Results in this being appended to logs/error.log
    // 2007-11-02 10:22:02 Error: Something didn't work!

The configured directory must be writable by the web server user in
order for logging to work correctly.

You can configure additional/alternate FileLog locations when configuring
a logger. FileLog accepts a ``path`` which allows for
custom paths to be used::

    Log::setConfig('custom_path', [
        'className' => 'File',
        'path' => '/path/to/custom/place/'
    ]);

``FileLog`` engine takes the following options:

* ``size`` Used to implement basic log file rotation. If log file size
  reaches specified size the existing file is renamed by appending timestamp
  to filename and new log file is created. Can be integer bytes value or
  human readable string values like '10MB', '100KB' etc. Defaults to 10MB.
* ``rotate`` Log files are rotated specified times before being removed.
  If value is 0, old versions are removed rather then rotated. Defaults to 10.
* ``mask`` Set the file permissions for created files. If left empty the default
  permissions are used.

.. note::

    Missing directories will be automatically created to avoid
    unnecessary errors thrown when using the FileEngine.

.. _syslog-log:

Logging to Syslog
=================

In production environments it is highly recommended that you setup your system to
use syslog instead of the file logger. This will perform much better as any
writes will be done in a (almost) non-blocking fashion and your operating  system
logger can be configured separately to rotate files, pre-process writes or use
a completely different storage for your logs.

Using syslog is pretty much like using the default FileLog engine, you just need
to specify ``Syslog`` as the engine to be used for logging. The following
configuration snippet will replace the default logger with syslog, this should
be done in the **config/bootstrap.php** file::

    Log::setConfig('default', [
        'engine' => 'Syslog'
    ]);

The configuration array accepted for the Syslog logging engine understands the
following keys:

* ``format``: An sprintf template string with two placeholders, the first one
  for the error level, and the second for the message itself. This key is
  useful to add additional information about the server or process in the
  logged message. For example: ``%s - Web Server 1 - %s`` will look like
  ``error - Web Server 1 - An error occurred in this request`` after
  replacing the placeholders. This option is deprecated. You should use
  :ref:`logging-formatters` instead.
* ``prefix``: An string that will be prefixed to every logged message.
* ``flag``: An integer flag to be used for opening the connection to the
  logger, by default ``LOG_ODELAY`` will be used. See ``openlog`` documentation
  for more options
* ``facility``: The logging slot to use in syslog. By default ``LOG_USER`` is
  used. See ``syslog`` documentation for more options

Creating Log Engines
====================

Log engines can be part of your application, or part of
plugins. If for example you had a database logger called
``DatabaseLog``. As part of your application it would be placed in
**src/Log/Engine/DatabaseLog.php**. As part of a plugin it would be placed in
**plugins/LoggingPack/src/Log/Engine/DatabaseLog.php**. To configure log
engine you should use :php:meth:`Cake\\Log\\Log::setConfig()`.  For example
configuring our DatabaseLog would look like::

    // For src/Log
    Log::setConfig('otherFile', [
        'className' => 'Database',
        'model' => 'LogEntry',
        // ...
    ]);

    // For plugin called LoggingPack
    Log::setConfig('otherFile', [
        'className' => 'LoggingPack.Database',
        'model' => 'LogEntry',
        // ...
    ]);

When configuring a log engine the ``className`` parameter is used to
locate and load the log handler. All of the other configuration
properties are passed to the log engine's constructor as an array. ::

    namespace App\Log\Engine;
    use Cake\Log\Engine\BaseLog;

    class DatabaseLog extends BaseLog
    {
        public function __construct(array $config = [])
        {
            parent::__construct($config);
            // ...
        }

        public function log($level, string $message, array $context = [])
        {
            // Write to the database.
        }
    }

CakePHP requires that all logging engine implement ``Psr\Log\LoggerInterface``.
The class :php:class:`Cake\Log\Engine\BaseLog` is an easy way to satisfy the
interface as it only requires you to implement the ``log()`` method.

.. _logging-formatters:

Logging Formatters
==================

Logging formatters allow you to control how log messages are formatted
independent of the storage engine. Each core provided logging engine comes with
a formatter configured to maintain backwards compatible output. However, you can
adjust the formatters to fit your requirements. Formatters are configured
alongside the logging engine::

    use Cake\Log\Engine\SyslogLog;
    use App\Log\Formatter\CustomFormatter;

    // Simple formatting configuration with no options.
    Log::setConfig('error', [
        'className' => SyslogLog::class,
        'formatter' => CustomFormatter::class,
    ]);

    // Configure a formatter with additional options.
    Log::setConfig('error', [
        'className' => SyslogLog::class,
        'formatter' => [
            'className' => CustomFormatter::class,
            'key' => 'value',
        ],
    ]);

To implement your own logging formatter you need to extend
``Cake\Log\Format\AbstractFormatter`` or one of its subclasses. The primary
method you need to implement is ``format($level, $message, $context)`` which is
responsible for formatting log messages.

.. _log-testing:

Testing Logs
============

To test logging, add ``Cake\TestSuite\LogTestTrait`` to your test case. The
``LogTestTrait`` uses PHPUnit hooks to attach log engines that intercept the log
messages your application is making. Once you have captured logs you can perform
assertions on log messages your application is emitting. For example::

    namespace App\Test\TestCase\Controller;

    use Cake\TestSuite\LogTestTrait;
    use Cake\TestSuite\TestCase;

    class UsersControllerTest extends TestCase
    {
        use LogTestTrait;

        public function setUp(): void
        {
            parent::setUp();
            $this->setupLog([
                'error' => ['scopes' => ['app.security']]
            ]);
        }

        public function testResetPassword()
        {
            $this->post('/users/resetpassword', ['email' => 'bob@example.com']);
            $this->assertLogMessageContains('info', 'bob@example.com reset password', 'app.security');
        }
    }

You use ``setupLog()`` to define the log messages you wish to capture and
perform assertions on. After logs have been emitted you can make assertions on
the contents of logs, or the absence of them:

* ``assertLogMessage(string $level, string $expectedMessage, ?string $scope
  = null, string $failMsg = '')`` Assert that a log message was found.
* ``assertLogMessageContains(string $level, string $expectedMessage, ?string
  $scope = null, string $failMsg = '')`` Assert that a log message contains the
  substring.
* ``assertLogAbsent(string $level, ?string $failMsg = '')`` Assert that no log
  messages of the given level were captured.

The ``LogTestTrait`` will automatically clean up any loggers that were
configured.

Log API
=======

.. php:namespace:: Cake\Log

.. php:class:: Log

    A simple class for writing to logs.

.. php:staticmethod:: setConfig($key, $config)

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
.. php:staticmethod:: info($message, $scope = [])
.. php:staticmethod:: debug($message, $scope = [])

Logging Trait
=============

.. php:trait:: LogTrait

    A trait that provides shortcut methods for logging

.. php:method:: log($msg, $level = LOG_ERR)

    Log a message to the logs.  By default messages are logged as
    ERROR messages.

Using Monolog
=============

Monolog is a popular logger for PHP. Since it implements the same interfaces as
the CakePHP loggers, you can use them in your application as the default
logger.

After installing Monolog using composer, configure the logger using the
``Log::setConfig()`` method::

    // config/bootstrap.php

    use Monolog\Logger;
    use Monolog\Handler\StreamHandler;

    Log::setConfig('default', function () {
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

    Log::setConfig('default', function () {
        $log = new Logger('cli');
        $log->pushHandler(new StreamHandler('path/to/your/combined-cli.log'));

        return $log;
    });

    // Optionally stop using the now redundant default CLI loggers
    Configure::delete('Log.debug');
    Configure::delete('Log.error');

.. note::

    When using a console specific logger, make sure to conditionally configure
    your application logger. This will prevent duplicate log entries.

.. meta::
    :title lang=en: Logging
    :description lang=en: Log CakePHP data to the disk to help debug your application over longer periods of time.
    :keywords lang=en: cakephp logging,log errors,debug,logging data,cakelog class,ajax logging,soap logging,debugging,logs
