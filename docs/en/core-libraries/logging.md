# Logging

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
`LogTrait`, which is the common ancestor for many CakePHP classes. If
the context is a CakePHP class (Controller, Component, View,...),
you can log your data. You can also use `Log::write()` directly.
See [Writing To Logs](#writing-to-logs).

<a id="log-configuration"></a>

## Logging Configuration

Configuring `Log` should be done during your application's bootstrap phase.
The **config/app.php** file is intended for just this. You can define
as many or as few loggers as your application needs. Loggers should be
configured using `Cake\Log\Log`. An example would be:

``` php
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
```

The above creates two loggers. One named `debug` the other named `error`.
Each is configured to handle different levels of messages. They also store their
log messages in separate files, so it's easy to separate debug/notice/info logs
from more serious errors. See the section on [Logging Levels](#logging-levels) for more
information on the different levels and what they mean.

Once a configuration is created you cannot change it. Instead you should drop
the configuration and re-create it using `Cake\Log\Log::drop()` and
`Cake\Log\Log::config()`.

It is also possible to create loggers by providing a closure. This is useful
when you need full control over how the logger object is built. The closure
has to return the constructed logger instance. For example:

``` php
Log::config('special', function () {
    return new \Cake\Log\Engine\FileLog(['path' => LOGS, 'file' => 'log']);
});
```

Configuration options can also be provided as a `DSN` string. This is
useful when working with environment variables or `PaaS` providers:

``` php
Log::config('error', [
    'url' => 'file:///?levels[]=warning&levels[]=error&file=error',
]);
```

> [!NOTE]
> Loggers are required to implement the `Psr\Log\LoggerInterface` interface.

### Creating Log Adapters

Log adapters can be part of your application, or part of
plugins. If for example you had a database logger called
`DatabaseLog`. As part of your application it would be placed in
**src/Log/Engine/DatabaseLog.php**. As part of a plugin it would be placed in
**plugins/LoggingPack/src/Log/Engine/DatabaseLog.php**. To configure log
adapters you should use `Cake\Log\Log::config()`. For example
configuring our DatabaseLog would look like:

``` php
// For src/Log
Log::config('otherFile', [
    'className' => 'Database',
    'model' => 'LogEntry',
    // ...
]);

// For plugin called LoggingPack
Log::config('otherFile', [
    'className' => 'LoggingPack.Database',
    'model' => 'LogEntry',
    // ...
]);
```

When configuring a log adapter the `className` parameter is used to
locate and load the log handler. All of the other configuration
properties are passed to the log adapter's constructor as an array. :

``` php
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
```

CakePHP requires that all logging adapters implement `Psr\Log\LoggerInterface`.
The class `Cake\Log\Engine\BaseLog` is an easy way to satisfy the
interface as it only requires you to implement the `log()` method.

<div id="file-log">

`FileLog` engine takes the following options:

</div>

- `size` Used to implement basic log file rotation. If log file size
  reaches specified size the existing file is renamed by appending timestamp
  to filename and new log file is created. Can be integer bytes value or
  human readable string values like '10MB', '100KB' etc. Defaults to 10MB.
- `rotate` Log files are rotated specified times before being removed.
  If value is 0, old versions are removed rather then rotated. Defaults to 10.
- `mask` Set the file permissions for created files. If left empty the default
  permissions are used.

> [!WARNING]
> Engines have the suffix `Log`. You should avoid class names like `SomeLogLog`
> which include the suffix twice at the end.

> [!NOTE]
> You should configure loggers during bootstrapping. **config/app.php** is the
> conventional place to configure log adapters.
>
> In debug mode missing directories will be automatically created to avoid unnecessary
> errors thrown when using the FileEngine.

## Error and Exception Logging

Errors and Exceptions can also be logged. By configuring the corresponding
values in your app.php file. Errors will be displayed when debug is `true`
and logged when debug is `false`. To log uncaught exceptions, set the `log`
option to `true`. See [Configuration](../development/configuration) for more information.

## Interacting with Log Streams

You can introspect the configured streams with
`Cake\Log\Log::configured()`. The return of `configured()` is an
array of all the currently configured streams. You can remove
streams using `Cake\Log\Log::drop()`. Once a log stream has been
dropped it will no longer receive messages.

## Using the FileLog Adapter

As its name implies FileLog writes log messages to files. The level of log
message being written determines the name of the file the message is stored in.
If a level is not supplied, `LOG_ERR` is used which writes to the
error log. The default log location is `logs/$level.log`:

``` php
// Executing this inside a CakePHP class
$this->log("Something didn't work!");

// Results in this being appended to logs/error.log
// 2007-11-02 10:22:02 Error: Something didn't work!
```

The configured directory must be writable by the web server user in
order for logging to work correctly.

You can configure additional/alternate FileLog locations when configuring
a logger. FileLog accepts a `path` which allows for
custom paths to be used:

``` php
Log::config('custom_path', [
    'className' => 'File',
    'path' => '/path/to/custom/place/'
]);
```

> [!WARNING]
> If you do not configure a logging adapter, log messages will not be stored.

<a id="syslog-log"></a>

## Logging to Syslog

In production environments it is highly recommended that you setup your system to
use syslog instead of the files logger. This will perform much better as any
writes will be done in a (almost) non-blocking fashion and your operating system
logger can be configured separately to rotate files, pre-process writes or use
a completely different storage for your logs.

Using syslog is pretty much like using the default FileLog engine, you just need
to specify `Syslog` as the engine to be used for logging. The following
configuration snippet will replace the default logger with syslog, this should
be done in the **bootstrap.php** file:

``` php
Log::config('default', [
    'engine' => 'Syslog'
]);
```

The configuration array accepted for the Syslog logging engine understands the
following keys:

- `format`: An sprintf template string with two placeholders, the first one
  for the error level, and the second for the message itself. This key is
  useful to add additional information about the server or process in the
  logged message. For example: `%s - Web Server 1 - %s` will look like
  `error - Web Server 1 - An error occurred in this request` after
  replacing the placeholders.
- `prefix`: An string that will be prefixed to every logged message.
- `flag`: An integer flag to be used for opening the connection to the
  logger, by default `LOG_ODELAY` will be used. See `openlog` documentation
  for more options
- `facility`: The logging slot to use in syslog. By default `LOG_USER` is
  used. See `syslog` documentation for more options

<a id="writing-to-logs"></a>

## Writing to Logs

Writing to the log files can be done in 2 different ways. The first
is to use the static `Cake\Log\Log::write()` method:

``` php
Log::write('debug', 'Something did not work');
```

The second is to use the `log()` shortcut function available on any
class using the `LogTrait`. Calling log() will internally call
`Log::write()`:

``` php
// Executing this inside a class using LogTrait
$this->log("Something did not work!", 'debug');
```

All configured log streams are written to sequentially each time
`Cake\Log\Log::write()` is called. If you have not configured any
logging adapters `log()` will return `false` and no log messages will be
written.

<a id="logging-levels"></a>

### Using Levels

CakePHP supports the standard POSIX set of logging levels. Each level represents
an increasing level of severity:

- Emergency: system is unusable
- Alert: action must be taken immediately
- Critical: critical conditions
- Error: error conditions
- Warning: warning conditions
- Notice: normal but significant condition
- Info: informational messages
- Debug: debug-level messages

You can refer to these levels by name when configuring loggers, and when writing
log messages. Alternatively, you can use convenience methods like
`Cake\Log\Log::error()` to clearly indicate the logging
level. Using a level that is not in the above levels will result in an
exception.

> [!NOTE]
> When `levels` is set to an empty value in a logger's configuration, it
> will take messages of any level.

<a id="logging-scopes"></a>

### Logging Scopes

Often times you'll want to configure different logging behavior for different
subsystems or parts of your application. Take for example an e-commerce shop.
You'll probably want to handle logging for orders and payments differently than
you do other less critical logs.

CakePHP exposes this concept as logging scopes. When log messages are written
you can include a scope name. If there is a configured logger for that scope,
the log messages will be directed to those loggers. For example:

``` php
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
```

Scopes can also be passed as a single string or a numerically indexed array.
Note that using this form will limit the ability to pass more data as context:

``` php
Log::warning('This is a warning', ['orders']);
Log::warning('This is a warning', 'payments');
```

> [!NOTE]
> When `scopes` is set to an empty array or `null` in a logger's
> configuration, it will take messages of any scope. Setting it to `false`
> will only match messages without scope.

## Log API

`class` Cake\\Log\\**Log**

`static` Cake\\Log\\Log::**config**($key, $config)

param string \$name  
Name for the logger being connected, used
to drop a logger later on.

param array \$config  
Array of configuration information and
constructor arguments for the logger.

Get or set the configuration for a Logger. See [Log Configuration](#log-configuration) for
more information.

`static` Cake\\Log\\Log::**configured**()

returns  
An array of configured loggers.

Get the names of the configured loggers.

`static` Cake\\Log\\Log::**drop**($name)

param string \$name  
Name of the logger you wish to no longer receive
messages.

`static` Cake\\Log\\Log::**write**($level, $message, $scope = [])

Write a message into all the configured loggers.
`$level` indicates the level of log message being created.
`$message` is the message of the log entry being written to.
`$scope` is the scope(s) a log message is being created in.

`static` Cake\\Log\\Log::**levels**()

Call this method without arguments, eg: <span class="title-ref">Log::levels()</span> to obtain current
level configuration.

### Convenience Methods

The following convenience methods were added to log <span class="title-ref">\$message</span> with the
appropriate log level.

`static` Cake\\Log\\Log::**emergency**($message, $scope = [])

`static` Cake\\Log\\Log::**alert**($message, $scope = [])

`static` Cake\\Log\\Log::**critical**($message, $scope = [])

`static` Cake\\Log\\Log::**error**($message, $scope = [])

`static` Cake\\Log\\Log::**warning**($message, $scope = [])

`static` Cake\\Log\\Log::**notice**($message, $scope = [])

`static` Cake\\Log\\Log::**info**($message, $scope = [])

`static` Cake\\Log\\Log::**debug**($message, $scope = [])

## Logging Trait

> A trait that provides shortcut methods for logging

`method` Cake\\Log\\Log::**log**($msg, $level = LOG_ERR)

## Using Monolog

Monolog is a popular logger for PHP. Since it implements the same interfaces as
the CakePHP loggers, it is easy to use in your application as the default
logger.

After installing Monolog using composer, configure the logger using the
`Log::setConfig()` method:

``` php
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
```

Use similar methods if you want to configure a different logger for your console:

``` php
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
```

> [!NOTE]
> When using a console specific logger, make sure to conditionally configure
> your application logger. This will prevent duplicate log entries.
