Exceptions
##########

Exceptions can be used for a variety of uses in your application. CakePHP uses
exceptions internally to indicate logic errors or misuse. All of the exceptions
CakePHP raises extend :php:exc:`CakeException`, and there are class/task
specific exceptions that extend this base class.

CakePHP also provides a number of exception classes that you can use for HTTP
errors. See the section on :ref:`built-in-exceptions` for more information.

Exception configuration
=======================

There are a few keys available for configuring exceptions::

    Configure::write('Exception', array(
        'handler' => 'ErrorHandler::handleException',
        'renderer' => 'ExceptionRenderer',
        'log' => true
    ));

* ``handler`` - callback - The callback to handle exceptions. You can set this to
  any callback type, including anonymous functions.
* ``renderer`` - string - The class responsible for rendering uncaught exceptions.
  If you choose a custom class you should place the file for that class in app/Lib/Error.
  This class needs to implement a ``render()`` method.
* ``log`` - boolean - When true, exceptions + their stack traces will be logged
  to CakeLog.
* ``consoleHandler`` - callback - The callback used to handle exceptions, in a
  console context. If undefined, CakePHP's default handler will be used.

Exception rendering by default displays an HTML page, you can customize either the
handler or the renderer by changing the settings. Changing the handler, allows
you to take full control over the exception handling process, while changing
the renderer allows you to easily change the output type/contents, as well as
add in application specific exception handling.

.. versionadded:: 2.2
    The ``Exception.consoleHandler`` option was added in 2.2.

Exception classes
=================

There are a number of exception classes in CakePHP. Each exception replaces
a ``cakeError()`` error messages from the past. Exceptions offer additional
flexibility in that they can be extended and contain some logic. The built
in exception handling will capture any uncaught exceptions and render a useful
page. Exceptions that do not specifically use a 400 range code, will be
treated as an Internal Server Error.

.. _built-in-exceptions:

Built-in Exceptions for CakePHP
===============================

There are several built-in exceptions inside CakePHP, outside of the
internal framework exceptions, there are several
exceptions for HTTP methods

.. php:exception:: BadRequestException

    Used for doing 400 Bad Request error.

.. php:exception:: UnauthorizedException

    Used for doing a 401 Unauthorized error.

.. php:exception:: ForbiddenException

    Used for doing a 403 Forbidden error.

.. php:exception:: NotFoundException

    Used for doing a 404 Not found error.

.. php:exception:: MethodNotAllowedException

    Used for doing a 405 Method Not Allowed error.

.. php:exception:: InternalErrorException

    Used for doing a 500 Internal Server Error.

.. php:exception:: NotImplementedException

    Used for doing a 501 Not Implemented Errors.

You can throw these exceptions from your controllers to indicate failure states,
or HTTP errors. An example use of the HTTP exceptions could be rendering 404
pages for items that have not been found::

    public function view($id) {
        $post = $this->Post->findById($id);
        if (!$post) {
            throw new NotFoundException('Could not find that post');
        }
        $this->set('post', $post);
    }

By using exceptions for HTTP errors, you can keep your code both clean, and give
RESTful responses to client applications and users.

In addition, the following framework layer exceptions are available, and will
be thrown from a number of CakePHP core components:

.. php:exception:: CakeException

    Base exception class in CakePHP. All framework layer exceptions thrown by
    CakePHP will extend this class.

.. php:exception:: MissingViewException

    The chosen view file could not be found.

.. php:exception:: MissingLayoutException

    The chosen layout could not be found.

.. php:exception:: MissingHelperException

    A helper was not found.

.. php:exception:: MissingBehaviorException

    A configured behavior could not be found.

.. php:exception:: MissingComponentException

    A configured component could not be found.

.. php:exception:: MissingTaskException

    A configured task was not found.

.. php:exception:: MissingShellException

    The shell class could not be found.

.. php:exception:: MissingShellMethodException

    The chosen shell class has no method of that name.

.. php:exception:: MissingDatabaseException

    The configured database is missing.

.. php:exception:: MissingConnectionException

    A model's connection is missing.

.. php:exception:: MissingTableException

    A model's table is missing from CakePHP's cache or the datasource. Upon adding
    a new table to a datasource, the model cache (found in tmp/cache/models by default)
    must be removed.

.. php:exception:: MissingActionException

    The requested controller action could not be found.

.. php:exception:: MissingControllerException

    The requested controller could not be found.

.. php:exception:: PrivateActionException

    Private action access. Either accessing
    private/protected/_ prefixed actions, or trying
    to access prefixed routes incorrectly.

These exception classes all extend :php:exc:`CakeException`.
By extending CakeException, you can create your own 'framework' errors.
All of the standard Exceptions that CakePHP will throw also extend CakeException.

.. versionadded:: 2.3
    CakeBaseException was added

.. php:exception:: CakeBaseException

    Base exception class in CakePHP.
    All CakeExceptions and HttpExceptions above extend this class.

.. php:method:: responseHeader($header = null, $value = null)

    See :php:func:`CakeResponse::header()`

All Http and CakePHP exceptions extend the CakeBaseException class, which has a method
to add headers to the response. For instance when throwing a 405 MethodNotAllowedException
the rfc2616 says:
"The response MUST include an Allow header containing a list of valid methods for the requested resource."

Using HTTP exceptions in your controllers
=========================================

You can throw any of the HTTP related exceptions from your controller actions
to indicate failure states. For example::

    public function view($id) {
        $post = $this->Post->findById($id);
        if (!$post) {
            throw new NotFoundException();
        }
        $this->set(compact('post'));
    }

The above would cause the configured ``Exception.handler`` to catch and
process the :php:exc:`NotFoundException`. By default this will create an error page,
and log the exception.

.. _error-views:

Exception Renderer
==================

.. php:class:: ExceptionRenderer(Exception $exception)

The ExceptionRenderer class with the help of ``CakeErrorController`` takes care of rendering
the error pages for all the exceptions thrown by you application.

The error page views are located at ``app/View/Errors/``. For all 4xx and 5xx errors
the view files ``error400.ctp`` and ``error500.ctp`` are used respectively. You can
customize them as per your needs. By default your ``app/Layouts/default.ctp`` is used
for error pages too. If for eg. you want to use another layout ``app/Layouts/my_error.ctp``
for your error pages, then simply edit the error views and add the statement
``$this->layout = 'my_error';`` to the ``error400.ctp`` and ``error500.ctp``.

Each framework layer exception has its own view file located in the core templates but
you really don't need to bother customizing them as they are used only during development.
With debug turned off all framework layer exceptions are converted to ``InternalErrorException``.

.. index:: application exceptions

Creating your own application exceptions
========================================

You can create your own application exceptions using any of the built
in `SPL exceptions <https://secure.php.net/manual/en/spl.exceptions.php>`_, ``Exception``
itself, or :php:exc:`CakeException`. Application exceptions that extend
Exception or the SPL exceptions will be treated as 500 error in production mode.
:php:exc:`CakeException` is special in that all :php:exc:`CakeException` objects
are coerced into either 500 or 404 errors depending on the code they use.
When in development mode :php:exc:`CakeException` objects simply need a new template
that matches the class name in order to provide useful information. If your
application contained the following exception::

    class MissingWidgetException extends CakeException {};

You could provide nice development errors, by creating
``app/View/Errors/missing_widget.ctp``. When in production mode, the above
error would be treated as a 500 error. The constructor for :php:exc:`CakeException`
has been extended, allowing you to pass in hashes of data. These hashes are
interpolated into the the messageTemplate, as well as into the view that is used
to represent the error in development mode. This allows you to create data rich
exceptions, by providing more context for your errors. You can also provide a message
template which allows the native ``__toString()`` methods to work as normal::


    class MissingWidgetException extends CakeException {
        protected $_messageTemplate = 'Seems that %s is missing.';
    }

    throw new MissingWidgetException(array('widget' => 'Pointy'));


When caught by the built-in exception handler, you would get a ``$widget``
variable in your error view template. In addition if you cast the exception
as a string or use its ``getMessage()`` method you will get
``Seems that Pointy is missing.``. This allows you easily and quickly create
your own rich development errors, just like CakePHP uses internally.

Creating custom status codes
----------------------------

You can create custom HTTP status codes by changing the code used when
creating an exception::

    throw new MissingWidgetHelperException('Its not here', 501);

Will create a ``501`` response code, you can use any HTTP status code
you want. In development, if your exception doesn't have a specific
template, and you use a code equal to or greater than ``500`` you will
see the ``error500`` template. For any other error code you'll get the
``error400`` template. If you have defined an error template for your
custom exception, that template will be used in development mode.
If you'd like your own exception handling logic even in production,
see the next section.

Extending and implementing your own Exception handlers
======================================================

You can implement application specific exception handling in one of a
few ways. Each approach gives you different amounts of control over
the exception handling process.

- Set ``Configure::write('Exception.handler', 'YourClass::yourMethod');``
- Create ``AppController::appError();``
- Set ``Configure::write('Exception.renderer', 'YourClass');``

In the next few sections, we will detail the various approaches and the benefits each has.

Create your own Exception handler with `Exception.handler`
==========================================================

Creating your own exception handler gives you full control over the exception
handling process. The class you choose should be loaded in your
``app/Config/bootstrap.php``, so it's available to handle any exceptions. You can
define the handler as any callback type. By settings ``Exception.handler`` CakePHP
will ignore all other Exception settings. A sample custom exception handling setup
could look like::

    // in app/Config/core.php
    Configure::write('Exception.handler', 'AppExceptionHandler::handle');

    // in app/Config/bootstrap.php
    App::uses('AppExceptionHandler', 'Lib');

    // in app/Lib/AppExceptionHandler.php
    class AppExceptionHandler {
        public static function handle($error) {
            echo 'Oh noes! ' . $error->getMessage();
            // ...
        }
        // ...
    }

You can run any code you wish inside ``handleException``. The code above would
simple print 'Oh noes! ' plus the exception message. You can define exception
handlers as any type of callback, even an anonymous function if you are
using PHP 5.3::

    Configure::write('Exception.handler', function ($error) {
        echo 'Ruh roh ' . $error->getMessage();
    });

By creating a custom exception handler you can provide custom error handling for
application exceptions. In the method provided as the exception handler you
could do the following::

    // in app/Lib/AppErrorHandler.php
    class AppErrorHandler {
        public static function handleException($error) {
            if ($error instanceof MissingWidgetException) {
                return self::handleMissingWidget($error);
            }
            // do other stuff.
        }
    }

.. index:: appError

Using AppController::appError()
===============================

Implementing this method is an alternative to implementing a custom exception
handler. It's primarily provided for backwards compatibility, and is not
recommended for new applications. This controller method is called instead of
the default exception rendering. It receives the thrown exception as its only
argument. You should implement your error handling in that method::

    class AppController extends Controller {
        public function appError($error) {
            // custom logic goes here.
        }
    }

Using a custom renderer with Exception.renderer to handle application exceptions
================================================================================

If you don't want to take control of the exception handling, but want to change
how exceptions are rendered you can use ``Configure::write('Exception.renderer',
'AppExceptionRenderer');`` to choose a class that will render exception pages.
By default :php:class`ExceptionRenderer` is used. Your custom exception
renderer class should be placed in ``app/Lib/Error``. Or an ``Error``
directory in any bootstrapped Lib path. In a custom exception rendering class
you can provide specialized handling for application specific errors::

    // in app/Lib/Error/AppExceptionRenderer.php
    App::uses('ExceptionRenderer', 'Error');

    class AppExceptionRenderer extends ExceptionRenderer {
        public function missingWidget($error) {
            echo 'Oops that widget is missing!';
        }
    }


The above would handle any exceptions of the type ``MissingWidgetException``,
and allow you to provide custom display/handling logic for those application
exceptions. Exception handling methods get the exception being handled as
their argument.

.. note::

    Your custom renderer should expect an exception in its constructor, and
    implement a render method. Failing to do so will cause additional errors.

.. note::

    If you are using a custom ``Exception.handler`` this setting will have
    no effect. Unless you reference it inside your implementation.

Creating a custom controller to handle exceptions
-------------------------------------------------

In your ExceptionRenderer sub-class, you can use the ``_getController``
method to allow you to return a custom controller to handle your errors.
By default CakePHP uses ``CakeErrorController`` which omits a few of the normal
callbacks to help ensure errors always display. However, you may need a more
custom error handling controller in your application. By implementing
``_getController`` in your ``AppExceptionRenderer`` class, you can use any
controller you want::

    class AppExceptionRenderer extends ExceptionRenderer {
        protected function _getController($exception) {
            App::uses('SuperCustomErrorController', 'Controller');
            return new SuperCustomErrorController();
        }
    }

Alternatively, you could just override the core CakeErrorController,
by including one in ``app/Controller``. If you are using a custom
controller for error handling, make sure you do all the setup you need
in your constructor, or the render method. As those are the only methods
that the built-in ``ErrorHandler`` class directly call.


Logging exceptions
------------------

Using the built-in exception handling, you can log all the exceptions
that are dealt with by ErrorHandler by setting ``Exception.log`` to true
in your core.php. Enabling this will log every exception to :php:class:`CakeLog`
and the configured loggers.

.. note::

    If you are using a custom ``Exception.handler`` this setting will have
    no effect. Unless you reference it inside your implementation.


.. meta::
    :title lang=en: Exceptions
    :keywords lang=en: uncaught exceptions,stack traces,logic errors,anonymous functions,renderer,html page,error messages,flexibility,lib,array,cakephp,php
