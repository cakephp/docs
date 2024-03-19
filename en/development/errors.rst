Error & Exception Handling
##########################

CakePHP applications come with error and exception handling setup for you. PHP
errors are trapped and displayed or logged. Uncaught exceptions are rendered
into error pages automatically.

.. _error-configuration:

Error & Exception Configuration
===============================

Error configuration is done in your application's **config/app.php** file. By
default CakePHP uses ``Cake\Error\ErrorTrap`` and ``Cake\Error\ExceptionTrap``
to handle both PHP errors and exceptions respectively. The error configuration
allows you to customize error handling for your application. The following
options are supported:

* ``errorLevel`` - int - The level of errors you are interested in capturing.
  Use the built-in PHP error constants, and bitmasks to select the level of
  error you are interested in. See :ref:`deprecation-warnings` to disable
  deprecation warnings.
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
* ``logger`` (prior to 4.4.0 use ``errorLogger``) -
  ``Cake\Error\ErrorLoggerInterface`` - The class responsible for logging
  errors and unhandled exceptions. Defaults to ``Cake\Error\ErrorLogger``.
* ``errorRenderer`` - ``Cake\Error\ErrorRendererInterface`` - The class responsible
  for rendering errors. Default is chosen based on PHP SAPI.
* ``ignoredDeprecationPaths`` - array - A list of glob compatible paths that
  deprecation errors should be ignored in. Added in 4.2.0

By default, PHP errors are displayed when ``debug`` is ``true``, and logged
when debug is ``false``. The fatal error handler will be called independent
of ``debug`` level or ``errorLevel`` configuration, but the result will be
different based on ``debug`` level. The default behavior for fatal errors is
show a page to internal server error (``debug`` disabled) or a page with the
message, file and line (``debug`` enabled).

.. note::

    If you use a custom error handler, the supported options will
    depend on your handler.


.. _deprecation-warnings:

Deprecation Warnings
--------------------

CakePHP uses deprecation warnings to indicate when features have been
deprecated. We also recommend this system for use in your plugins and
application code when useful. You can trigger deprecation warnings with
``deprecationWarning()``::

    deprecationWarning('The example() method is deprecated. Use getExample() instead.');

When upgrading CakePHP or plugins you may encounter new deprecation warnings.
You can temporarily disable deprecation warnings in one of a few ways:

#. Using the ``Error.errorLevel`` setting to ``E_ALL ^ E_USER_DEPRECATED`` to
   ignore *all* deprecation warnings.
#. Using the ``Error.ignoredDeprecationPaths`` configuration option to ignore
   deprecations with glob compatible expressions. For example::

        'Error' => [
            'ignoredDeprecationPaths' => [
                'vendors/company/contacts/*',
                'src/Models/*',
            ]
        ],

   Would ignore all deprecations from your ``Models`` directory and the
   ``Contacts`` plugin in your application.

.. versionadded:: 4.2.0
    The ``Error.ignoredDeprecationPaths`` option was added.

.. php:class:: ExceptionRenderer(Exception $exception)

Changing Exception Handling
===========================

Exception handling offers several ways to tailor how exceptions are handled.  Each
approach gives you different amounts of control over the exception handling
process.

#. *Listen to events* This allows you to be notified through CakePHP events when
   errors and exceptions have been handled.
#. *Custom error templates* This allows you to change the rendered view
   templates as you would any other template in your application.
#. *Custom ErrorController* This allows you to control how exception
   pages are rendered.
#. *Custom ExceptionRenderer* This allows you to control how exception
   pages and logging are performed.
#. *Create & register your own error handler* This gives you complete
   control over how errors & exceptions are handled, logged and rendered.

Listen to Events
================

The ``ErrorTrap`` and ``ExceptionTrap`` handlers will trigger CakePHP events
when they handle errors. You can listen to the ``Error.beforeRender`` event to be
notified of PHP errors. The ``Exception.beforeRender`` event is dispatched when an
exception is handled::

    $errorTrap = new ErrorTrap(Configure::read('Error'));
    $errorTrap->getEventManager()->on(
        'Error.beforeRender',
        function (EventInterface $event, PhpError $error) {
            // do your thing
        }
    );

Within an ``Error.beforeRender`` handler you have a few options:

* Stop the event to prevent rendering.
* Return a string to skip rendering and use the provided string instead

Within an ``Exception.beforeRender`` handler you have a few options:

* Stop the event to prevent rendering.
* Set the ``exception`` data attribute with ``setData('exception', $err)``
  to replace the exception that is being rendered.
* Return a response from the event listener to skip rendering and use
  the provided response instead.

.. versionadded:: 4.4.0
    Error and Exception events were added.

.. versionchanged:: 4.5.0
   The ``beforeRender`` events can now replace exceptions and replace rendering.

.. _error-views:

Custom Error Templates
======================

The default error handler renders all uncaught exceptions your application
raises with the help of ``Cake\Error\ExceptionRenderer``, and your application's
``ErrorController``.

The error page views are located at **templates/Error/**. All 4xx errors use
the **error400.php** template, and 5xx errors use the **error500.php**. Your
error templates will have the following variables available:

* ``message`` The exception message.
* ``code`` The exception code.
* ``url`` The request URL.
* ``error`` The exception object.

In debug mode if your error extends ``Cake\Core\Exception\CakeException`` the
data returned by ``getAttributes()`` will be exposed as view variables as well.

.. note::
    You will need to set ``debug`` to false, to see your **error404** and
    **error500** templates. In debug mode, you'll see CakePHP's development
    error page.

Custom Error Page Layout
------------------------

By default error templates use **templates/layout/error.php** for a layout.
You can use the ``layout`` property to pick a different layout::

    // inside templates/Error/error400.php
    $this->layout = 'my_error';

The above would use  **templates/layout/my_error.php** as the layout for your
error pages.

Many exceptions raised by CakePHP will render specific view templates in debug
mode. With debug turned off all exceptions raised by CakePHP will use either
**error400.php** or **error500.php** based on their status code.

Custom ErrorController
======================

The ``App\Controller\ErrorController`` class is used by CakePHP's exception
rendering to render the error page view and receives all the standard request
life-cycle events. By modifying this class you can control which components are
used and which templates are rendered.

If your application uses :ref:`prefix-routing` you can create custom error
controllers for each routing prefix. For example, if you had an ``Admin``
prefix. You could create the following class::

    namespace App\Controller\Admin;

    use App\Controller\AppController;
    use Cake\Event\EventInterface;

    class ErrorController extends AppController
    {
        /**
         * beforeRender callback.
         *
         * @param \Cake\Event\EventInterface $event Event.
         * @return void
         */
        public function beforeRender(EventInterface $event)
        {
            $this->viewBuilder()->setTemplatePath('Error');
        }
    }

This controller would only be used when an error is encountered in a prefixed
controller, and allows you to define prefix specific logic/templates as needed.

.. _custom-exceptionrenderer:

Custom ExceptionRenderer
========================

If you want to control the entire exception rendering and logging process you
can use the ``Error.exceptionRenderer`` option in **config/app.php** to choose
a class that will render exception pages. Changing the ExceptionRenderer is
useful when you want to change the logic used to create an error controller,
choose the error template, or control the overall rendering process.

Your custom exception renderer class should be placed in **src/Error**. Let's
assume our application uses ``App\Exception\MissingWidgetException`` to indicate
a missing widget. We could create an exception renderer that renders specific
error pages when this error is handled::

    // In src/Error/AppExceptionRenderer.php
    namespace App\Error;

    use Cake\Error\ExceptionRenderer;

    class AppExceptionRenderer extends ExceptionRenderer
    {
        public function missingWidget($error)
        {
            $response = $this->controller->getResponse();

            return $response->withStringBody('Oops that widget is missing.');
        }
    }

    // In config/app.php
    'Error' => [
        'exceptionRenderer' => 'App\Error\AppExceptionRenderer',
        // ...
    ],
    // ...

The above would handle our ``MissingWidgetException``,
and allow us to provide custom display/handling logic for those application
exceptions.

Exception rendering methods receive the handled exception as an argument, and
should return a ``Response`` object. You can also implement methods to add
additional logic when handling CakePHP errors::

    // In src/Error/AppExceptionRenderer.php
    namespace App\Error;

    use Cake\Error\ExceptionRenderer;

    class AppExceptionRenderer extends ExceptionRenderer
    {
        public function notFound($error)
        {
            // Do something with NotFoundException objects.
        }
    }

Changing the ErrorController Class
----------------------------------

The exception renderer dictates which controller is used for exception
rendering. If you want to change which controller is used to render exceptions,
override the ``_getController()`` method in your exception renderer::

    // in src/Error/AppExceptionRenderer
    namespace App\Error;

    use App\Controller\SuperCustomErrorController;
    use Cake\Controller\Controller;
    use Cake\Error\ExceptionRenderer;

    class AppExceptionRenderer extends ExceptionRenderer
    {
        protected function _getController(): Controller
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

Custom Error Logging
====================

Error handlers use instances of ``Cake\Error\ErrorLoggingInterface`` to create
log messages and log them to the appropriate place. You can replace the error
logger using the ``Error.logger`` configure value. An example error
logger::

    namespace App\Error;

    use Cake\Error\ErrorLoggerInterface;
    use Cake\Error\PhpError;
    use Psr\Http\Message\ServerRequestInterface;
    use Throwable;

    /**
     * Log errors and unhandled exceptions to `Cake\Log\Log`
     */
    class ErrorLogger implements ErrorLoggerInterface
    {
        /**
         * @inheritDoc
         */
        public function logError(
            PhpError $error,
            ?ServerRequestInterface $request,
            bool $includeTrace = false
        ): void {
            // Log PHP Errors
        }

        /**
         * @inheritDoc
         */
        public function logException(
            ?ServerRequestInterface $request,
            bool $includeTrace = false
        ): void {
            // Log exceptions.
        }
    }

Prior to CakePHP 4.4.0, you should implement ``logMessage()`` and ``log()``, and then
replace the error logger using the ``Error.errorLogger`` configure value::

    namespace App\Error;

    use Cake\Error\ErrorLoggerInterface;
    use Psr\Http\Message\ServerRequestInterface;
    use Throwable;

    /**
     * Log errors and unhandled exceptions to `Cake\Log\Log`
     */
    class ErrorLogger implements ErrorLoggerInterface
    {
        /**
         * @inheritDoc
         */
        public function logMessage($level, string $message, array $context = []): bool
        {
            // Log PHP Errors
        }

        public function log(Throwable $exception, ?ServerRequestInterface $request = null): bool
        {
            // Log exceptions.
        }
    }

.. versionadded:: 4.1.0
    ErrorLoggerInterface was added.

.. versionchanged:: 4.4.0
    ``ErrorLoggerInterface::logException()`` and ``ErrorLoggerInterface::logError()`` were added.


Custom Error Rendering
======================

By default CakePHP ships with error renderers for both web and console
environments. If however, you would like to replace the logic that renders
errors you can create a class::

    // src/Error/CustomErrorRenderer.php
    namespace App\Error;

    use Cake\Error\ErrorRendererInterface;
    use Cake\Error\PhpError;

    class CustomErrorRenderer implements ErrorRendererInterface
    {
        public function write(string $out): void
        {
            // output the rendered error to the appropriate output stream
        }

        public function render(PhpError $error, bool $debug): string
        {
            // Convert the error into the output string.
        }
    }

The constructor of your renderer will be passed an array of all the Error
configuration.

.. versionadded:: 4.4.0
    ErrorRendererInterface was added.

.. index:: application exceptions

Creating your own Application Exceptions
========================================

You can create your own application exceptions using any of the built in `SPL
exceptions <https://php.net/manual/en/spl.exceptions.php>`_, ``Exception``
itself, or :php:exc:`Cake\\Core\\Exception\\Exception`.
If your application contained the following exception::

    use Cake\Core\Exception\CakeException;

    class MissingWidgetException extends CakeException
    {
    }

You could provide nice development errors, by creating
**templates/Error/missing_widget.php**. When in production mode, the above
error would be treated as a 500 error and use the **error500** template.

Exceptions that subclass ``Cake\Http\Exception\HttpException``, will have their
error code used as an HTTP status code if the error code is between ``400`` and
``506``.

The constructor for :php:exc:`Cake\\Core\\Exception\\CakeException` allows you to
pass in additional data. This additional data is interpolated into the the
``_messageTemplate``. This allows you to create data rich exceptions, that
provide more context around your errors::

    use Cake\Core\Exception\CakeException;

    class MissingWidgetException extends CakeException
    {
        // Context data is interpolated into this format string.
        protected $_messageTemplate = 'Seems that %s is missing.';

        // You can set a default exception code as well.
        protected $_defaultCode = 404;
    }

    throw new MissingWidgetException(['widget' => 'Pointy']);

When rendered, this your view template would have a ``$widget`` variable set. If
you cast the exception as a string or use its ``getMessage()`` method you will
get ``Seems that Pointy is missing.``.

.. note::

    Prior to CakePHP 4.2.0 use class ``Cake\Core\Exception\Exception`` instead
    of ``Cake\Core\Exception\CakeException``

Logging Exceptions
------------------

Using the built-in exception handling, you can log all the exceptions that are
dealt with by ErrorTrap by setting the ``log`` option to ``true`` in your
**config/app.php**. Enabling this will log every exception to
:php:class:`Cake\\Log\\Log` and the configured loggers.

.. note::

    If you are using a custom exception handler this setting will have
    no effect. Unless you reference it inside your implementation.


.. php:namespace:: Cake\Http\Exception

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

.. php:exception:: InvalidCsrfTokenException

    Used for doing a 403 error caused by an invalid CSRF token.

.. php:exception:: NotFoundException

    Used for doing a 404 Not found error.

.. php:exception:: MethodNotAllowedException

    Used for doing a 405 Method Not Allowed error.

.. php:exception:: NotAcceptableException

    Used for doing a 406 Not Acceptable error.

.. php:exception:: ConflictException

    Used for doing a 409 Conflict error.

.. php:exception:: GoneException

    Used for doing a 410 Gone error.

For more details on HTTP 4xx error status codes see :rfc:`2616#section-10.4`.

.. php:exception:: InternalErrorException

    Used for doing a 500 Internal Server Error.

.. php:exception:: NotImplementedException

    Used for doing a 501 Not Implemented Errors.

.. php:exception:: ServiceUnavailableException

    Used for doing a 503 Service Unavailable error.

For more details on HTTP 5xx error status codes see :rfc:`2616#section-10.5`.

You can throw these exceptions from your controllers to indicate failure states,
or HTTP errors. An example use of the HTTP exceptions could be rendering 404
pages for items that have not been found::

    use Cake\Http\Exception\NotFoundException;

    public function view($id = null)
    {
        $article = $this->Articles->findById($id)->first();
        if (empty($article)) {
            throw new NotFoundException(__('Article not found'));
        }
        $this->set('article', $article);
        $this->viewBuilder()->setOption('serialize', ['article']);
    }

By using exceptions for HTTP errors, you can keep your code both clean, and give
RESTful responses to client applications and users.

Using HTTP Exceptions in your Controllers
-----------------------------------------

You can throw any of the HTTP related exceptions from your controller actions
to indicate failure states. For example::

    use Cake\Network\Exception\NotFoundException;

    public function view($id = null)
    {
        $article = $this->Articles->findById($id)->first();
        if (empty($article)) {
            throw new NotFoundException(__('Article not found'));
        }
        $this->set('article', 'article');
        $this->viewBuilder()->setOption('serialize', ['article']);
    }

The above would cause the configured exception handler to catch and
process the :php:exc:`NotFoundException`. By default this will create an error
page, and log the exception.

Other Built In Exceptions
-------------------------

In addition, CakePHP uses the following exceptions:

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

.. php:method:: responseHeader($header = null, $value = null)

    See :php:func:`Cake\\Network\\Request::header()`

All Http and Cake exceptions extend the Exception class, which has a method
to add headers to the response. For instance when throwing a 405
MethodNotAllowedException the rfc2616 says::

    "The response MUST include an Allow header containing a list of valid
    methods for the requested resource."

Creating your Own Error Handler
===============================

.. deprecated:: 4.4.0
    ``ErrorHandler`` has been deprecated. Use ``ErrorTrap`` or ``ExceptionTrap``
    instead.

By replacing the error handler you can customize how PHP errors and exceptions
that are not caught by middleware are handled. Error handlers are different for
the HTTP and Console parts of your application.

To create an error handler for HTTP requests, you should extend
``Cake\Error\ErrorHandler``.  As an example, we could build
a class called ``AppError`` to handle errors during HTTP requests::

    // In src/Error/AppError.php
    namespace App\Error;

    use Cake\Error\ErrorHandler;
    use Throwable;

    class AppError extends ErrorHandler
    {
        protected function _displayError(array $error, bool $debug): void
        {
            echo 'There has been an error!';
        }

        protected function _displayException(Throwable $exception): void
        {
            echo 'There has been an exception!';
        }
    }

Then we can register our error handler as the PHP error handler::

    // In config/bootstrap.php
    use App\Error\AppError;

    if (PHP_SAPI !== 'cli') {
        $errorHandler = new AppError();
        $errorHandler->register();
    }

Finally, we can use our error handler in the ``ErrorHandlerMiddleware``::

    // in src/Application.php
    public function middleware(MiddlewareQueue $middlewareQueue): MiddlewareQueue
    {
        $error = new AppError(Configure::read('Error'));
        $middleware->add(new ErrorHandlerMiddleware($error));

        return $middleware;
    }

For console error handling, you should extend ``Cake\Error\ConsoleErrorHandler`` instead::

    // In /src/Error/AppConsoleErrorHandler.php
    namespace App\Error;
    use Cake\Error\ConsoleErrorHandler;

    class AppConsoleErrorHandler extends ConsoleErrorHandler {

        protected function _displayException(Throwable $exception): void {
            parent::_displayException($exception);
            if (isset($exception->queryString)) {
                $this->_stderr->write('Query String: ' . $exception->queryString);
            }
        }

    }

Then we can register our console error handler as the PHP error handler::

    // In config/bootstrap.php
    use App\Error\AppConsoleErrorHandler;
    $isCli = PHP_SAPI === 'cli';
    if ($isCli) {
        (new AppConsoleErrorHandler(Configure::read('Error')))->register();
    }

ErrorHandler objects have a few methods you may want to implement:

* ``_displayError(array $error, bool $debug)`` is used when errors are triggered.
* ``_displayException(Throwable $exception)`` method is called when there is an uncaught exception.
* ``_logError($level, array $error)`` is called when there is an error to log.
* ``logException(Throwable $exception)`` is called when there is an exception to log.


Changing Fatal Error Behavior
-----------------------------

Error handlers convert fatal errors into exceptions and re-use the
exception handling logic to render an error page. If you do not want to show the
standard error page, you can override it::

    // In src/Error/AppError.php
    namespace App\Error;

    use Cake\Error\BaseErrorHandler;

    class AppError extends BaseErrorHandler
    {
        // Other methods.

        public function handleFatalError(int $code, string $description, string $file, int $line): bool
        {
            echo 'A fatal error has happened';
        }
    }

.. meta::
    :title lang=en: Error & Exception Handling
    :keywords lang=en: stack traces,error constants,error array,default displays,anonymous functions,error handlers,default error,error level,exception handler,php error,error handler,write error,core classes,exception handling,configuration error,application code,callback,custom error,exceptions,bitmasks,fatal error, http status codes
