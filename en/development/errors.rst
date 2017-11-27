Error & Exception Handling
##########################

Many of PHP's internal methods use errors to communicate failures. These errors
will need to be trapped and dealt with. CakePHP comes with default error
trapping that prints and or logs errors as they occur. This same error handler
is used to catch uncaught exceptions from controllers and other parts of your
application.

.. _error-configuration:

Error & Exception Configuration
===============================

Error configuration is done inside your application's **config/app.php**
file. By default CakePHP uses the ``ErrorHandler`` or ``ConsoleErrorHandler``
class to trap errors and print/log the errors. You can replace this behavior by
changing out the default error handler. The default error handler also handles
uncaught exceptions.

Error handling accepts a few options that allow you to tailor error handling for
your application:

* ``errorLevel`` - int - The level of errors you are interested in capturing.
  Use the built-in php error constants, and bitmasks to select the level of
  error you are interested in. You can set this to ``E_ALL ^ E_USER_DEPRECATED``
  to disable deprecation warnings.
* ``trace`` - bool - Include stack traces for errors in log files. Stack
  traces will be included in the log after each error. This is helpful for
  finding where/when errors are being raised.
* ``exceptionRenderer`` - string - The class responsible for rendering uncaught
  exceptions. If you choose a custom class you should place the file for that
  class in **src/Error**. This class needs to implement a ``render()`` method.
* ``log`` - bool - When ``true``, exceptions + their stack traces will be
  logged to :php:class:`Cake\\Log\\Log`.
* ``skipLog`` - array - An array of exception classnames that should not be
  logged. This is useful to remove NotFoundExceptions or other common, but
  uninteresting log messages.
* ``extraFatalErrorMemory`` - int - Set to the number of megabytes to increase
  the memory limit by when a fatal error is encountered. This allows breathing
  room to complete logging or error handling.

ErrorHandler by default, displays errors when ``debug`` is ``true``, and logs
errors when debug is ``false``. The type of errors captured in both cases is
controlled by ``errorLevel``. The fatal error handler will be called independent
of ``debug`` level or ``errorLevel`` configuration, but the result will be
different based on ``debug`` level. The default behavior for fatal errors is
show a page to internal server error (``debug`` disabled) or a page with the
message, file and line (``debug`` enabled).

.. note::

    If you use a custom error handler, the supported options will
    depend on your handler.

Creating your Own Error Handler
===============================

You can create an error handler out of any callback type. For example you could
use a class called ``AppError`` to handle your errors. By extending the
``BaseErrorHandler`` you can supply custom logic for handling errors.
An example would be::

    // In config/bootstrap.php
    use App\Error\AppError;

    $errorHandler = new AppError();
    $errorHandler->register();

    // In src/Error/AppError.php
    namespace App\Error;

    use Cake\Error\BaseErrorHandler;

    class AppError extends BaseErrorHandler
    {
        public function _displayError($error, $debug)
        {
            echo 'There has been an error!';
        }
        public function _displayException($exception)
        {
            echo 'There has been an exception!';
        }
    }

The ``BaseErrorHandler`` defines two abstract methods. ``_displayError()`` is
used when errors are triggered. The ``_displayException()`` method is called
when there is an uncaught exception.


Changing Fatal Error Behavior
=============================

The default error handlers convert fatal errors into exceptions and re-use the
exception handling logic to render an error page. If you do not want to show the
standard error page, you can override it like::

    // In config/bootstrap.php
    use App\Error\AppError;

    $errorHandler = new AppError();
    $errorHandler->register();

    // In src/Error/AppError.php
    namespace App\Error;

    use Cake\Error\BaseErrorHandler;

    class AppError extends BaseErrorHandler
    {
        // Other methods.

        public function handleFatalError($code, $description, $file, $line)
        {
            return 'A fatal error has happened';
        }
    }

.. php:namespace:: Cake\Http\Exception

Exception Classes
=================

There are a number of exception classes in CakePHP. The built in exception
handling will capture any uncaught exceptions and render a useful page.
Exceptions that do not specifically use a 400 range code, will be treated as an
Internal Server Error.

.. _built-in-exceptions:

Built in Exceptions for CakePHP
===============================

HTTP Exceptions
---------------

There are several built-in exceptions inside CakePHP, outside of the
internal framework exceptions, there are several
exceptions for HTTP methods

.. php:exception:: BadRequestException

    Used for doing 400 Bad Request error.

.. php:exception:: UnauthorizedException

    Used for doing a 401 Unauthorized error.

.. php:exception:: ForbiddenException

    Used for doing a 403 Forbidden error.

.. versionadded:: 3.1

    InvalidCsrfTokenException has been added.

.. php:exception:: InvalidCsrfTokenException

    Used for doing a 403 error caused by an invalid CSRF token.

.. php:exception:: NotFoundException

    Used for doing a 404 Not found error.

.. php:exception:: MethodNotAllowedException

    Used for doing a 405 Method Not Allowed error.



.. php:exception:: NotAcceptableException

    Used for doing a 406 Not Acceptable error.
    
    .. versionadded:: 3.1.7 NotAcceptableException has been added.

.. php:exception:: ConflictException

    Used for doing a 409 Conflict error.

    .. versionadded:: 3.1.7 ConflictException has been added.

.. php:exception:: GoneException

    Used for doing a 410 Gone error.

    .. versionadded:: 3.1.7 GoneException has been added.

For more details on HTTP 4xx error status codes see :rfc:`2616#section-10.4`.


.. php:exception:: InternalErrorException

    Used for doing a 500 Internal Server Error.

.. php:exception:: NotImplementedException

    Used for doing a 501 Not Implemented Errors.



.. php:exception:: ServiceUnavailableException

    Used for doing a 503 Service Unavailable error.

    .. versionadded:: 3.1.7 Service Unavailable has been added.

For more details on HTTP 5xx error status codes see :rfc:`2616#section-10.5`.


You can throw these exceptions from your controllers to indicate failure states,
or HTTP errors. An example use of the HTTP exceptions could be rendering 404
pages for items that have not been found::

    // Prior to 3.6 use Cake\Network\Exception\NotFoundException
    use Cake\Http\Exception\NotFoundException;

    public function view($id = null)
    {
        $article = $this->Articles->findById($id)->first();
        if (empty($article)) {
            throw new NotFoundException(__('Article not found'));
        }
        $this->set('article', $article);
        $this->set('_serialize', ['article']);
    }

By using exceptions for HTTP errors, you can keep your code both clean, and give
RESTful responses to client applications and users.

Other Built In Exceptions
-------------------------

In addition, the following framework layer exceptions are available, and will
be thrown from a number of CakePHP core components:

.. php:namespace:: Cake\View\Exception

.. php:exception:: MissingViewException

    The chosen view class could not be found.

.. php:exception:: MissingTemplateException

    The chosen template file could not be found.

.. php:exception:: MissingLayoutException

    The chosen layout could not be found.

.. php:exception:: MissingHelperException

    The chosen helper could not be found.

.. php:exception:: MissingElementException

    The chosen element file could not be found.

.. php:exception:: MissingCellException

    The chosen cell class could not be found.

.. php:exception:: MissingCellViewException

    The chosen cell view file could not be found.

.. php:namespace:: Cake\Controller\Exception

.. php:exception:: MissingComponentException

    A configured component could not be found.

.. php:exception:: MissingActionException

    The requested controller action could not be found.

.. php:exception:: PrivateActionException

    Accessing private/protected/_ prefixed actions.

.. php:namespace:: Cake\Console\Exception

.. php:exception:: ConsoleException

    A console library class encounter an error.

.. php:exception:: MissingTaskException

    A configured task could not found.

.. php:exception:: MissingShellException

    The shell class could not be found.

.. php:exception:: MissingShellMethodException

    The chosen shell class has no method of that name.

.. php:namespace:: Cake\Database\Exception

.. php:exception:: MissingConnectionException

    A model's connection is missing.

.. php:exception:: MissingDriverException

    A database driver could not be found.

.. php:exception:: MissingExtensionException

    A PHP extension is missing for the database driver.

.. php:namespace:: Cake\ORM\Exception

.. php:exception:: MissingTableException

    A model's table could not be found.

.. php:exception:: MissingEntityException

    A model's entity could not be found.

.. php:exception:: MissingBehaviorException

    A model's behavior could not be found.

.. php:exception:: PersistenceFailedException

    An entity couldn't be saved/deleted while using :php:meth:`Cake\\ORM\\Table::saveOrFail()` or
    :php:meth:`Cake\\ORM\\Table::deleteOrFail()`.

    .. versionadded:: 3.4.1 PersistenceFailedException has been added.

.. php:namespace:: Cake\Datasource\Exception

.. php:exception:: RecordNotFoundException

   The requested record could not be found. This will also set HTTP response
   headers to 404.

.. php:namespace:: Cake\Routing\Exception

.. php:exception:: MissingControllerException

    The requested controller could not be found.

.. php:exception:: MissingRouteException

    The requested URL cannot be reverse routed or cannot be parsed.

.. php:exception:: MissingDispatcherFilterException

    The dispatcher filter could not be found.

.. php:namespace:: Cake\Core\Exception

.. php:exception:: Exception

    Base exception class in CakePHP. All framework layer exceptions thrown by
    CakePHP will extend this class.

These exception classes all extend :php:exc:`Exception`.
By extending Exception, you can create your own 'framework' errors.
All of the standard Exceptions that CakePHP will throw also extend Exception.

.. php:method:: responseHeader($header = null, $value = null)

    See :php:func:`Cake\\Network\\Request::header()`

All Http and Cake exceptions extend the Exception class, which has a method
to add headers to the response. For instance when throwing a 405
MethodNotAllowedException the rfc2616 says::

    "The response MUST include an Allow header containing a list of valid
    methods for the requested resource."

Using HTTP Exceptions in your Controllers
=========================================

You can throw any of the HTTP related exceptions from your controller actions
to indicate failure states. For example::

    // Prior to 3.6 use Cake\Network\Exception\NotFoundException
    use Cake\Http\Exception\NotFoundException;

    public function view($id = null)
    {
        $article = $this->Articles->findById($id)->first();
        if (empty($article)) {
            throw new NotFoundException(__('Article not found'));
        }
        $this->set('article', 'article');
        $this->set('_serialize', ['article']);
    }

The above would cause the configured exception handler to catch and
process the :php:exc:`NotFoundException`. By default this will create an error
page, and log the exception.

.. _error-views:

Exception Renderer
==================

.. php:class:: ExceptionRenderer(Exception $exception)

The ExceptionRenderer class with the help of ``ErrorController`` takes care of
rendering the error pages for all the exceptions thrown by your application.

The error page views are located at **src/Template/Error/**. For all 4xx and
5xx errors the template files **error400.ctp** and **error500.ctp** are used
respectively. You can customize them as per your needs. By default your
**src/Template/Layout/error.ctp** is used for error pages too. If for
example, you want to use another layout **src/Template/Layout/my_error.ctp**
for your error pages, simply edit the error views and add the statement
``$this->layout = 'my_error;`` to the **error400.ctp** and **error500.ctp**.

Each framework layer exception has its own view file located in the core
templates but you really don't need to bother customizing them as they are used
only during development. With debug turned off all framework layer exceptions
are converted to ``InternalErrorException``.

.. index:: application exceptions

Creating your own Application Exceptions
========================================

You can create your own application exceptions using any of the built in `SPL
exceptions <http://php.net/manual/en/spl.exceptions.php>`_, ``Exception``
itself, or :php:exc:`Cake\\Core\\Exception\\Exception`.
If your application contained the following exception::

    use Cake\Core\Exception\Exception;

    class MissingWidgetException extends Exception
    {};

You could provide nice development errors, by creating
**src/Template/Error/missing_widget.ctp**. When in production mode, the above
error would be treated as a 500 error. The constructor for
:php:exc:`Cake\\Core\\Exception\\Exception` has been extended, allowing you to
pass in hashes of data. These hashes are interpolated into the the
messageTemplate, as well as into the view that is used to represent the error
in development mode. This allows you to create data rich exceptions, by
providing more context for your errors. You can also provide a message template
which allows the native ``__toString()`` methods to work as normal::

    use Cake\Core\Exception\Exception;

    class MissingWidgetException extends Exception
    {
        protected $_messageTemplate = 'Seems that %s is missing.';
    }

    throw new MissingWidgetException(['widget' => 'Pointy']);


When caught by the built in exception handler, you would get a ``$widget``
variable in your error view template. In addition if you cast the exception
as a string or use its ``getMessage()`` method you will get
``Seems that Pointy is missing.``. This allows you to quickly create
your own rich development errors, just like CakePHP uses internally.


Creating Custom Status Codes
----------------------------

You can create custom HTTP status codes by changing the code used when
creating an exception::

    throw new MissingWidgetHelperException('Its not here', 501);

Will create a 501 response code, you can use any HTTP status code
you want. In development, if your exception doesn't have a specific
template, and you use a code equal to or greater than 500 you will
see the **error500.ctp** template. For any other error code you'll get the
**error400.ctp** template. If you have defined an error template for your
custom exception, that template will be used in development mode.
If you'd like your own exception handling logic even in production,
see the next section.


Extending and Implementing your own Exception Handlers
======================================================

You can implement application specific exception handling in one of a
few ways. Each approach gives you different amounts of control over
the exception handling process.

- Create and register your own custom error handlers.
- Extend the ``BaseErrorHandler`` provided by CakePHP.
- Set the ``exceptionRenderer`` option on the default error handler.

In the next few sections, we will detail the various approaches and the
benefits each has.

Create and Register your own Exception Handler
----------------------------------------------

Creating your own exception handler gives you full control over the exception
handling process. You will have to call ``set_exception_handler`` yourself in
this situation.

Extend the BaseErrorHandler
---------------------------

The :ref:`error-configuration` section has an example of this.

Using the exceptionRenderer Option of the Default Handler
---------------------------------------------------------

If you don't want to take control of the exception handling, but want to change
how exceptions are rendered you can use the ``exceptionRenderer`` option in
**config/app.php** to choose a class that will render exception pages. By
default :php:class:`Cake\\Core\\Exception\\ExceptionRenderer` is used. Your
custom exception renderer class should be placed in **src/Error**. In a custom
exception rendering class you can provide specialized handling for application
specific errors::

    // In src/Error/AppExceptionRenderer.php
    namespace App\Error;

    use Cake\Error\ExceptionRenderer;

    class AppExceptionRenderer extends ExceptionRenderer
    {
        public function missingWidget($error)
        {
            return 'Oops that widget is missing!';
        }
    }


    // In config/app.php
    'Error' => [
        'exceptionRenderer' => 'App\Error\AppExceptionRenderer',
        // ...
    ],
    // ...

The above would handle any exceptions of the type ``MissingWidgetException``,
and allow you to provide custom display/handling logic for those application
exceptions. Exception handling methods get the exception being handled as
their argument. Your custom exception rendering can return either a string or
a ``Response`` object. Returning a ``Response`` will give you full control
over the response.

.. note::

    Your custom renderer should expect an exception in its constructor, and
    implement a render method. Failing to do so will cause additional errors.

    If you are using a custom exception handling, configuring the renderer will
    have no effect. Unless you reference it inside your implementation.

Creating a Custom Controller to Handle Exceptions
-------------------------------------------------

By convention CakePHP will use ``App\Controller\ErrorController`` if it exists.
Implementing this class can give you a configuration free way of customizing
error page output.

If you are using custom exception renderer, you can use the ``_getController()``
method to return a customized controller.  By implementing
``_getController()`` in your exception renderer you can use any controller you
want::

    // in src/Error/AppExceptionRenderer
    namespace App\Error;

    use App\Controller\SuperCustomErrorController;
    use Cake\Error\ExceptionRenderer;

    class AppExceptionRenderer extends ExceptionRenderer
    {
        protected function _getController($exception)
        {
            return new SuperCustomErrorController();
        }
    }

    // in config/app.php
    'Error' => [
        'exceptionRenderer' => 'App\Error\AppExceptionRenderer',
        // ...
    ],
    // ...

The error controller, whether custom or conventional, is used to render the
error page view and receives all the standard request life-cycle events.

Logging Exceptions
------------------

Using the built-in exception handling, you can log all the exceptions that are
dealt with by ErrorHandler by setting the ``log`` option to ``true`` in your
**config/app.php**. Enabling this will log every exception to
:php:class:`Cake\\Log\\Log` and the configured loggers.

.. note::

    If you are using a custom exception handler this setting will have
    no effect. Unless you reference it inside your implementation.

.. meta::
    :title lang=en: Error & Exception Handling
    :keywords lang=en: stack traces,error constants,error array,default displays,anonymous functions,error handlers,default error,error level,exception handler,php error,error handler,write error,core classes,exception handling,configuration error,application code,callback,custom error,exceptions,bitmasks,fatal error, http status codes
