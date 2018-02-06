Error & Exception Handling
##########################

CakePHP applications come with error and exception handling setup for you. PHP
errors are trapped and displayed or logged. Uncaught exceptions are rendered
into error pages automatically.

.. _error-configuration:

Error & Exception Configuration
===============================

Error configuration is done in your application's **config/app.php** file. By
default CakePHP uses ``Cake\Error\ErrorHandler`` to handle both PHP errors and
exceptions by default. The error configuration allows you to customize error
handling for your application. The following options are supported:

* ``errorLevel`` - int - The level of errors you are interested in capturing.
  Use the built-in PHP error constants, and bitmasks to select the level of
  error you are interested in.
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

By default, PHP errors are displayed when ``debug`` is ``true``, and logged
when debug is ``false``. The fatal error handler will be called independent
of ``debug`` level or ``errorLevel`` configuration, but the result will be
different based on ``debug`` level. The default behavior for fatal errors is
show a page to internal server error (``debug`` disabled) or a page with the
message, file and line (``debug`` enabled).

.. note::

    If you use a custom error handler, the supported options will
    depend on your handler.

.. php:class:: ExceptionRenderer(Exception $exception)

Changing Exception Handling
===========================

Exception handling offers 3 ways to tailor how exceptions are handled.  Each
approach gives you different amounts of control over the exception handling
process.

#. *Customize the error templates* This allows you to change the rendered view
   templates as you would any other template in your application.
#. *Customize the ErrorController* This allows you to control how exception
   pages are rendered.
#. *Customize the ExceptionRenderer* This allows you to control how exception
   pages and logging are performed.
#. *Create & register your own error handler* This gives you complete
   control over how errors & exceptions are handled, logged and rendered.

.. _error-views:

Customize Error Templates
=========================

The default error handler renders all uncaught exceptions your application
raises with the help of ``Cake\Error\ExceptionRenderer``, and your application's
``ErrorController``.

The error page views are located at **src/Template/Error/**. All 4xx errors use
the **error400.ctp** template, and 5xx errors use the **error500.ctp**. Your
error templates will have the following variables available:

* ``message`` The exception message.
* ``code`` The exception code.
* ``url`` The request URL.
* ``error`` The exception object.

In debug mode if your error extends ``Cake\Core\Exception\Exception`` the
data returned by ``getAttributes()`` will be exposed as view variables as well.

.. note::
    You will need to set ``debug`` to false, to see your **error404** and
    **error500** templates. In debug mode, you'll see CakePHP's development
    error page.

Customize the Error Page Layout
-------------------------------

By default error templates use **src/Template/Layout/error.ctp** for a layout.
You can use the ``layout`` property to pick a different layout::

    // inside src/Template/Error/error400.ctp
    $this->layout = 'my_error';

The above would use  **src/Template/Layout/my_error.ctp** as the layout for your
error pages.

Many exceptions raised by CakePHP will render specific view templates in debug
mode. With debug turned off all exceptions raised by CakePHP will use either
**error400.ctp** or **error500.ctp** based on their status code.

Customize the ErrorController
=============================

The ``App\Controller\ErrorController`` class is used by CakePHP's exception
rendering to render the error page view and receives all the standard request
life-cycle events. By modifying this class you can control which components are
used and which templates are rendered.

Change the ExceptionRenderer
============================

If you want to control the entire exception rendering and logging process you
can use the ``Error.exceptionRenderer`` option in **config/app.php** to choose
a class that will render exception pages. Changing the ExceptionRenderer is
useful when you want to provide custom error pages for application specific
exception classes.

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
            $response = $this->controller->response;

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


Creating your Own Error Handler
===============================

By replacing the error handler you can customize the entire error & exception
handling process. By extending ``Cake\Error\BaseErrorHandler`` you can customize
display logic more simply. As an example, we could build a class called
``AppError`` to handle our errors::

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

        public function handleFatalError($code, $description, $file, $line)
        {
            return 'A fatal error has happened';
        }
    }

.. index:: application exceptions

Creating your own Application Exceptions
========================================

You can create your own application exceptions using any of the built in `SPL
exceptions <http://php.net/manual/en/spl.exceptions.php>`_, ``Exception``
itself, or :php:exc:`Cake\\Core\\Exception\\Exception`.
If your application contained the following exception::

    use Cake\Core\Exception\Exception;

    class MissingWidgetException extends Exception
    {
    }

You could provide nice development errors, by creating
**src/Template/Error/missing_widget.ctp**. When in production mode, the above
error would be treated as a 500 error and use the **error500** template.

If your exceptions have a code between ``400`` and ``506`` the exception code
will be used as the HTTP response code.

The constructor for :php:exc:`Cake\\Core\\Exception\\Exception` allows you to
pass in additional data. This additional data is interpolated into the the
``_messageTemplate``. This allows you to create data rich exceptions, that
provide more context around your errors::

    use Cake\Core\Exception\Exception;

    class MissingWidgetException extends Exception
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

Logging Exceptions
------------------

Using the built-in exception handling, you can log all the exceptions that are
dealt with by ErrorHandler by setting the ``log`` option to ``true`` in your
**config/app.php**. Enabling this will log every exception to
:php:class:`Cake\\Log\\Log` and the configured loggers.

.. note::

    If you are using a custom exception handler this setting will have
    no effect. Unless you reference it inside your implementation.


.. php:namespace:: Cake\Network\Exception

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

    use Cake\Network\Exception\NotFoundException;

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
        $this->set('_serialize', ['article']);
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

.. php:method:: responseHeader($header = null, $value = null)

    See :php:func:`Cake\\Network\\Request::header()`

All Http and Cake exceptions extend the Exception class, which has a method
to add headers to the response. For instance when throwing a 405
MethodNotAllowedException the rfc2616 says::

    "The response MUST include an Allow header containing a list of valid
    methods for the requested resource."


.. meta::
    :title lang=en: Error & Exception Handling
    :keywords lang=en: stack traces,error constants,error array,default displays,anonymous functions,error handlers,default error,error level,exception handler,php error,error handler,write error,core classes,exception handling,configuration error,application code,callback,custom error,exceptions,bitmasks,fatal error, http status codes
