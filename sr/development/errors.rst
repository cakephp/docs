Error Handling
##############

For 2.0 ``Object::cakeError()`` has been removed. Instead it has been replaced with
a number of exceptions. All of the core classes that previously called cakeError
are now throwing exceptions. This lets you either choose to handle the errors
in your application code, or let the built-in exception handling deal with them.

There is more control than ever for error and exception handling in CakePHP 2.0.
You can configure which methods you want to set as the default error handler,
and exception handler using configure.

Error configuration
===================

Error configuration is done inside your application's ``app/Config/core.php``
file. You can define a callback to be fired each time your application triggers
any PHP error - exceptions are handled :doc:`/development/exceptions` separately.
The callback can be any PHP callable, including an anonymous function. The
default error handling configuration looks like::

    Configure::write('Error', array(
        'handler' => 'ErrorHandler::handleError',
        'level' => E_ALL & ~E_DEPRECATED,
        'trace' => true
    ));

You have 5 built-in options when configuring error handlers:

* ``handler`` - callback - The callback to handle errors. You can set this to any
  callable type, including anonymous functions.
* ``level`` - int - The level of errors you are interested in capturing. Use the
  built-in php error constants, and bitmasks to select the level of error you
  are interested in.
* ``trace`` - boolean - Include stack traces for errors in log files. Stack traces
  will be included in the log after each error. This is helpful for finding
  where/when errors are being raised.
* ``consoleHandler`` - callback - The callback used to handle errors when
  running in the console. If undefined, CakePHP's default handlers will be
  used.

ErrorHandler by default, displays errors when ``debug`` > 0, and logs errors when
debug = 0. The type of errors captured in both cases is controlled by ``Error.level``.
The fatal error handler will be called independent of ``debug`` level or ``Error.level``
configuration, but the result will be different based on ``debug`` level.

.. note::

    If you use a custom error handler, the trace setting will have no effect,
    unless you refer to it in your error handling function.

.. versionadded:: 2.2
    The ``Error.consoleHandler`` option was added in 2.2.

.. versionchanged:: 2.2
    The ``Error.handler`` and ``Error.consoleHandler`` will receive the fatal error
    codes as well. The default behavior is show a page to internal server error
    (``debug`` disabled) or a page with the message, file and line (``debug`` enabled).

Creating your own error handler
===============================

You can create an error handler out of any callback type. For example you could
use a class called ``AppError`` to handle your errors. The following would
need to be done::

    //in app/Config/core.php
    Configure::write('Error.handler', 'AppError::handleError');

    //in app/Config/bootstrap.php
    App::uses('AppError', 'Lib');

    //in app/Lib/AppError.php
    class AppError {
        public static function handleError($code, $description, $file = null,
            $line = null, $context = null) {
            echo 'There has been an error!';
        }
    }

This class/method will print out 'There has been an error!' each time an error
occurs. Since you can define an error handler as any callback type, you could
use an anonymous function if you are using PHP5.3 or greater.::

    Configure::write('Error.handler', function($code, $description, $file = null,
        $line = null, $context = null) {
        echo 'Oh no something bad happened';
    });

It is important to remember that errors captured by the configured error handler will be php
errors, and that if you need custom error handling, you probably also want to configure
:doc:`/development/exceptions` handling as well.


Changing fatal error behavior
=============================

Since CakePHP 2.2 the ``Error.handler`` will receive the fatal error codes as well.
If you do not want to show the cake error page, you can override it like::

    //in app/Config/core.php
    Configure::write('Error.handler', 'AppError::handleError');

    //in app/Config/bootstrap.php
    App::uses('AppError', 'Lib');

    //in app/Lib/AppError.php
    class AppError {
        public static function handleError($code, $description, $file = null,
            $line = null, $context = null) {
            list(, $level) = ErrorHandler::mapErrorCode($code);
            if ($level === LOG_ERROR) {
                // Ignore fatal error. It will keep the PHP error message only
                return false;
            }
            return ErrorHandler::handleError(
                $code,
                $description,
                $file,
                $line,
                $context
            );
        }
    }

If you want to keep the default fatal error behavior, you can call ``ErrorHandler::handleFatalError()``
from your custom handler.

.. meta::
    :title lang=en: Error Handling
    :keywords lang=en: stack traces,error constants,error array,default displays,anonymous functions,error handlers,default error,error level,exception handler,php error,error handler,write error,core classes,exception handling,configuration error,application code,callback,custom error,exceptions,bitmasks,fatal error
