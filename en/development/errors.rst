Error & Exception Handling
##########################

CakePHP applications come with error and exception handling setup for you. PHP
errors are trapped and displayed or logged. Uncaught exceptions are rendered
into error pages automatically.

.. _error-configuration:

Configuration
=============

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
====================

CakePHP uses deprecation warnings to indicate when features have been
deprecated. We also recommend this system for use in your plugins and
application code when useful. You can trigger deprecation warnings with
``deprecationWarning()``::

    deprecationWarning('5.0', 'The example() method is deprecated. Use getExample() instead.');

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
            ],
        ],

   Would ignore all deprecations from your ``Models`` directory and the
   ``Contacts`` plugin in your application.

Changing Exception Handling
===========================

Exception handling in CakePHP offers several ways to tailor how exceptions are
handled.  Each approach gives you different amounts of control over the
exception handling process.

#. *Listen to events* This allows you to be notified through CakePHP events when
   errors and exceptions have been handled.
#. *Custom templates* This allows you to change the rendered view
   templates as you would any other template in your application.
#. *Custom Controller* This allows you to control how exception
   pages are rendered.
#. *Custom ExceptionRenderer* This allows you to control how exception
   pages and logging are performed.
#. *Create & register your own traps* This gives you complete
   control over how errors & exceptions are handled, logged and rendered. Use
   ``Cake\Error\ExceptionTrap`` and ``Cake\Error\ErrorTrap`` as reference when
   implementing your traps.

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

.. _error-views:

Custom Templates
================

The default exception trap renders all uncaught exceptions your application
raises with the help of ``Cake\Error\Renderer\WebExceptionRenderer``, and your application's
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

Custom Controller
=================

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

Exception specific logic
------------------------

Within your controller you can define public methods to handle custom
application errors. For example a ``MissingWidgetException`` would be handled by
a ``missingWidget()`` controller method, and CakePHP would use
``templates/Error/missing_widget.php`` as the template. For example::

    namespace App\Controller\Admin;

    use App\Controller\AppController;
    use Cake\Event\EventInterface;

    class ErrorController extends AppController
    {
        protected function missingWidget(MissingWidgetException $error)
        {
            // You can prepare additional template context or trap errors.
        }
    }

.. versionadded:: 5.2.0
    Exception specific controller methods and templates were added.

.. _custom-exceptionrenderer:

Custom ExceptionRenderer
========================

If you want to control the entire exception rendering and logging process you
can use the ``Error.exceptionRenderer`` option in **config/app.php** to choose
a class that will render exception pages. Changing the ExceptionRenderer is
useful when you want to change the logic used to create an error controller,
choose the template, or control the overall rendering process.

Your custom exception renderer class should be placed in **src/Error**. Let's
assume our application uses ``App\Exception\MissingWidgetException`` to indicate
a missing widget. We could create an exception renderer that renders specific
error pages when this error is handled::

    // In src/Error/AppExceptionRenderer.php
    namespace App\Error;

    use Cake\Error\Renderer\WebExceptionRenderer;

    class AppExceptionRenderer extends WebExceptionRenderer
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

    use Cake\Error\Renderer\WebExceptionRenderer;

    class AppExceptionRenderer extends WebExceptionRenderer
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
    use Cake\Error\Renderer\WebExceptionRenderer;

    class AppExceptionRenderer extends WebExceptionRenderer
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
   :nocontentsentry:

    Used for doing 400 Bad Request error.

.. php:exception:: UnauthorizedException
   :nocontentsentry:

    Used for doing a 401 Unauthorized error.

.. php:exception:: ForbiddenException
   :nocontentsentry:

    Used for doing a 403 Forbidden error.

.. php:exception:: InvalidCsrfTokenException
   :nocontentsentry:

    Used for doing a 403 error caused by an invalid CSRF token.

.. php:exception:: NotFoundException
   :nocontentsentry:

    Used for doing a 404 Not found error.

.. php:exception:: MethodNotAllowedException
   :nocontentsentry:

    Used for doing a 405 Method Not Allowed error.

.. php:exception:: NotAcceptableException
   :nocontentsentry:

    Used for doing a 406 Not Acceptable error.

.. php:exception:: ConflictException
   :nocontentsentry:

    Used for doing a 409 Conflict error.

.. php:exception:: GoneException
   :nocontentsentry:

    Used for doing a 410 Gone error.

For more details on HTTP 4xx error status codes see :rfc:`2616#section-10.4`.

.. php:exception:: InternalErrorException
   :nocontentsentry:

    Used for doing a 500 Internal Server Error.

.. php:exception:: NotImplementedException
   :nocontentsentry:

    Used for doing a 501 Not Implemented Errors.

.. php:exception:: ServiceUnavailableException
   :nocontentsentry:

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
   :nocontentsentry:

    The chosen view class could not be found.

.. php:exception:: MissingTemplateException
   :nocontentsentry:

    The chosen template file could not be found.

.. php:exception:: MissingLayoutException
   :nocontentsentry:

    The chosen layout could not be found.

.. php:exception:: MissingHelperException
   :nocontentsentry:

    The chosen helper could not be found.

.. php:exception:: MissingElementException
   :nocontentsentry:

    The chosen element file could not be found.

.. php:exception:: MissingCellException
   :nocontentsentry:

    The chosen cell class could not be found.

.. php:exception:: MissingCellViewException
   :nocontentsentry:

    The chosen cell view file could not be found.

.. php:namespace:: Cake\Controller\Exception

.. php:exception:: MissingComponentException
   :nocontentsentry:

    A configured component could not be found.

.. php:exception:: MissingActionException
   :nocontentsentry:

    The requested controller action could not be found.

.. php:exception:: PrivateActionException
   :nocontentsentry:

    Accessing private/protected/_ prefixed actions.

.. php:namespace:: Cake\Console\Exception

.. php:exception:: ConsoleException
   :nocontentsentry:

    A console library class encounter an error.

.. php:namespace:: Cake\Database\Exception

.. php:exception:: MissingConnectionException
   :nocontentsentry:

    A model's connection is missing.

.. php:exception:: MissingDriverException
   :nocontentsentry:

    A database driver could not be found.

.. php:exception:: MissingExtensionException
   :nocontentsentry:

    A PHP extension is missing for the database driver.

.. php:namespace:: Cake\ORM\Exception

.. php:exception:: MissingTableException
   :nocontentsentry:

    A model's table could not be found.

.. php:exception:: MissingEntityException
   :nocontentsentry:

    A model's entity could not be found.

.. php:exception:: MissingBehaviorException
   :nocontentsentry:

    A model's behavior could not be found.

.. php:exception:: PersistenceFailedException
   :nocontentsentry:

    An entity couldn't be saved/deleted while using :php:meth:`Cake\\ORM\\Table::saveOrFail()` or
    :php:meth:`Cake\\ORM\\Table::deleteOrFail()`.

.. php:namespace:: Cake\Datasource\Exception

.. php:exception:: RecordNotFoundException
   :nocontentsentry:

   The requested record could not be found. This will also set HTTP response
   headers to 404.

.. php:namespace:: Cake\Routing\Exception

.. php:exception:: MissingControllerException
   :nocontentsentry:

    The requested controller could not be found.

.. php:exception:: MissingRouteException
   :nocontentsentry:

    The requested URL cannot be reverse routed or cannot be parsed.

.. php:namespace:: Cake\Core\Exception

.. php:exception:: Exception
   :nocontentsentry:

    Base exception class in CakePHP. All framework layer exceptions thrown by
    CakePHP will extend this class.

These exception classes all extend :php:exc:`Exception`.
By extending Exception, you can create your own 'framework' errors.

.. php:method:: responseHeader($header = null, $value = null)
   :nocontentsentry:

    See :php:func:`Cake\\Network\\Request::header()`

All Http and Cake exceptions extend the Exception class, which has a method
to add headers to the response. For instance when throwing a 405
MethodNotAllowedException the rfc2616 says::

    "The response MUST include an Allow header containing a list of valid
    methods for the requested resource."


Customizing PHP Error Handling
==============================

By default PHP errors are rendered to console or HTML output, and also logged.
If necessary, you can swap out CakePHP's error handling logic with your own.

Custom Error Logging
--------------------

Error handlers use instances of ``Cake\Error\ErrorLoggingInterface`` to create
log messages and log them to the appropriate place. You can replace the error
logger using the ``Error.errorLogger`` configure value. An example error
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

Custom Error Rendering
----------------------

CakePHP includes error renderers for both web and console environments. If
however, you would like to replace the logic that renders errors you can create
a class::

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
configuration. You connect your custom error renderer to CakePHP via the
``Error.errorRenderer`` config value. When replacing error handling you will
need to account for both web and command line environments.

.. meta::
    :title lang=en: Error & Exception Handling
    :keywords lang=en: stack traces,error constants,error array,default displays,anonymous functions,error handlers,default error,error level,exception handler,php error,error handler,write error,core classes,exception handling,configuration error,application code,callback,custom error,exceptions,bitmasks,fatal error, http status codes
