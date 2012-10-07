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
The ``App/Config/logging.php`` file is intended for just this.  You can define
as many or as few loggers as your application needs.  Loggers should be
configured using :php:class:`Cake\\Core\\Configure`. An example would be::

    <?php
    Configure::write('Log.debug', [
        'engine' => 'Cake\Log\Engine\FileLog',
        'levels' => ['notice', 'info', 'debug'],
        'file' => 'debug',
    ]);

    Configure::write('Log.error', [
        'engine' => 'Cake\Log\Engine\FileLog',
        'levels' => ['warning', 'error', 'critical', 'alert', 'emergency'],
        'file' => 'error',
    ]);

The above creates two loggers.  One named ``debug`` the other named ``error``.
Each is configured to handle different levels of messages. They also store their
log messages in separate files, so its easy to separate debug/notice/info logs
from more serious errors. See the section on :ref:`logging-levels` for more
information on the different levels and what they mean.

Creating log adapters
---------------------

Log adapters can be part of your application, or part of
plugins. If for example you had a database logger called
``DatabaseLogger``. As part of your application it would be placed
in ``App/Log/Engine/DatabaseLogger.php``. As part of a plugin it
would be placed in
``App/Plugin/LoggingPack/Log/Engine/DatabaseLogger.php``. To configure log
adapters you should use Configure.  For example configuring our DatabaseLogger
would look like::

    <?php
    // for App/Log
    Configure::write('Log.otherFile', [
        'engine' => 'DatabaseLogger',
        'model' => 'LogEntry',
        // ...
    ]);
    
    // for plugin called LoggingPack
    Configure::write('Log.otherFile', [
        'engine' => 'LoggingPack.DatabaseLogger',
        'model' => 'LogEntry',
        // ...
    ]);

When configuring a log adapter the ``engine`` parameter is used to
locate and load the log handler. All of the other configuration
properties are passed to the log adapter's constructor as an array.::

    <?php
    use Cake\Log\LogInterface;

    class DatabaseLogger implements LogInterface {
        public function __construct($options = []) {
            // ...
        }

        public function write($type, $message) {
            // write to the database.
        }
    }

CakePHP requires that all logging adapters implement
:php:class:`Cake\\Log\\LogInterface`.

.. note::

    You should configure loggers during bootstrapping. ``app/Config/log.php`` is the
    conventional place to configure log adapters.


Error and Exception logging
===========================

Errors and Exceptions can also be logged.  By configuring the 
co-responding values in your core.php file.  Errors will be 
displayed when debug > 0 and logged when debug == 0. Set ``Exception.log``
to true to log uncaught exceptions. See :doc:`/development/configuration`
for more information.

Interacting with log streams
============================

You can introspect the configured streams with
:php:meth:`Cake\\Log\\Log::configured()`. The return of ``configured()`` is an
array of all the currently configured streams. You can remove
streams using :php:meth:`Cake\\Log\\Log::drop()`. Once a log stream has been
dropped it will no longer receive messages.


Using the FileLog adapter
=========================

As its name implies FileLog writes log messages to files. The type of log
message being written determines the name of the file the message is stored in.
If a type is not supplied, :php:const:`LOG_ERROR` is used which writes to the
error log. The default log location is ``app/tmp/logs/$level.log``::

    <?php
    // Executing this inside a CakePHP class
    $this->log("Something didn't work!");
    
    // Results in this being appended to app/tmp/logs/error.log
    // 2007-11-02 10:22:02 Error: Something didn't work!

The configured directory must be writable by the web server user in
order for logging to work correctly.

You can configure additional/alternate FileLog locations when configuring
a logger.FileLog accepts a ``path`` which allows for
custom paths to be used::

    <?php
    Configure::write('Log.custom_path', [
        'engine' => 'FileLog',
        'path' => '/path/to/custom/place/'
    ]);

.. warning::
    If you do not configure a logging adapter, log messages will not be stored.

.. _writing-to-logs:

Writing to logs
===============

Writing to the log files can be done in 2 different ways. The first
is to use the static :php:meth:`Cake\\Log\\Log::write()` method::

    <?php
    Log::write('debug', 'Something did not work');

The second is to use the log() shortcut function available on any
class that extends ``Object``. Calling log() will internally call
``Log::write()``::

    <?php
    // Executing this inside a CakePHP class:
    $this->log("Something did not work!", 'debug');

All configured log streams are written to sequentially each time
:php:meth:`Cake\\Log\\Log::write()` is called. If you have not configured any
logging adapters ``log()`` will return false and no log messages will be
written.

.. _logging-levels:

Using levels
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
log messages.  Alternatively, you can use convenience methods like
:php:meth:`Cake\\Log\\Log::error()` to clearly and easily indicate the logging
level.

.. _logging-scopes:

Logging Scopes
--------------

Often times you'll want to configure different logging behavior for different
subsystems or parts of your application.  Take for example an e-commerce shop.
You'll probably want to handle logging for orders and payments differently than
you do other less critical logs.

CakePHP exposes this concept as logging scopes.  When log messages are written
you can include a scope name.  If there is a configured logger for that scope,
the log messages will be directed to those loggers.  If a log message is written
to an unknown scope, loggers that handle that level of message will log the
message. For example::

    <?php
    // configure tmp/logs/shops.log to receive all levels, but only
    // those with `orders` and `payments` scope
    Configure::write('Log.shops', [
        'engine' => 'FileLog',
        'levels' => [],
        'scopes' => ['orders', 'payments'],
        'file' => 'shops.log',
    ]);

    // configure tmp/logs/payments.log to receive all levels, but only
    // those with `payments` scope
    Configure::write('Log.shops', [
        'engine' => 'FileLog',
        'levels' => [],
        'scopes' => ['payments'],
        'file' => 'payments.log',
    ]);

    Log::warning('this gets written only to shops.log', 'orders');
    Log::warning('this gets written to both shops.log and payments.log', 'payments');
    Log::warning('this gets written to both shops.log and payments.log', 'unknown');

Log API
===========

.. php:namespace:: Cake\Log

.. php:class:: Log

    A simple class for writing to logs.

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

.. php:staticmethod:: levels()

Call this method without arguments, eg: `Log::levels()` to obtain current
level configuration.

.. php:staticmethod:: enabled($streamName)

    Checks wether $streamName is enable

    :returns: boolean

.. php:staticmethod:: enable($streamName)

    Enable stream $streamName

.. php:staticmethod:: disable($streamName)

    Disable stream $streamName

.. php:staticmethod:: engine($name, $engine = null)

    Fetch a connected logger by configuration name, or insert/replace
    a logger. Analogous to :php:meth:`Cake\\Cache\\Cache::engine()`.

    .. versionadded: 3.0

Convenience methods
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

Log adapter interface
=====================

.. php:interface:: LogInterface

    This interface is required for logging adapters.

.. php:method:: write($type, $message)

    Write a message to the log storage system. ``$type`` will be the level of
    the log message.  ``$message`` will be the content of the log message.

.. meta::
    :title lang=en: Logging
    :description lang=en: Log CakePHP data to the disk to help debug your application over longer periods of time.
    :keywords lang=en: cakephp logging,log errors,debug,logging data,cakelog class,ajax logging,soap logging,debugging,logs
