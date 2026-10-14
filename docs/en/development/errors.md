# Error Handling

CakePHP uses exceptions to signal errors from its core classes. This lets you
either handle the errors in your application code, or let the built-in exception
handling deal with them. PHP errors (warnings, notices, deprecations and fatal
errors) are handled separately by an error handler.

You can configure which methods are used as the default error handler and
exception handler using `Configure`.

## Error configuration

Error configuration is done inside your application's `config/core.php`
file (`app/Config/core.php` in the legacy layout, see
[CakePHP Folder Structure](/getting-started/cakephp-folder-structure)). You can define a
callback to be fired each time your application triggers any PHP error.
[Exceptions](../development/exceptions) are handled separately.
The callback can be any PHP callable, including an anonymous function. The
default error handling configuration looks like:

``` php
// config/core.php
Configure::write('Error', [
    'handler' => 'ErrorHandler::handleError',
    'level' => E_ALL & ~E_DEPRECATED,
    'trace' => true,
]);
```

You have 5 built-in options when configuring error handlers:

- `handler` - callback - The callback to handle errors. You can set this to any
  callable type, including anonymous functions.
- `level` - int - The level of errors you are interested in capturing. Use the
  built-in PHP error constants, and bitmasks to select the level of error you
  are interested in. This value is also passed to `error_reporting()`.
- `trace` - boolean - Include stack traces for errors in log files. Stack traces
  will be included in the log after each error. This is helpful for finding
  where/when errors are being raised.
- `consoleHandler` - callback - The callback used to handle errors when
  running in the console. If undefined, CakePHP's default handlers will be
  used.
- `extraFatalErrorMemory` - int - The number of megabytes the memory limit is
  increased by at shutdown, so that fatal errors such as "Allowed memory size
  exhausted" can still be logged. Defaults to 4. Use 0 to disable it.

ErrorHandler by default, displays errors when `debug` \> 0, and logs errors when
debug = 0. The type of errors captured in both cases is controlled by `Error.level`.
Errors are logged with `CakeLog`; with the default log configuration in
`config/bootstrap.php`, warnings and errors go to `logs/error.log` and notices
and deprecations to `logs/debug.log`.
The fatal error handler will be called independent of `debug` level or `Error.level`
configuration, but the result will be different based on `debug` level.

The default handler ignores any error whose level is not included in the
current `error_reporting()` value. This means errors suppressed with the `@`
operator are neither displayed nor logged.

::: pieceofcake2
Because PHP 8 no longer sets
`error_reporting()` to 0 for errors suppressed with `@`, `ErrorHandler::handleError()`
now checks `error_reporting() & $code` instead. Use the same check in your own
error handlers.
:::

> [!NOTE]
> If you use a custom error handler, the trace setting will have no effect,
> unless you refer to it in your error handling function.

::: info Added in version 2.2
The `Error.consoleHandler` option was added in 2.2.
:::

::: info Changed in version 2.2
The `Error.handler` and `Error.consoleHandler` will receive the fatal error codes as well. The default behavior is show a page to internal server error (`debug` disabled) or a page with the message, file and line (`debug` enabled).
:::

### Errors thrown as `Error` objects

Since PHP 7, most errors that used to be fatal, such as calling an undefined
method or passing an argument of the wrong type, are thrown as `Error` objects
(for example `TypeError` or `ArgumentCountError`) instead of being raised as
PHP errors. PHP 8 converts even more warnings into thrown errors. These are not
passed to `Error.handler`. If they are not caught, they reach the configured
`Exception.handler` and are rendered as an internal server error, like any
other uncaught exception. See [Exceptions](../development/exceptions).

## Creating your own error handler

You can create an error handler out of any callback type. For example you could
use a class called `AppError` to handle your errors. The following would
need to be done:

``` php
// config/core.php
Configure::write('Error.handler', 'AppError::handleError');

// config/bootstrap.php
App::uses('AppError', 'Lib');

// src/Lib/AppError.php
class AppError
{
    public static function handleError(
        $code,
        $description,
        $file = null,
        $line = null,
        $context = null,
    ) {
        if (!(error_reporting() & $code)) {
            // The error is suppressed with @ or excluded by Error.level
            return false;
        }
        echo 'There has been an error!';

        return true;
    }
}
```

This class/method will print out 'There has been an error!' each time an error
occurs. The error handlers are registered after `config/bootstrap.php` has been
loaded, so loading the class there with `App::uses()` is enough. If your
`composer.json` autoloads `src/` with a classmap, as in
[pieceofcake2/app](https://pieceofcake2.github.io/app/), the class is also
found by Composer after you run `composer dump-autoload`.

PHP 8 no longer passes the fifth `$context` argument to error handlers, so
keep it optional. Since you can define an error handler as any callback type,
you could also use an anonymous function:

``` php
Configure::write('Error.handler', function ($code, $description, $file = null, $line = null) {
    echo 'Oh no something bad happened';

    return true;
});
```

It is important to remember that errors captured by the configured error handler will be php
errors, and that if you need custom error handling, you probably also want to configure
[Exceptions](../development/exceptions) handling as well.

## Changing fatal error behavior

The `Error.handler` will receive the fatal error codes as well.
If you do not want to show the cake error page, you can override it like:

``` php
// config/core.php
Configure::write('Error.handler', 'AppError::handleError');

// config/bootstrap.php
App::uses('AppError', 'Lib');

// src/Lib/AppError.php
class AppError
{
    public static function handleError(
        $code,
        $description,
        $file = null,
        $line = null,
        $context = null,
    ) {
        [, $level] = ErrorHandler::mapErrorCode($code);
        if ($level === LOG_ERR) {
            // Ignore fatal error. It will keep the PHP error message only
            return false;
        }

        return ErrorHandler::handleError(
            $code,
            $description,
            $file,
            $line,
            $context,
        );
    }
}
```

If you want to keep the default fatal error behavior, you can call `ErrorHandler::handleFatalError()`
from your custom handler.
